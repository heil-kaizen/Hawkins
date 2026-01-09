import { Player, LogEntry } from '../types';

const KEY = 'RETRO_RPG_SAVE_V1';

interface SaveData {
  player: Player;
  history: LogEntry[];
  savedAt: number;
}

export const saveGame = (player: Player, history: LogEntry[]) => {
  const data: SaveData = {
    player,
    history: history.slice(-50), // Only save last 50 lines to save space
    savedAt: Date.now(),
  };
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const loadGame = (): SaveData | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Save file corrupted", e);
    return null;
  }
};

export const clearSave = () => {
  localStorage.removeItem(KEY);
};