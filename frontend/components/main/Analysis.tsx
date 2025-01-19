import AnalyzedData from "../sub/AnalyzedData";
import Horoscope from "../sub/Horoscope";

const Analysis = () => {
  return (
    <div className="container min-w-screen mx-auto min-h-screen px-4 py-12 flex items-center justify-center">
      <Horoscope />
      {/* <AnalyzedData /> */}
    </div>
  );
};

export default Analysis;
