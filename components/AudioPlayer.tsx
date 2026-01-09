
import React, { useState, useEffect, useRef } from 'react';
import { AUDIO_TRACKS, LANDING_AUDIO_URL } from '../constants';
import { GameStatus } from '../types';

interface AudioPlayerProps {
  status: GameStatus;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ status }) => {
  const [trackIndex, setTrackIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  
  const landingRef = useRef<HTMLAudioElement>(null);
  const terminalRef = useRef<HTMLAudioElement>(null);

  // --- LANDING AUDIO LOGIC (Strictly for GameStatus.OFF) ---
  useEffect(() => {
    const landing = landingRef.current;
    if (!landing) return;

    if (status === GameStatus.OFF) {
      landing.volume = 0.6;
      const playPromise = landing.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented.
          // Add a one-time listener to start audio on interaction if we are still on the landing screen.
          const handleInteraction = () => {
             // We just try to play. If the user has already clicked "Power On" and changed state,
             // the cleanup/next-effect will handle pausing it immediately.
             landing.play().catch(() => {});
          };

          document.addEventListener('click', handleInteraction, { once: true });
          document.addEventListener('keydown', handleInteraction, { once: true });
        });
      }
    } else {
      // If NOT in OFF state, strictly stop the landing audio.
      landing.pause();
      landing.currentTime = 0;
    }

    // Cleanup to ensure it stops if component unmounts or state changes
    return () => {
       if (status !== GameStatus.OFF) {
         landing.pause();
         landing.currentTime = 0;
       }
    };
  }, [status]);

  // --- TERMINAL AUDIO LOGIC (For In-Game) ---
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    if (status === GameStatus.OFF) {
      // Reset terminal audio when powered off
      terminal.pause();
      terminal.currentTime = 0;
    } else if (status === GameStatus.PAUSED) {
      terminal.pause();
    } else {
      // PLAYING, START_SCREEN, VICTORY, GAME_OVER
      // Only play if currently paused to allow for resuming
      if (terminal.paused) {
          terminal.volume = 0.5;
          terminal.play().catch(e => console.log("Terminal play blocked", e));
      }
    }
  }, [status, trackIndex]);

  // --- PLAYLIST MANAGEMENT ---
  useEffect(() => {
      // When starting a new game session, reset playlist
      if (status === GameStatus.START_SCREEN) {
          setTrackIndex(0);
      }
  }, [status]);

  const handleTrackEnd = () => {
    setTrackIndex((prev) => {
        const next = prev + 1;
        if (next < AUDIO_TRACKS.length) return next;
        return 0; 
    });
  };

  const toggleMuted = () => setMuted(!muted);
  
  const nextTrack = () => {
      setTrackIndex((prev) => (prev + 1) % AUDIO_TRACKS.length);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Landing Audio (TV Static) - Loop */}
        <audio 
            ref={landingRef} 
            src={LANDING_AUDIO_URL} 
            loop 
            preload="auto"
            muted={muted}
        />
        
        {/* Terminal Audio (Music) - Playlist */}
        <audio 
            ref={terminalRef}
            src={AUDIO_TRACKS[trackIndex].url}
            preload="auto"
            muted={muted}
            onEnded={handleTrackEnd}
        />
        
        {/* Audio Controls - Visible only when NOT OFF */}
        {status !== GameStatus.OFF && (
            <div className="bg-gray-900 border border-green-800 p-2 rounded flex gap-2 text-xs font-mono text-green-500 shadow-[0_0_10px_rgba(0,255,0,0.2)]">
                <div className="flex flex-col text-right mr-2">
                    <span className="text-[10px] text-gray-400">NOW PLAYING</span>
                    <span className="max-w-[150px] truncate">{AUDIO_TRACKS[trackIndex].title}</span>
                </div>
                <button 
                    onClick={toggleMuted} 
                    className="hover:text-white border border-green-900 px-1 bg-black/50"
                >
                    {muted ? 'UNMUTE' : 'MUTE'}
                </button>
                <button 
                    onClick={nextTrack} 
                    className="hover:text-white border border-green-900 px-1 bg-black/50"
                >
                    NEXT
                </button>
            </div>
        )}
    </div>
  );
};
