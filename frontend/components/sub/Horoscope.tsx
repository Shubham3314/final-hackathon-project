import { Loader } from "lucide-react";
import { Button as MovingBorderButton } from "../ui/MovingBorder";

const Horoscope = () => {
  const horoscopeData = {
    sign: "leo",
    currentDate: "yesterday",
    description:
      "You might feel a surge of creativity and energy that propels you to take on new projects or hobbies. Trust your instincts and let your natural leadership skills shine through. This is a great time to connect with others and share your ideas.",
    compatibility: "Aries",
    mood: "Confident",
    color: "Gold",
    luckyNumber: "7",
    luckyTime: "3:00 PM",
  };

  return (
    <div className="w-[50%] mt-12 p-10 flex flex-col gap-10 ">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Horoscope <span className="text-purple-500">Details</span>
      </h2>
      <MovingBorderButton
        duration={9000}
        borderRadius="1.75rem"
        className="w-full text-white border-neutral-200 dark:border-slate-800"
      >
        <div className="p-6 md:p- w-full flex flex-col items-center">
          <video
            loop
            muted
            autoPlay
            playsInline
            preload="false"
            className="w-[80%] h-auto bg-transparent rounded-xl"
          >
            <source src="/videos/leo.webm" type="video/webm" />
          </video>
          <h3 className="text-xl md:text-2xl font-bold mb-4">
            {horoscopeData.sign} - {horoscopeData.currentDate}
          </h3>
          <p className="text-white-100 mb-6 font-semibold">
            {horoscopeData.description}
          </p>
          <ul className="text-md md:text-base font-medium space-y-2 text-start">
            <li>
              <strong>Compatibility:</strong> {horoscopeData.compatibility}
            </li>
            <li>
              <strong>Mood:</strong> {horoscopeData.mood}
            </li>
            <li>
              <strong>Color:</strong> {horoscopeData.color}
            </li>
            <li>
              <strong>Lucky Number:</strong> {horoscopeData.luckyNumber}
            </li>
            <li>
              <strong>Lucky Time:</strong> {horoscopeData.luckyTime}
            </li>
          </ul>
        </div>
      </MovingBorderButton>
      <div className="p-3 rounded-lg w-full text-sm bg-transparent text-gray-200  flex justify-center items-center space-x-2 ">
        <Loader className="h-10 w-10 animate-spin" />
        <span className="text-lg">Analyzing....</span>
      </div>
    </div>
  );
};

export default Horoscope;
