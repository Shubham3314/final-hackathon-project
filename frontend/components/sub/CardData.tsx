import React from "react";

// Define the type for a single gemstone
type Gemstone = {
  name: string;
  color: string;
  properties: string;
  benefits: string[];
};

// Define the props type for the component
type CardDataProps = {
  responseData: Record<string, Gemstone>; // Ensure the prop is an object with string keys and Gemstone values
};

const CardData: React.FC<CardDataProps> = ({ responseData }) => {
  // Convert the object into an array of values
  const gemstoneData = Object.values(responseData);

  return (
    <div className="w-full mt-12 p-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-8">
        Response <span className="text-purple-500">Details</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gemstoneData.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-lg shadow-md text-white"
          >
            <h3 className="text-xl font-bold mb-4 text-purple-400">
              {item.name}
            </h3>
            <p className="mb-4">
              <strong>Color:</strong> {item.color}
            </p>
            <p className="mb-4">
              <strong>Properties:</strong> {item.properties}
            </p>
            <ul className="text-sm space-y-2">
              <strong>Benefits:</strong>
              {item.benefits.map((benefit, i) => (
                <li key={i}>- {benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardData;
