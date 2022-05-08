import { FunctionalComponent, h } from "preact";
import style from "./style.scss";

const Home: FunctionalComponent = () => {
  return (
    <div class={style.home}>
      <h1 className="bg-red-900">Home</h1>
      <p>This is the Home component.</p>
    </div>
  );
};

export default Home;
