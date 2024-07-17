import BackArrow from "./BackArrow";
import HomeButton from "./HomeButton";

const Controls = () => {
  return (
    <div className="fixed text-black top-6 left-12 flex items-center gap-4">
      <BackArrow />
      <HomeButton />
    </div>
  );
};

export default Controls;
