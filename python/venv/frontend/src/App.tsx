import { useEffect, useState, useCallback, useRef } from 'react'
import './App.css'


function App() {
  const [question, setQuestion] = useState<string>("");
  const [qHistory, setQHistory] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  //callBack because used in effect
  const sendRequest = useCallback(async () => {
    setLoading(() => true);
    //using touple, q represents question, a represents answer
    //when mapped over in jsx return sets visual state for
    //the side of the chat box.
    setQHistory((prev) => [...prev, ["q", question]]);

    //bind value from question to local so that we can 
    //imidiately clear the text box instead of waiting 
    //until after the fetch request fires
    const local = question;
    setQuestion(() => "");
    try {
      const response = await fetch('/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_input: local }),
      });

      const data = await response.json();
      setLoading(() => false);
      setQHistory((prev) => [...prev, ["a", data.response]]);

    } catch (e) {
      setLoading(() => false);
      setQHistory((prev) => [...prev, ["a", "An error occured"]]);
    }

    if (ref.current) {
      //when we get to the bottom of the box we need to scroll
      //to the ref element even if there is an error we want
      //to see the error response
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [question])

  //handle pressing enter
  useEffect(() => {
    const handleEnterpress = (event: KeyboardEvent) => {
      console.log(event.key)
      if (event.key === "Enter") {
        sendRequest();
      }
    };

    addEventListener('keydown', handleEnterpress);

    return () => {
      removeEventListener('keydown', handleEnterpress);
    }
  }, [sendRequest])

  return (
    <div className='p-4 flex justify-center items-center flex-1'
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg,var(--fallback-b1, oklch(var(--b1))),var(--fallback-b1, oklch(var(--b1))) 13px,var(--fallback-b2, oklch(var(--b2))) 13px,var(--fallback-b2, oklch(var(--b2))) 14px)",
      }}
    >
      <div className="mockup-window border bg-base-300 w-3/5 h-3/5 max-h-96 flex shadow-2xl">
        <div className="px-4 py-16 bg-base-200 flex-1 flex flex-col overflow-y-scroll">
          {/*map over history destructure the type of the response 
          * and the text itself, checking the type will place the 
          * chat box on the appropriate sides of the screen
          *
          * I opted for this in order to reduce the need of managing 
          * two sets of state for questions and answers sense
          * they shared essetially the same shapes and types.
          */}
          {qHistory.map(([type, text], i) => {
            return <div key={i + type} className={`${type === 'q' ? 'chat chat-start' : 'chat chat-end'}`}>
              <div className='chat-bubble'>{text}</div>
            </div>
          })}
          {loading ? <div className='loading-lg self-end'></div> : ''}
          {/*
          * We use this empty div as a target to scroll
          * too on every new entry into the qHistory State
          */}
          <div ref={ref}></div>
        </div>
        <div className="flex px-4 py-2 gap-4">
          <input className='input input-primary flex-1' value={question} onChange={(e) => setQuestion(() => e.target.value)} />
          <button className='btn btn-secondary' onClick={() => sendRequest()}>Submit question</button>
        </div>
      </div>
    </div>
  )
}

export default App
