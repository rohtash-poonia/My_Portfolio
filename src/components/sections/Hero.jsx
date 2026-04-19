import { SplineScene } from "../ui/Splite";
import { MENULINKS } from "../../constants/constants";

const Hero = () => {
  return (
    <section
      id={MENULINKS[0].ref}
      className="w-full min-h-screen relative flex justify-center items-center"
    >
      <div className="w-full h-[75%]">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-screen h-screen"
        />
      </div>
    </section>
  );
};

export default Hero;