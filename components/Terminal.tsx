import React, { useRef, useEffect, useState } from 'react';
import { Typewriter } from './Typewriter';
import { LogEntry } from '../types';

interface TerminalProps {
  history: LogEntry[];
  onCommand: (cmd: string) => void;
  isPaused: boolean;
  isOff: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ history, onCommand, isPaused, isOff }) => {
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  // Auto scroll to bottom when history changes (new block added)
  useEffect(() => {
    scrollToBottom('smooth');
  }, [history]);

  // Keep focus on input unless paused
  useEffect(() => {
    const handleFocus = () => {
      if (!isPaused && !isOff && inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    // Initial focus
    handleFocus();

    // Re-focus on click
    document.addEventListener('click', handleFocus);
    return () => document.removeEventListener('click', handleFocus);
  }, [isPaused, isOff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isPaused || isOff) return;
    onCommand(inputValue);
    setInputValue('');
  };

  if (isOff) return <div className="w-full h-full bg-black" />;

  return (
    <div className="flex flex-col h-full w-full p-4 font-mono text-lg md:text-xl overflow-hidden relative z-20">
      {/* History Output */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-1">
        {history.map((entry, idx) => {
          // Calculate color based on type
          let color = 'text-green-500';
          if (entry.type === 'error') color = 'text-red-500';
          if (entry.type === 'combat') color = 'text-red-400';
          if (entry.type === 'system') color = 'text-blue-400';
          if (entry.type === 'success') color = 'text-yellow-400';

          const isLast = idx === history.length - 1;

          return (
            <div key={entry.id} className="leading-tight">
              {isLast ? (
                <Typewriter 
                  text={entry.text} 
                  textColor={color} 
                  speed={20} 
                  onUpdate={() => scrollToBottom('auto')} // Instant scroll for typing
                />
              ) : (
                <span className={`${color} whitespace-pre-wrap break-words`}>{entry.text}</span>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex items-center border-t border-green-900/50 pt-2 mt-2">
        <span className="text-green-500 mr-2 blink">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400 font-inherit uppercase placeholder-green-900"
          placeholder={isPaused ? "SYSTEM PAUSED" : "AWAITING COMMAND..."}
          disabled={isPaused}
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};