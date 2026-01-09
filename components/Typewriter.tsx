import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  textColor?: string;
  onUpdate?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  textColor = 'text-green-500',
  onUpdate
}) => {
  const [displayedText, setDisplayedText] = useState('');
  
  // Use refs for callbacks to avoid dependency cycles in useEffect
  const onUpdateRef = useRef(onUpdate);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onCompleteRef.current = onComplete;
  }, [onUpdate, onComplete]);

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        // Use slice to ensure we always render a valid substring from the source
        // This prevents skipped characters if a render cycle is missed or race conditions occur
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        
        if (onUpdateRef.current) onUpdateRef.current();
      } else {
        clearInterval(intervalId);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <span className={`${textColor} whitespace-pre-wrap break-words`}>
      {displayedText}
    </span>
  );
};