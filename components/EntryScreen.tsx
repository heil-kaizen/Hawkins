
import React, { useState } from 'react';
import { Typewriter } from './Typewriter';

interface EntryScreenProps {
  onEnter: () => void;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter }) => {
  const [showButton, setShowButton] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url("https://raw.githubusercontent.com/heil-kaizen/Hawkins/main/entry.png")' }}
      />
      
      {/* Overlay Gradients/Scanlines for integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="scanlines absolute inset-0 opacity-50 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-6 max-w-3xl w-full text-center">
        
        {/* Warning Box - Made less visible (lower opacity) and smaller padding */}
        <div className="bg-black/40 border-l-2 border-r-2 border-green-600/70 p-6 md:p-8 backdrop-blur-sm w-full shadow-lg">
          {/* Text Size Reduced */}
          <div className="font-mono text-lg md:text-2xl text-green-500 font-bold tracking-wider min-h-[3rem] flex items-center justify-center shadow-green-500/30 drop-shadow-md">
             {/* Text with Glow Effect */}
            <Typewriter 
              text="[ system warning: Anomaly detected - location: Hawkins ]" 
              speed={40}
              onComplete={() => setShowButton(true)}
              textColor="text-green-500 crt-glow"
            />
          </div>
        </div>

        {/* Enter Button */}
        <div className={`transition-all duration-1000 transform ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onEnter}
            className="group relative px-10 py-4 bg-transparent overflow-hidden focus:outline-none"
          >
            {/* Button Background & Border */}
            <div className="absolute inset-0 w-full h-full bg-green-900/30 border-2 border-green-500/80 group-hover:bg-green-500/30 transition-all duration-300 transform -skew-x-12 box-border" />
            
            {/* Button Text */}
            <span className="relative font-mono text-xl text-green-400 font-bold tracking-[0.2em] group-hover:text-white transition-colors shadow-black drop-shadow-md animate-pulse">
              ENTER
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
