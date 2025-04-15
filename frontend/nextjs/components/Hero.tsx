import Image from "next/image";
import React, { FC, useEffect, useState, useRef } from "react";
import InputArea from "./ResearchBlocks/elements/InputArea";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isVisible, setIsVisible] = useState(false);
  const [showGradient, setShowGradient] = useState(true);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Create particles for the background effect
    if (particlesContainerRef.current) {
      const container = particlesContainerRef.current;
      const particleCount = window.innerWidth < 768 ? 15 : 30; // Reduce particles on mobile
      
      // Clear any existing particles
      container.innerHTML = '';
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Random particle attributes
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 50 + 20;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Apply styles
        particle.className = 'absolute rounded-full bg-white';
        Object.assign(particle.style, {
          width: `${size}px`,
          height: `${size}px`,
          left: `${posX}%`,
          top: `${posY}%`,
          opacity: opacity.toString(),
          animation: `float ${duration}s ease-in-out ${delay}s infinite`,
        });
        
        container.appendChild(particle);
      }
    }
    
    // Add scroll event listener to show/hide gradient
    let lastScrollY = window.scrollY;
    const threshold = 100; // Amount of scroll before hiding gradient
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= threshold) {
        // At or near the top, show gradient
        setShowGradient(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down, hide gradient
        setShowGradient(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up, show gradient
        setShowGradient(true);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up function
    return () => {
      if (particlesContainerRef.current) {
        particlesContainerRef.current.innerHTML = '';
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  // Animation variants for consistent animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-visible min-h-[80vh] sm:min-h-[85vh] flex items-center pt-[60px] sm:pt-[80px] mt-[-60px] sm:mt-[-130px]">
      {/* Particle background */}
      <div ref={particlesContainerRef} className="absolute inset-0 -z-20"></div>
      
      <motion.div 
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center w-full py-6 sm:py-8 md:py-16 lg:pt-10 lg:pb-20"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="landing flex flex-col items-center mb-4 sm:mb-6 md:mb-8"
        >
          <motion.h1 
            className="text-3xl xs:text-4xl sm:text-5xl font-black text-center lg:text-7xl mb-1 sm:mb-2 tracking-tight"
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-2 xs:mb-3 sm:mb-1 md:mb-0">Say Goodbye to</div>
            <span
              style={{
                backgroundImage: 'linear-gradient(to right, #0cdbb6, #1fd0f0, #06dbee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
                lineHeight: '1.2',
                paddingBottom: '0.1em'
              }}
            >
              Hours of Research
            </span>
          </motion.h1>
          <h2 className="text-xl font-light text-center px-4 mb-10 md:mb-12 text-gray-300">
            Say Hello to GPT Researcher, your AI mate for rapid insights and comprehensive research
          </h2>
        </motion.div>

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
      </motion.div>
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
