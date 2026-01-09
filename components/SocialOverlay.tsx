
import React, { useState } from 'react';

export const SocialOverlay: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  // Update this string with the actual Contract Address later.
  // The logic supports both long sentences (words) and long strings (chars).
  const caValue = "coming soon"; 

  const getTruncated = (str: string) => {
    // If it's a long sentence (multiple words)
    // "only the first 3 and last 2 words should show"
    const words = str.split(' ');
    if (words.length > 5) {
      return `${words.slice(0, 3).join(' ')} ... ${words.slice(-2).join(' ')}`;
    }
    
    // If it's a single long string (like a typical crypto Contract Address)
    // Fallback to character truncation if no spaces are found to prevent layout breaking
    if (!str.includes(' ') && str.length > 15) {
       return `${str.slice(0, 6)}...${str.slice(-4)}`;
    }

    // Otherwise show full text (e.g. "coming soon")
    return str;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonBaseClass = "group relative flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-1 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full cursor-pointer overflow-hidden select-none";
  const glowClass = "absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer";

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex gap-4 items-center font-sans">
      
      {/* CA Button */}
      <button 
        onClick={handleCopy} 
        className={`${buttonBaseClass} px-6 py-3 min-w-[140px]`}
        title="Click to copy full address"
      >
        <div className={glowClass} />
        <span className="text-orange-400 font-bold mr-2 drop-shadow-md">CA:</span>
        <span className="text-orange-100 font-mono tracking-wide drop-shadow-md text-sm sm:text-base">
           {getTruncated(caValue)}
        </span>
        
        {/* Copied Feedback tooltip */}
        <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-green-400 text-xs py-1 px-3 rounded border border-green-500/30 transition-opacity duration-200 ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          COPIED!
        </div>
      </button>

      {/* Twitter / X Button */}
      <a 
        href="https://x.com/home" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${buttonBaseClass} w-12 h-12 text-white font-bold text-xl`}
      >
        <div className={glowClass} />
        <span className="drop-shadow-md">X</span>
      </a>

      {/* Shimmer Animation Style */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .group-hover\\:animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};
