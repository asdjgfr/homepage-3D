import { FunctionalComponent, h, createRef } from "preact";
import { useEffect, useRef } from "preact/hooks";
import style from "./style.scss";
import lottie from "lottie-web";

const Home: FunctionalComponent = () => {
  const lottieContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // make sure the animation is loaded
    lottie.loadAnimation({
      container: lottieContainer.current!, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/assets/data.json", // the path to the animation json
    });
  }, []);

  return (
    <div class={style.home}>
      <div style="width:200px;height:200px;" ref={lottieContainer}></div>
      <h1 className="bg-red-900">Home</h1>
      <p>This is the Home component.</p>
    </div>
  );
};

export default Home;
