
import React, { useEffect, useState } from 'react';
import { Terminal } from './components/Terminal';
import { Controls } from './components/Controls';
import { AudioPlayer } from './components/AudioPlayer';
import { HelpPanel } from './components/HelpPanel';
import { EntryScreen } from './components/EntryScreen';
import { SignalIntrusion } from './components/SignalIntrusion';
import { SocialOverlay } from './components/SocialOverlay';
import { useGame } from './hooks/useGame';
import { GameStatus } from './types';

function App() {
  const { 
    status, 
    history, 
    player,
    processCommand, 
    startGame, 
    resetGame, 
    turnOff,
    setStatus
  } = useGame();

  const [hasEntered, setHasEntered] = useState(false);
  const [crtOn, setCrtOn] = useState(false);

  // Sync CRT visual state with GameStatus
  useEffect(() => {
    if (status !== GameStatus.OFF) {
      setCrtOn(true);
    } else {
      setCrtOn(false);
    }
  }, [status]);

  const handlePause = () => setStatus(GameStatus.PAUSED);
  const handleResume = () => setStatus(GameStatus.PLAYING);

  // Show Entry Screen first
  if (!hasEntered) {
    return <EntryScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Background Animation Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <video 
            src="https://github.com/heil-kaizen/Hawkins/raw/refs/heads/main/background%20animation.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
         />
         {/* Dark Overlay to prevent distraction */}
         <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Signal Intrusion Effect */}
      <SignalIntrusion crtOn={crtOn} />

      {/* Outer Case */}
      <div className="relative z-10 w-full max-w-6xl h-[85vh] bg-stone-800 rounded-lg p-4 shadow-2xl border-b-8 border-stone-900 flex flex-col">
        
        {/* Branding */}
        <div className="absolute top-0 left-0 w-full flex justify-center -mt-3">
          <div className="bg-stone-700 px-4 py-1 rounded text-xs font-bold tracking-widest text-stone-400 shadow shadow-black">
            TERMINAL // SYSTEM_85
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden bg-black rounded border-4 border-stone-700 relative shadow-inner">
          
          {/* CRT Effects Layer - Overlaying everything */}
          {crtOn && (
            <>
              <div className="scanlines pointer-events-none z-30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none z-30 mix-blend-overlay"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] pointer-events-none z-40"></div>
            </>
          )}

          {/* Main Content Area */}
          <div className={`flex flex-1 relative z-20 ${crtOn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
            {/* Terminal View */}
            <div className="flex-1 bg-black/90 relative overflow-hidden">
               {/* Screen Glow */}
               <div className="absolute inset-0 crt-glow pointer-events-none"></div>
               
               <Terminal 
                 history={history} 
                 onCommand={processCommand} 
                 isPaused={status === GameStatus.PAUSED}
                 isOff={status === GameStatus.OFF}
               />
            </div>
            
            {/* Help Panel (Desktop only) */}
            <HelpPanel player={player} />
          </div>
          
          {/* Power Off Video */}
          {!crtOn && (
             <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none bg-black">
                 <video 
                    src="https://github.com/heil-kaizen/Hawkins/raw/refs/heads/main/Hawkins%20Animation.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                 />
             </div>
          )}

        </div>

        {/* Physical Controls */}
        <Controls 
          status={status} 
          onStart={startGame}
          onRestart={resetGame}
          onPause={handlePause}
          onResume={handleResume}
          onOff={turnOff}
        />
      </div>

      <AudioPlayer status={status} />
      
      {/* Social Links Overlay */}
      <SocialOverlay />
    </div>
  );
}

export default App;
