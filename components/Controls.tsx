import React from 'react';
import { GameStatus } from '../types';

interface ControlsProps {
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onOff: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  status, onStart, onPause, onResume, onRestart, onOff 
}) => {
  const btnClass = "bg-gray-800 border-2 border-gray-600 text-gray-200 px-4 py-2 font-mono text-sm uppercase hover:bg-gray-700 active:border-green-500 transition-colors shadow-lg";

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-zinc-900 border-t border-zinc-700 justify-center">
      {status === GameStatus.OFF ? (
        <button onClick={onStart} className={`${btnClass} text-green-400 border-green-700`}>
          POWER ON
        </button>
      ) : (
        <>
          {status === GameStatus.PAUSED ? (
             <button onClick={onResume} className={`${btnClass} text-yellow-400`}>RESUME</button>
          ) : (
             <button onClick={onPause} className={btnClass}>PAUSE</button>
          )}
          <button onClick={onRestart} className={`${btnClass} text-red-400`}>RESTART</button>
          <button onClick={onOff} className={btnClass}>POWER OFF</button>
        </>
      )}
    </div>
  );
};