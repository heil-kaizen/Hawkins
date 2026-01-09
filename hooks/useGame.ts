
import { useState, useEffect, useCallback } from 'react';
import { 
  Player, GameStatus, GameMode, LogEntry, ClassType, 
  Stats, Enemy, Location 
} from '../types';
import { 
  WORLD_MAP, CLASS_STATS, INITIAL_LOG, ENEMIES, ASCII_ART, ASCII_MAP_FULL 
} from '../constants';
import { saveGame, loadGame, clearSave } from '../services/storageService';

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- DICE MECHANICS ---
const rollDice = (count: number, sides: number) => {
  let total = 0;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }
  return { total, rolls };
};

const parseDice = (diceString: string) => {
  const [count, sides] = diceString.toLowerCase().split('d').map(Number);
  return { count: count || 1, sides: sides || 6 };
};

export const useGame = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.OFF);
  const [mode, setMode] = useState<GameMode>(GameMode.EXPLORE);
  const [creationStep, setCreationStep] = useState<'NAME' | 'CLASS'>('NAME');
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [player, setPlayer] = useState<Player>({
    name: 'Stranger',
    class: null,
    stats: { ...CLASS_STATS[ClassType.FIGHTER] }, // Default fallback
    inventory: [],
    currentLocationId: 'town_square',
    previousLocationId: undefined,
    flags: {},
    killCount: 0,
    isGuarding: false,
    tempDefenseBonus: 0
  });
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);

  // Helper to add logs
  const log = useCallback((text: string, type: LogEntry['type'] = 'info') => {
    setHistory(prev => [...prev, { id: generateId(), text, type, timestamp: Date.now() }]);
  }, []);

  // Initialization
  const startGame = () => {
    const saved = loadGame();
    if (saved) {
      setPlayer(saved.player);
      setHistory(saved.history);
      log("SAVED SESSION RESTORED.", 'system');
      setStatus(GameStatus.PLAYING);
    } else {
      setStatus(GameStatus.START_SCREEN);
      setCreationStep('NAME');
      // Set initial log and prompt for name
      const initLogs = INITIAL_LOG.map((text, i) => ({ 
        id: `init-${i}`, text, type: 'info' as const, timestamp: Date.now() 
      }));
      setHistory([
        ...initLogs,
        { id: generateId(), text: "PLEASE ENTER USER IDENTITY:", type: 'system', timestamp: Date.now() }
      ]);
    }
  };

  const resetGame = () => {
    clearSave();
    setHistory([]);
    setPlayer({
      name: 'Stranger',
      class: null,
      stats: { ...CLASS_STATS[ClassType.FIGHTER] },
      inventory: [],
      currentLocationId: 'town_square',
      flags: {},
      killCount: 0,
      isGuarding: false,
      tempDefenseBonus: 0
    });
    setMode(GameMode.EXPLORE);
    setCurrentEnemy(null);
    setCreationStep('NAME');
    setStatus(GameStatus.START_SCREEN);
    log("SYSTEM REBOOTED. MEMORY CLEARED.", 'system');
    log("PLEASE ENTER USER IDENTITY:", 'system');
  };

  // Turn off
  const turnOff = () => {
    setStatus(GameStatus.OFF);
  };

  const handleStartScreen = (cmd: string) => {
    if (creationStep === 'NAME') {
      if (!cmd) return;
      const cleanName = cmd.toUpperCase().substring(0, 15);
      setPlayer(prev => ({ ...prev, name: cleanName }));
      setCreationStep('CLASS');
      log(`IDENTITY CONFIRMED: ${cleanName}`, 'success');
      log("SELECT CLASS: FIGHTER, MAGE, ROGUE", 'system');
      return;
    }

    if (creationStep === 'CLASS') {
      if (['fighter', 'mage', 'rogue'].includes(cmd)) {
        const cls = cmd.toUpperCase() as ClassType;
        setPlayer(prev => ({
          ...prev,
          class: cls,
          stats: { ...CLASS_STATS[cls] }
        }));
        setStatus(GameStatus.PLAYING);
        log(`CLASS CONFIRMED: ${cls}.`, 'success');
        log("INITIATING NEURAL LINK...", 'info');
        setTimeout(() => look(WORLD_MAP['town_square']), 1000);
      } else {
        log("INVALID CLASS. CHOOSE FIGHTER, MAGE, OR ROGUE.", 'error');
      }
      return;
    }
  };

  // Exploration Logic
  const handleExploration = (cmd: string) => {
    const location = WORLD_MAP[player.currentLocationId];
    
    // Direction aliases
    const aliases: Record<string, string> = {
      'n': 'north', 's': 'south', 'e': 'east', 'w': 'west',
      'ne': 'northeast', 'nw': 'northwest', 'se': 'southeast', 'sw': 'southwest',
      'u': 'up', 'd': 'down'
    };
    const finalCmd = aliases[cmd] || cmd;

    if (['north', 'south', 'east', 'west', 'up', 'down', 'enter', 'exit', 'back', 'northeast', 'northwest', 'southeast', 'southwest'].includes(finalCmd)) {
      move(finalCmd, location);
    } else if (finalCmd === 'return') {
      if (player.previousLocationId) {
        log("↩ You retrace your steps.", 'info');
        // 'return' uses 'false' for encounter check to avoid encounter triggering on return
        changeLocation(player.previousLocationId, false);
      } else {
        log("You cannot return from here.", 'error');
      }
    } else if (finalCmd === 'look' || finalCmd === 'l') {
      // Force look to treat as visited so we don't clear the flag, but we respect the flag for short/long
      look(location);
    } else if (finalCmd === 'map') {
      // MAP FRAGMENTS LOGIC
      const fragments = player.inventory.filter(i => i.startsWith('map_fragment'));
      const visitedLocs = Object.values(WORLD_MAP).filter(l => player.flags[`visited_${l.id}`]);
      
      if (fragments.length >= 4) {
          log("MAP RESTORED: Hawkins is fully revealed.", 'success');
          log(ASCII_MAP_FULL, 'info');
      } else {
          log(`--- EXPLORED LOCATIONS (Fragments: ${fragments.length}/4) ---`, 'system');
          visitedLocs.forEach(l => log(`- ${l.name}`, 'info'));
      }
    } else if (finalCmd === 'status') {
      showStatus();
    } else if (finalCmd === 'help') {
      log("EXPLORE: DIRECTIONS (N/S/E/W), RETURN, LOOK, MAP, STATUS", 'system');
    } else if (finalCmd === 'inventory' || finalCmd === 'inv') {
      log(`INVENTORY: ${player.inventory.length ? player.inventory.join(', ') : 'EMPTY'}`, 'info');
    } else if (finalCmd.startsWith('take ')) {
        const item = finalCmd.replace('take ', '').trim().toLowerCase().replace(/ /g, '_');
        if (location.items && location.items.includes(item)) {
            // Check inventory limit? (Optional)
            setPlayer(prev => ({
                ...prev,
                inventory: [...prev.inventory, item]
            }));
            // Remove item from location (local state handling is tricky without deep copy of MAP, but for this simplified version we'll just log it)
            // Ideally we'd remove it from the map state, but the map is a constant. 
            // We'll simulate it by checking inventory in the 'look' command or just letting them have duplicates (simple) or filter it out.
            // For now, let's just add it.
            log(`Taken: ${item.toUpperCase()}`, 'success');
        } else {
            log("That item is not here.", 'error');
        }
    } else {
      log("UNKNOWN COMMAND.", 'error');
    }
  };

  const move = (dir: string, loc: Location) => {
    const exitId = loc.exits[dir];
    
    // BOUNDARY HANDLING
    if (!exitId) {
      // Locked Check
      if (loc.lockedExits && loc.lockedExits[dir]) {
        const lock = loc.lockedExits[dir];
        
        // CHECK IF UNLOCKED VIA FLAG
        if (lock.unlockFlag && player.flags[lock.unlockFlag]) {
             // Implicitly proceed to the locked exit's logic (falls through to next block if exitId exists there, but here it doesn't)
             // Wait, if lockedExits is defined, usually the exitId is NOT in the main exits list in this engine, 
             // OR it IS in exits but we guard it. 
             // In this engine, lockedExits usually implies 'enter' exists but is guarded.
             // If exitId is undefined, it means strictly no path unless we define one.
        } else if (lock.requiredClass && player.class !== lock.requiredClass) {
             log(`LOCKED: ${lock.reason} (REQUIRES ${lock.requiredClass})`, 'error');
             return;
        } else if (!lock.requiredClass && !lock.unlockFlag) {
             log(`LOCKED: ${lock.reason}`, 'error');
             return;
        }
      } else {
          log(`❌ You cannot go ${dir.toUpperCase()}.`, 'error');
          // Check for "Under Construction" trigger
          if (loc.isConstruction) {
              log("⚠️ UNDER CONSTRUCTION ⚠️", 'error');
          }
          return;
      }
    }

    // -- VALID EXIT FOUND, CHECK LOCKS --
    if (loc.lockedExits && loc.lockedExits[dir]) {
        const lock = loc.lockedExits[dir];
        
        // Check Unlock Flag
        if (lock.unlockFlag && player.flags[lock.unlockFlag]) {
            // Allowed.
        }
        // Check Class Requirement
        else if (lock.requiredClass) {
            if (player.class === lock.requiredClass) {
                 log(`YOU FORCE YOUR WAY THROUGH.`, 'success');
            } else {
                 log(`LOCKED: ${lock.reason} (REQUIRES ${lock.requiredClass})`, 'error');
                 return;
            }
        } else {
             // Standard lock with no bypass met
             log(`LOCKED: ${lock.reason}`, 'error');
             return;
        }
    }
    
    // If exitId exists (and not blocked by locks that return), change location
    if (exitId) changeLocation(exitId);
  };

  const changeLocation = (newLocId: string, checkForEncounters = true) => {
    const newLoc = WORLD_MAP[newLocId];
    
    // UNDER CONSTRUCTION CHECK
    if (newLoc.isConstruction) {
        log("You hit a wall of static.", 'error');
        log("⚠️ UNDER CONSTRUCTION ⚠️", 'error');
        return; // Do not move
    }

    const previousId = player.currentLocationId;
    
    // Update player state
    const updatedPlayer = { 
        ...player, 
        currentLocationId: newLocId,
        previousLocationId: previousId,
        isGuarding: false,
        tempDefenseBonus: 0,
        flags: { ...player.flags, [`visited_${newLocId}`]: true }
    };
    setPlayer(updatedPlayer);

    let encounterTriggered = false;

    if (checkForEncounters) {
        // 1. Check for Static/Boss Enemies
        if (newLoc.enemyId && !updatedPlayer.flags[`killed_${newLoc.enemyId}`]) {
          const enemy = ENEMIES[newLoc.enemyId];
          if (enemy) {
            triggerEncounter(enemy, newLoc);
            encounterTriggered = true;
          }
        }

        // 2. If no static enemy, check for Random Encounters
        if (!encounterTriggered && newLoc.randomEncounters) {
          for (const encounter of newLoc.randomEncounters) {
            if (Math.random() < encounter.chance) {
              const enemyTemplate = ENEMIES[encounter.enemyId];
              if (enemyTemplate) {
                const randomEnemy = { 
                  ...enemyTemplate,
                  id: `${encounter.enemyId}_rand_${Date.now()}` 
                };
                triggerEncounter(randomEnemy, newLoc, true);
                encounterTriggered = true;
                break; 
              }
            }
          }
        }
    }

    // Check triggers (Story events) - Only if no combat
    if (!encounterTriggered && newLoc.triggers) {
      const event = newLoc.triggers(updatedPlayer);
      if (event) handleTrigger(event);
    }

    if (!encounterTriggered) {
      look(newLoc);
    }
    
    saveGame(updatedPlayer, history);
  };

  const triggerEncounter = (baseEnemy: Enemy, loc: Location, isRandom = false) => {
    log("A presence emerges from the darkness...", 'info');
    
    const baseId = baseEnemy.id.split('_rand')[0];
    // ASCII ART
    const art = ASCII_ART[baseId]; 
    if (art) {
        log(art, 'info'); 
    }

    // --- DYNAMIC DIFFICULTY SCALING ---
    
    let hpScale = 0.5; // Starts at 50% HP (Easy)
    let atkBonusModifier = -2; // Starts with -2 hit chance (Easy)

    if (player.killCount >= 3) {
        hpScale = 0.8; 
        atkBonusModifier = -1;
    }
    if (player.killCount >= 6) {
        hpScale = 1.0; // Normal
        atkBonusModifier = 0;
    }
    if (player.killCount >= 9) {
        hpScale = 1.3; // Hard
        atkBonusModifier = 1;
    }
    if (player.killCount >= 15) {
        hpScale = 1.6; // Very Hard
        atkBonusModifier = 2;
    }

    // Apply Scaling
    let newMaxHp = Math.floor(baseEnemy.maxHp * hpScale);
    newMaxHp = Math.max(1, newMaxHp); // Safety floor

    let newAtkBonus = Math.max(0, baseEnemy.attackBonus + atkBonusModifier);

    // Specific Boss Override to keep them scary regardless of level
    // Bosses are defined by their Tiers now, but let's prevent nerfing Tier 4/5 enemies too much
    if (baseEnemy.maxHp > 80) { // Simple heuristic for bosses
        newMaxHp = baseEnemy.maxHp; 
        newAtkBonus = baseEnemy.attackBonus;
    }

    const enemy: Enemy = {
        ...baseEnemy,
        hp: newMaxHp,
        maxHp: newMaxHp,
        attackBonus: newAtkBonus
    };

    log(`🔥 A ${enemy.name.toUpperCase()} ATTACKS! 🔥`, 'combat');
    
    setCurrentEnemy(enemy); 
    setMode(GameMode.COMBAT);
  };

  const handleTrigger = (event: string) => {
      if (event === 'healed') {
          log("The safety of the Town Center restores your vitality.", 'success');
      } else if (event === 'mage_tower_fix') {
          log("ARCANE: You stabilize the signal interference with a spell.", 'success');
          setPlayer(prev => ({
              ...prev,
              flags: { ...prev.flags, 'tower_stabilized': true }
          }));
      }
  };

  const look = (loc: Location) => {
    log(`[${loc.name.toUpperCase()}]`, 'system');
    
    // SCENE REPETITION PROTECTION
    const hasVisited = player.flags[`visited_${loc.id}`];
    
    // For normal tiles:
    if (hasVisited && loc.shortDescription) {
        log(loc.shortDescription);
    } else {
        log(loc.description);
    }

    if (loc.items && loc.items.length > 0) {
        log(`ITEMS VISIBLE: ${loc.items.join(', ').replace(/_/g, ' ')}`, 'info');
    }
    
    const visibleExits = Object.keys(loc.exits).join(', ').toUpperCase();
    const lockedExits = loc.lockedExits ? Object.keys(loc.lockedExits).join(', ').toUpperCase() : '';
    
    log(`EXITS: ${visibleExits} ${lockedExits ? `(${lockedExits}?)` : ''}`);
  };

  const showStatus = () => {
    const p = player;
    log(`STATUS: ${p.class}`, 'info');
    log(`HP: ${p.stats.hp}/${p.stats.maxHp} | MANA: ${p.stats.mana}`, 'info');
    log(`ATK: +${p.stats.strength} | DEF: ${p.stats.defense} | INT: +${p.stats.intellect} | AGI: +${p.stats.agility}`, 'info');
  };

  // --- COMBAT LOGIC ---

  const handleVictory = () => {
      if (!currentEnemy) return;
      log(`VICTORY! The ${currentEnemy.name} is defeated.`, 'success');
      log(`You gained ${currentEnemy.xpReward} XP.`, 'success'); 
      
      // Update player
      setPlayer(prev => {
          const newFlags = { ...prev.flags, [`killed_${currentEnemy.id}`]: true };
          const newInventory = [...prev.inventory];
          
          // HANDLE DROPS
          if (currentEnemy.dropItem) {
              if (!newInventory.includes(currentEnemy.dropItem)) {
                  newInventory.push(currentEnemy.dropItem);
                  log(`LOOT: You found ${currentEnemy.dropItem.toUpperCase().replace(/_/g, ' ')}!`, 'success');
              }
          }

          return {
              ...prev,
              killCount: prev.killCount + 1,
              flags: newFlags,
              inventory: newInventory
          };
      });

      // Provide instructions for next move
      const loc = WORLD_MAP[player.currentLocationId];
      if (loc) {
          const visibleExits = Object.keys(loc.exits).join(', ').toUpperCase();
          log(`AREA SECURE. SUGGESTED ACTION: MOVE ${visibleExits}`, 'system');
          log("Alternative: Type 'LOOK' to inspect surroundings.", 'system');
          
          if (currentEnemy.dropItem && currentEnemy.dropItem.startsWith('map_fragment')) {
               log("IMPORTANT: Map fragment acquired. Type 'MAP' to view progress.", 'success');
          }
      }

      setCurrentEnemy(null);
      setMode(GameMode.EXPLORE);
  };

  const handleDefeat = () => {
      log("CRITICAL FAILURE. VITAL SIGNS FLATLINING...", 'error');
      setStatus(GameStatus.GAME_OVER);
  };

  const handleCombat = (cmd: string) => {
    if (!currentEnemy) {
      setMode(GameMode.EXPLORE);
      return;
    }

    if (cmd === 'help') {
      log("COMBAT: ATTACK, DEFEND, CAST, FLEE", 'system');
      return;
    }

    // -- PLAYER TURN --
    let turnEnded = false;

    if (player.isGuarding) {
        setPlayer(p => ({...p, isGuarding: false}));
    }
    if (player.tempDefenseBonus && player.tempDefenseBonus > 0) {
        setPlayer(p => ({...p, tempDefenseBonus: 0}));
        log("Your magical shield fades.", 'info');
    }

    if (cmd === 'attack') {
        const { total: d20 } = rollDice(1, 20);
        let attackBonus = player.stats.strength;
        
        // Mages are physically weak
        if (player.class === ClassType.MAGE) attackBonus -= 1; 

        // HERO BONUS - Make rolling easier
        const luckBonus = 5;
        const attackRoll = d20 + attackBonus + luckBonus;
        const targetAC = 10 + currentEnemy.defense;

        log(`🎲 Roll: ${d20} (+${attackBonus} Atk + ${luckBonus} Fate = ${attackRoll})`, 'info');

        if (attackRoll >= targetAC) {
            let dmgDiceStr = '1d6'; // Default
            if (player.class === ClassType.FIGHTER) dmgDiceStr = '1d12'; // Fighter buffed 1d10 -> 1d12
            else if (player.class === ClassType.ROGUE) dmgDiceStr = '1d8'; // Rogue buffed 1d6 -> 1d8
            else if (player.class === ClassType.MAGE) dmgDiceStr = '1d4'; // Weak staff

            const { count, sides } = parseDice(dmgDiceStr);
            const dmgRoll = rollDice(count, sides);
            
            // Add Strength to damage
            let attributeBonus = Math.max(0, player.stats.strength);
            if (player.class === ClassType.MAGE) attributeBonus = 0; // Mages use INT mostly

            // DAMAGE BUFF: Double Damage + Attribute
            let finalDmg = (dmgRoll.total + attributeBonus) * 2;
            let msg = `Hit!`;

            // ROGUE SNEAK ATTACK LOGIC
            if (player.class === ClassType.ROGUE) {
                // Easier trigger: Regular hit triggers sneak attack now
                if (attackRoll >= targetAC) {
                    finalDmg = Math.floor(finalDmg * 1.5) + player.stats.agility; 
                    msg = `SNEAK ATTACK! Critical Hit!`;
                }
            }

            // FIGHTER MASTERY
            if (player.class === ClassType.FIGHTER) {
                 finalDmg += 5; // Buffed 3 -> 5
            }

            const effectiveDmg = Math.max(1, finalDmg - currentEnemy.defense);
            
            log(`${msg} 💥 Damage: ${effectiveDmg}`, 'success');
            
            const newHp = currentEnemy.hp - effectiveDmg;
            setCurrentEnemy(prev => prev ? ({ ...prev, hp: newHp }) : null);
            log(`Enemy HP: ${newHp}`, 'combat');

            if (newHp <= 0) {
                handleVictory();
                return;
            }
        } else {
            log(`Miss! (Target AC: ${targetAC})`, 'error');
        }
        turnEnded = true;

    } else if (cmd === 'defend') {
        setPlayer(p => ({...p, isGuarding: true}));
        // Fighter Guard is better
        if (player.class === ClassType.FIGHTER) {
             log("DEFENSIVE STANCE: You brace yourself. Damage -75%.", 'info');
        } else {
             log("You raise your guard. Damage -50%.", 'info');
        }
        turnEnded = true;

    } else if (cmd === 'cast') {
        if (player.class !== ClassType.MAGE) {
            log("You don't know any spells. You are not a Mage.", 'error');
        } else {
            log(`MANA: ${player.stats.mana}/${player.stats.maxMana}`, 'system');
            log("SPELLS: FIREBALL (15 MP), SHIELD (10 MP)", 'system');
            log("Usage: CAST FIREBALL", 'system');
        }
        return; 

    } else if (cmd.startsWith('cast ')) {
        if (player.class !== ClassType.MAGE) {
             log("You lack the arcane affinity to cast spells.", 'error');
             return;
        }
        const spell = cmd.replace('cast ', '').trim();
        
        if (spell === 'fireball') {
            const manaCost = 15;
            if (player.stats.mana < manaCost) {
                log(`Not enough Mana! (${player.stats.mana}/${manaCost} required).`, 'error');
                return;
            }
            
            // Consume Mana
            const newMana = player.stats.mana - manaCost;
            setPlayer(p => ({...p, stats: {...p.stats, mana: newMana}}));
            
            const { total: d20 } = rollDice(1, 20);
            
            // HERO BONUS FOR SPELLS
            const luckBonus = 5;
            const attackRoll = d20 + player.stats.intellect + luckBonus;
            const targetAC = 10 + currentEnemy.defense;

            log(`🎲 Casting Fireball: ${d20} (+${player.stats.intellect} Int + ${luckBonus} Fate = ${attackRoll})`, 'info');

            if (attackRoll >= targetAC) {
                const { total: dmg } = rollDice(5, 6); // Buffed fireball 3d6 -> 5d6
                const effectiveDmg = Math.max(1, dmg - currentEnemy.defense);
                log(`🔥 Fireball hits! Damage: ${effectiveDmg}`, 'success');
                
                const newHp = currentEnemy.hp - effectiveDmg;
                setCurrentEnemy(prev => prev ? ({ ...prev, hp: newHp }) : null);
                log(`Enemy HP: ${newHp}`, 'combat');
                
                if (newHp <= 0) {
                    handleVictory();
                    return;
                }
            } else {
                log(`Fizzle! The spell dissipates. (Target AC: ${targetAC})`, 'error');
            }
            turnEnded = true;

        } else if (spell === 'shield') {
            // Shield logic
            const manaCost = 10;
            if (player.stats.mana < manaCost) {
                log(`Not enough Mana!`, 'error');
                return;
            }
             setPlayer(p => ({...p, stats: {...p.stats, mana: p.stats.mana - manaCost}, tempDefenseBonus: 5}));
             log("A shimmering barrier surrounds you. (+5 DEF)", 'success');
             turnEnded = true;
        } else {
             log("Unknown spell. Available: FIREBALL, SHIELD", 'error');
             return;
        }
    } else if (cmd === 'flee') {
        // Flee logic
        if (!currentEnemy.canFlee) {
            log("You cannot flee from this enemy!", 'error');
            return;
        }
        const { total: roll } = rollDice(1, 20);
        const success = roll + player.stats.agility > 15; // DC 15 to flee
        if (success) {
            log("You scramble away into the shadows!", 'success');
            setMode(GameMode.EXPLORE);
            setCurrentEnemy(null);
            return;
        } else {
            log("Failed to escape!", 'error');
            turnEnded = true;
        }
    } else {
        log("Invalid command. TRY: ATTACK, DEFEND, CAST [SPELL], FLEE", 'error');
    }

    // -- ENEMY TURN --
    if (turnEnded && currentEnemy && currentEnemy.hp > 0) {
         // Enemy Attack Logic
         const { total: d20 } = rollDice(1, 20);
         const attackRoll = d20 + currentEnemy.attackBonus;
         let playerAC = 10 + player.stats.defense + (player.tempDefenseBonus || 0);
         if (player.class === ClassType.ROGUE) playerAC += player.stats.agility; // Rogues use Agility for AC

         log(`The ${currentEnemy.name} attacks! (Roll: ${attackRoll})`, 'combat');

         if (attackRoll >= playerAC) {
             const { count, sides } = parseDice(currentEnemy.damageDice);
             let dmg = rollDice(count, sides).total;
             
             // Mitigation
             if (player.isGuarding) {
                 dmg = Math.floor(dmg * (player.class === ClassType.FIGHTER ? 0.25 : 0.5));
             }
             
             dmg = Math.max(1, dmg - player.stats.defense); // DR from armor
             
             setPlayer(p => {
                 const newHp = p.stats.hp - dmg;
                 // Check defeat inside updater or after? 
                 // Updating here is safer for the value, but we need side effect.
                 // We'll trust the next render or check it here.
                 if (newHp <= 0) {
                    handleDefeat();
                 }
                 return { ...p, stats: { ...p.stats, hp: newHp } };
             });
             log(`You take ${dmg} damage!`, 'error');
         } else {
             log(`You dodge the attack!`, 'info');
         }
    }
  };

  // Command Parser
  const processCommand = (input: string) => {
    const cmd = input.toLowerCase().trim();
    
    // Log user input
    setHistory(prev => [...prev, { id: generateId(), text: `> ${input}`, type: 'info', timestamp: Date.now() }]);

    if (status === GameStatus.START_SCREEN) {
      handleStartScreen(cmd);
      return;
    }

    if (status === GameStatus.VICTORY || status === GameStatus.GAME_OVER) {
      if (cmd === 'restart') resetGame();
      else log("GAME OVER. TYPE 'RESTART'.", 'system');
      return;
    }

    if (mode === GameMode.COMBAT) {
      handleCombat(cmd);
    } else {
      handleExploration(cmd);
    }
  };

  return {
    status,
    history,
    player,
    processCommand,
    startGame,
    resetGame,
    turnOff,
    setStatus
  };
};
