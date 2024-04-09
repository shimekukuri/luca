from flask import Flask, send_from_directory, request, jsonify, session
from flask_mysqldb import MySQL
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import uuid
import torch
import os
import time

mysql = MySQL()

# Get all environment variables
env_variables = os.environ


app = Flask(__name__)
app.secret_key = "super_secret_key"

app.config['MYSQL_HOST'] = 'mysql'
app.config['MYSQL_USER'] = env_variables.get('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = env_variables.get('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = env_variables.get('MYSQL_DATABASE')
app.config['MYSQL_ROOT_PASSWORD'] = env_variables.get('MYSQL_ROOT_PASSWORD')

db = MySQL(app)

# Wait for DB to initailize to run migrations
# Did this to remove the need for migration dependency
time.sleep(10)


def create_database():
    # create db if it doesn't exist
    with app.app_context():
        # Connect to MySQL server
        con = mysql.connection
        cursor = con.cursor()

        # Get database name from app config
        db_name = app.config['MYSQL_DB']

        try:
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
            print("Database created successfully or already exists.")
        except Exception:
            print("Error creating database")
        finally:
            # Close cursor and commit changes
            cursor.close()
            con.commit()


create_database()
time.sleep(10)


def create_tables():
    # create tables if they don't exist
    with app.app_context():
        cur = mysql.connection.cursor()

        create_table_session = """
        CREATE TABLE IF NOT EXISTS session (
            session_id VARCHAR(255)  PRIMARY KEY
        )
        """
        create_table_question = """
        CREATE TABLE IF NOT EXISTS question (
            question_id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(255),
            question_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES session(session_id)
        )
        """

        create_table_answer = """
        CREATE TABLE IF NOT EXISTS answer (
            answer_id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(255),
            answer_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES session(session_id)
        )
        """

        cur.execute(create_table_session)
        cur.execute(create_table_question)
        cur.execute(create_table_answer)

        mysql.connection.commit()

        cur.close()


create_tables()

# initiallize model
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)
model.eval()


@app.route('/')
def serve_index():
    # Generate a UUID
    session_id = str(uuid.uuid4())

    # Set the UUID as a session cookie
    session['session_id'] = session_id

    return send_from_directory('dist', 'index.html')


@app.route('/chat', methods=['POST'])
def chat():
    if request.method == 'POST':
        session_id = session.get("session_id")
        user_input = request.json.get('user_input', '')

        cur = mysql.connection.cursor()

        # Check if session exists, create if not
        cur.execute(
            "SELECT session_id FROM session WHERE session_id = %s", (session_id,))
        existing_session = cur.fetchone()

        if not existing_session:
            cur.execute(
                "INSERT INTO session (session_id) VALUES (%s)", (session_id,))
            mysql.connection.commit()

        # Insert question into database with session_id as foreign key
        cur.execute("INSERT INTO question (session_id, question_text) VALUES (%s, %s)",
                    (session_id, user_input))
        mysql.connection.commit()

        # Get AI generated response
        input_ids = tokenizer.encode(user_input, return_tensors="pt")
        with torch.no_grad():
            output = model.generate(
                input_ids,
                min_length=10,
                max_length=20,
                num_return_sequences=1,
                pad_token_id=tokenizer.eos_token_id,
            )
        generated_output = output[:, input_ids.shape[-1]:]
        response = tokenizer.decode(
            generated_output[0], skip_special_tokens=True)

        # Insert answer into database with session_id as foreign key
        cur.execute("INSERT INTO answer (session_id, answer_text) VALUES (%s, %s)",
                    (session_id, response))
        mysql.connection.commit()

        cur.close()

        return jsonify({'response': response})

    return jsonify({'error': 'Invalid request method'}), 405


# Get sessions chat logs
@app.route('/session', methods=['POST'])
def handle_session():
    if request.method == 'POST':
        session_id = request.json.get('session_id')
        if not session_id:
            return jsonify({'error': 'Session ID not provided'}), 400

        try:
            cur = mysql.connection.cursor()
            query = """
                SELECT
                    q.question_text,
                    a.answer_text
                FROM
                    question q
                LEFT JOIN
                    answer a ON q.session_id = a.session_id
                WHERE
                    q.session_id = %s
                ORDER BY
                    IFNULL(a.created_at, q.created_at) DESC
            """
            cur.execute(query, (session_id,))
            results = cur.fetchall()

            question_answer_pairs = {}
            for row in results:
                question_text = row[0]
                answer_text = row[1]
                if question_text not in question_answer_pairs:
                    question_answer_pairs[question_text] = answer_text

            unique_pairs = [{'question_text': q, 'answer_text': a}
                            for q, a in question_answer_pairs.items()]

            return jsonify(unique_pairs), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid request method'}), 405


@app.route('/allsession')
def handle_get_session():
    cur = mysql.connection.cursor()

    query = """
        SELECT * FROM session
        """
    cur.execute(query)

    response = cur.fetchall()

    cur.close

    return jsonify(response)


@app.route('/testanswer')
def handle_test_answer():
    cur = mysql.connection.cursor()
    query = """
        SELECT * FROM answer
        """
    cur.execute(query)

    response = cur.fetchall()

    cur.close

    return jsonify(response)


@app.route('/testquestion')
def handle_test_question():
    cur = mysql.connection.cursor()
    query = """
        SELECT * FROM question
        """
    cur.execute(query)

    response = cur.fetchall()

    cur.close

    return jsonify(response)


@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('dist', filename)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory('dist', 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
