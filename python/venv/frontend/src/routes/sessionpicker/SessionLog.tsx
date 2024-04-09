import { useLoaderData } from "react-router";
import { Link } from "react-router-dom";

export async function SessionLoader() {
  try {
    const response = await fetch('/allsession');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.error("An unexpected error was encountered", e);
    return [];
  }
}

export default function SessionPicker() {
  const data = useLoaderData() as [string[]];
  console.log("loader data: ", data);

  return (<div className="flex-1 flex justify-center items-center flex-wrap gap-4">
    {data.map((x) => <Link to={`/session/${x[0]}`} className="aspect-square bg-secondary-content">{x[0]}</Link>)}
  </div>);
}
