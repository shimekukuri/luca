import { Outlet } from "react-router";
import { useEffect } from 'react'
import { themeChange } from 'theme-change'
import { Link } from "react-router-dom";

export default function Layout() {

  //used for changing the theme from the theme change npm package
  useEffect(() => {
    themeChange(false)
  }, []);

  return (
    <div className="bg-secondary flex flex-col min-h-screen">
      <div className="sticky top-0 left-0 right-0 h-16 bg-primary flex items-center p-4 justify-between">
        <div className="px-4 flex gap-4">
          <Link to={'/'} className="btn btn-secondary">Home</Link>
          <Link to={'/session'} className="btn btn-secondary">Session Logs</Link>
        </div>
        <div className="flex gap-4 items-center">
          <div>Theme:</div>
          <select data-choose-theme className="select select-primary">
            <option value="">Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="cupcake">Cupcake</option>
            <option value="bumblebee">Bumblebee</option>
            <option value="emerald">Emerald</option>
            <option value="corporate">corporate</option>
            <option value="synthwave">synthwave</option>
            <option value="retro">retro</option>
            <option value="cyberpunk">cyberpunk</option>
            <option value="valentine">valentine</option>
            <option value="halloween">halloween</option>
            <option value="garden">garden</option>
            <option value="forest">forest</option>
            <option value="aqua">aqua</option>
            <option value="lofi">lofi</option>
            <option value="pastel">pastel</option>
            <option value="fantasy">fantasy</option>
            <option value="wireframe">wireframe</option>
            <option value="black">black</option>
            <option value="luxury">luxury</option>
            <option value="dracula">dracula</option>
            <option value="cmyk">cmyk</option>
            <option value="autumn">autumn</option>
            <option value="business">business</option>
            <option value="acid">acid</option>
            <option value="lemonade">lemonade</option>
            <option value="night">night</option>
            <option value="coffee">coffee</option>
            <option value="winter">winter</option>
            <option value="dim">dim</option>
            <option value="nord">nord</option>
            <option value="sunset">sunset</option>
          </select>
        </div>
      </div>
      <div className="flex-1 flex">
        <Outlet />
      </div>
      <div className="bg-accent">Footer</div>
    </div>
  );
}
