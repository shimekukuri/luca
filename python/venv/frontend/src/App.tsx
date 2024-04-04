import { useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState<string>("");
  const [qHistory, setQHistory] = useState<[string, string][]>([]);


  const sendRequest = async () => {
    setQHistory((prev) => [...prev, ["q", question]]);
    const response = await fetch('/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_input: question }),
    });

    const data = await response.json();

    setQHistory((prev) => [...prev, ["a", data.response]]);

    setQuestion(() => "");
  }

  return (
    <div className='p-4 flex justify-center items-center flex-1'>
      <div className="mockup-window border bg-base-300 w-3/5 h-3/5 flex shadow-2xl">
        <div className="px-4 py-16 bg-base-200 flex-1 flex flex-col overflow-y-scroll">
          {qHistory.map(([type, text]) => {
            return <div className={`${type === 'q' ? 'chat chat-start' : 'chat chat-end'}`}>
              <div className='chat-bubble'>{text}</div>
            </div>
          })}
        </div>
        <h1>AI Chatbot</h1>
        <div className="">
          <input value={question} onChange={(e) => setQuestion(() => e.target.value)} />
          <button className='btn btn-primary' onClick={() => sendRequest()}>Submit question</button>
        </div>
      </div>
    </div>
  )
}

export default App
