import { Params, useLoaderData } from "react-router";

export async function SessionLogLoader({ params }: { params: Params }) {
  try {
    const response = await fetch('/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: params.session_id })
    });

    const data = response.json();
    console.log("From loader", data);

    return data;
  } catch (e) {
    console.error("Ecountered unexpected error", e);
    return [];
  }
}

interface serverResponse {
  answer_text: string;
  question_text: string;
}

export default function SessionLog() {
  const data = useLoaderData() as serverResponse[];

  console.log("From inside of the SessionLog", data);

  return <div className="flex-1 justify-center items-center flex gap-4 flex-col">
    {data.length ? data.map(({ question_text, answer_text }) => {
      return <div className="rounded-2xl shadow-2xl bg-primary-content p-4">
        <div className="text-secondary-content-content">Question: {question_text}</div>
        <div>Answer: {answer_text}</div>
      </div>
    }) : ''}
  </div>

}
