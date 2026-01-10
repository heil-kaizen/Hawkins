
import React, { useEffect, useState, useRef } from 'react';
import { Terminal } from './components/Terminal';
import { Controls } from './components/Controls';
import { AudioPlayer } from './components/AudioPlayer';
import { HelpPanel } from './components/HelpPanel';
import { EntryScreen } from './components/EntryScreen';
import { SignalIntrusion } from './components/SignalIntrusion';
import { SocialOverlay } from './components/SocialOverlay';
import { useGame } from './hooks/useGame';
import { GameStatus } from './types';
import { LANDING_AUDIO_URL } from './constants';

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
  
  // Media Refs for Synchronization
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const landingAudioRef = useRef<HTMLAudioElement>(null);
  const [mediaReady, setMediaReady] = useState({ video: false, audio: false });

  // Sync CRT visual state with GameStatus
  useEffect(() => {
    if (status !== GameStatus.OFF) {
      setCrtOn(true);
      // Stop landing audio when game starts
      if (landingAudioRef.current) {
        landingAudioRef.current.pause();
      }
    } else {
      setCrtOn(false);
      // Play landing audio if returning to OFF state (and past entry screen)
      if (hasEntered && landingAudioRef.current) {
        landingAudioRef.current.currentTime = 0;
        landingAudioRef.current.play().catch(e => console.log("Audio play blocked", e));
        if (bgVideoRef.current) bgVideoRef.current.play().catch(() => {});
      }
    }
  }, [status, hasEntered]);

  const handlePause = () => setStatus(GameStatus.PAUSED);
  const handleResume = () => setStatus(GameStatus.PLAYING);

  // Check Media Readiness
  useEffect(() => {
    const video = bgVideoRef.current;
    const audio = landingAudioRef.current;
    
    if (video) {
        if (video.readyState >= 3) {
            setMediaReady(prev => ({ ...prev, video: true }));
        } else {
            video.oncanplaythrough = () => setMediaReady(prev => ({ ...prev, video: true }));
        }
    }
    
    if (audio) {
        if (audio.readyState >= 3) {
            setMediaReady(prev => ({ ...prev, audio: true }));
        } else {
            audio.oncanplaythrough = () => setMediaReady(prev => ({ ...prev, audio: true }));
        }
    }
  }, []);

  const handleEnter = () => {
      // Sync Start
      if (bgVideoRef.current && landingAudioRef.current) {
          bgVideoRef.current.currentTime = 0;
          landingAudioRef.current.currentTime = 0;
          
          const playVideo = bgVideoRef.current.play();
          const playAudio = landingAudioRef.current.play();
          
          Promise.all([playVideo, playAudio]).then(() => {
             setHasEntered(true);
          }).catch(err => {
              console.error("Playback failed", err);
              // Force enter anyway if playback fails (fallback)
              setHasEntered(true);
          });
      } else {
          setHasEntered(true);
      }
  };

  const isReady = mediaReady.video && mediaReady.audio;

  return (
    <div className="relative min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* PRELOADED MEDIA LAYERS */}
      
      {/* 1. Background Video (Synced) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <video 
            ref={bgVideoRef}
            src="https://github.com/heil-kaizen/Hawkins/raw/refs/heads/main/background%20animation.mp4"
            loop
            muted
            playsInline
            preload="auto"
            className={`w-full h-full object-cover opacity-60 ${!hasEntered ? 'hidden' : 'block'}`}
         />
         {/* Dark Overlay to prevent distraction */}
         <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* 2. Landing Audio (Synced) */}
      <audio 
        ref={landingAudioRef} 
        src={LANDING_AUDIO_URL} 
        loop 
        preload="auto"
        className="hidden"
      />

      {/* Entry Screen Overlay */}
      {!hasEntered && (
        <EntryScreen onEnter={handleEnter} isReady={isReady} />
      )}

      {/* Signal Intrusion Effect */}
      {hasEntered && <SignalIntrusion crtOn={crtOn} />}

      {/* Outer Case - Only show after entry */}
      <div className={`relative z-10 w-full max-w-6xl h-[85vh] bg-stone-800 rounded-lg p-4 shadow-2xl border-b-8 border-stone-900 flex flex-col transition-opacity duration-500 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
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
          
          {/* Power Off Video (Inside Terminal) */}
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
      {hasEntered && <SocialOverlay />}
    </div>
  );
}

export default App;
