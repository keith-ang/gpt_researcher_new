import Image from "next/image";
import React, { FC } from "react";
import InputArea from "./ResearchBlocks/elements/InputArea";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: (query : string) => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-8 md:py-12 lg:pt-8 lg:pb-16">
        <div className="landing flex flex-col items-center mb-8 md:mb-12">
          <h1 className="text-4xl font-extrabold text-center lg:text-7xl mb-6">
            Say Goodbye to <br />
            <span
              style={{
                backgroundImage: 'linear-gradient(to right, #9867F0, #ED4E50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Hours of Research
            </span>
          </h1>
          <h2 className="text-xl font-light text-center px-4 mb-10 md:mb-12 text-gray-300">
            Say Hello to Quest Research, your AI mate for rapid insights and comprehensive research
          </h2>
        </div>

        {/* Input section */}
        <div className="w-full max-w-[708px] pb-8 md:pb-10 px-4">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleSubmit={handleDisplayResult}
          />
        </div>

        {/* Suggestions section */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pb-8 md:pb-10 px-4 lg:flex-nowrap lg:justify-normal">
          {suggestions.map((item) => (
            <div
              className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded border border-solid border-[#C1C1C1] bg-[#EDEDEA] px-2.5 py-2"
              onClick={() => handleClickSuggestion(item?.name)}
              key={item.id}
            >
              <img
                src={item.icon}
                alt={item.name}
                width={18}
                height={16}
                className="w-[18px]"
              />
              <span className="text-sm font-light leading-[normal] text-[#1B1B16]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: suggestionType[] = [
  {
    id: 1,
    name: "Stock analysis on ",
    icon: "/img/stock2.svg",
  },
  {
    id: 2,
    name: "Help me plan an adventure to ",
    icon: "/img/hiker.svg",
  },
  {
    id: 3,
    name: "What are the latest news on ",
    icon: "/img/news.svg",
  },
];

export default Hero;
