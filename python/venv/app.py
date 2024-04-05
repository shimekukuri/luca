from flask import Flask, send_from_directory, request, jsonify
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

app = Flask(__name__)

model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)
model.eval()


@app.route('/')
def serve_index():
    return send_from_directory('dist', 'index.html')


model.eval()


@app.route('/chat', methods=['POST'])
def chat():
    if request.method == 'POST':
        user_input = request.json.get('user_input', '')
        input_ids = tokenizer.encode(user_input, return_tensors="pt")

        # Generate response
        with torch.no_grad():
            output = model.generate(
                input_ids,
                min_length=10,
                max_length=20,
                num_return_sequences=1,
                pad_token_id=tokenizer.eos_token_id,
            )
    generated_output = output[:, input_ids.shape[-1]:]
    response = tokenizer.decode(generated_output[0], skip_special_tokens=True)
    return jsonify({'response': response})


# Serve other static files from the 'list' directory


@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('dist', filename)


if __name__ == '__main__':
    app.run(debug=True)
