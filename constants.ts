
import { ClassType, Enemy, Location, AudioTrack } from './types';

export const INITIAL_LOG = [
  "SYSTEM_BOOT_SEQUENCE_INITIATED...",
  "CHECKING_MEMORY... 64KB OK",
  "LOADING_KERNEL... HAWKINS_OS v2.1",
  "MOUNTING_DRIVE_A... SUCCESS",
  "ESTABLISHING_UPLINK... ENCRYPTED",
  " ",
  "WELCOME TO PROJECT_MK_ULTRA_TERMINAL",
  "AUTHORIZED PERSONNEL ONLY",
  " "
];

export const LANDING_AUDIO_URL = "https://raw.githubusercontent.com/heil-kaizen/Hawkins/refs/heads/main/hawkins%20tv.mp3";

export const AUDIO_TRACKS: AudioTrack[] = [
  { id: 'stranger_things', title: 'Stranger Things Theme', url: 'https://raw.githubusercontent.com/heil-kaizen/Hawkins/refs/heads/main/Stranger%20Things.mp3' },
  { id: 'season_5', title: 'Season 5 Finale', url: 'https://raw.githubusercontent.com/heil-kaizen/Hawkins/refs/heads/main/Season%205%20Finale%20OST.mp3' },
  { id: 'finale_ending', title: 'Finale Ending', url: 'https://raw.githubusercontent.com/heil-kaizen/Hawkins/refs/heads/main/Finale%20Ending%20Music%20%20OST.mp3' }
];

export const ASCII_MAP_FULL = `
                         ┌──────────────────────────┐
                         │   RADIO TOWER (T4) 📡     │
                         │  Signal Wraiths           │
                         └───────────┬──────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
┌───────────▼──────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│ FOREST TUNNELS (T3)   │   │  HAWKINS HIGH (T3) │   │  ARCADE (T2) 🕹️   │
│ Spore Wolves          │   │ Corrupted Students│   │ Shadow Teens      │
└───────────┬──────────┘   └─────────┬─────────┘   └─────────┬─────────┘
            │                        │                        │
            │                        │                        │
┌───────────▼──────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│ SCRAP YARD (T1)       │   │  TOWN CENTER (SAFE)│  │ STARCOURT RUINS(T3)│
│ Possessed Rats        │   │ Save / Inventory  │  │ Flesh Crawlers     │
└───────────┬──────────┘   └─────────┬─────────┘   └─────────┬─────────┘
            │                        │                        │
            │                        │                        │
┌───────────▼──────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│ HOSPITAL (T4) 🏥      │   │ QUARRY EDGE (T4)  │   │ CULT SHELTER (T5) │
│ Screamer Nurses       │   │ Void Hawks        │   │ Mindbound Cultists│
└───────────┬──────────┘   └─────────┬─────────┘   └─────────┬─────────┘
            │                        │                        │
            │                        │                        │
            └───────────────┬────────┴────────┬──────────────┘
                            │                 │
                ┌───────────▼──────────┐  ┌───▼──────────────────┐
                │ UPSIDE DOWN GATE (T5) │  │ ??? UNKNOWN ZONE ???  │
                │ Veiled Mind (BOSS)    │  │ ⚠ UNDER CONSTRUCTION │
                └──────────────────────┘  └──────────────────────┘
`;

export const ASCII_ART: Record<string, string> = {
  'possessed_rat': `
     (o)(o)
    /      \\
    \\      /
     \`----\´
  `,
  'shadow_teen': `
      ,  ,
     /|--|\\
    ( @  @ )
     \\ -- /
      |  |
  `,
  'corrupted_student': `
      _______
     /       \\
    |  O   x  |
    |    ^    |
     \\  ~~~  /
      \\_____/
       | H |
  `,
  'spore_wolf': `
      ^..^
     (oo )____
       \\  o o  \\
        \\ ooo   \\
        (__(____/
  `,
  'flesh_crawler': `
     /\\  /\\
    (  OO  )
    / <  > \\
   (  \\/  )
  `,
  'signal_wraith': `
      .---.
     / ⚡ ⚡ \\
    |   O   |
     \\  ~  /
      | | |
     /  |  \\
  `,
  'void_hawk': `
     \\    /
      \\  /
      (oo)
     //||\\\\
  `,
  'veiled_mind': `
   .   .dP                  dP                   9b                 9b.    .
  4    qXb         .       dX                     Xb       .        dXp     t
 dX.    9Xb      .dXb    __                         __    dXb.     dXP     .Xb
 9XXb._       _.dXXXXb dXXXXbo.                 .odXXXXb dXXXXb._       _.dXXP
  9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
   \`9XXXXXXXXXXXXXXXXXXXXX'~   ~"OOO8b   d8OOO"~   ~'XXXXXXXXXXXXXXXXXXXXXP'
     \`9XXXXXXXXXXXP' \`9XX'   DIE    \`98v8P'  HUMAN   'XXP' \`9XXXXXXXXXXXP'
         ~~~~~~~       9X.          .db|db.          .XP       ~~~~~~~
                         )b.  .dbo.dP'\`v'\`9b.odb.  .dX(
                       ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                      dXXXXXXXXXXXP'   .   \`9XXXXXXXXXXXb
                     dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                     9XXb'   \`XXXXXb.dX|Xb.dXXXXX'   \`dXXP
                      '      9XXXXXX(   )XXXXXXP      \`/
                              XXXX X.\`v'.X XXXX
                              XP^X'\`b   d'\`X^XX
                              X. 9  \`   '  P )X
                              \`b  \`       '  d'
  `
};

export const CLASS_STATS = {
  [ClassType.FIGHTER]: {
    hp: 160, maxHp: 160, mana: 0, maxMana: 0, stamina: 120, 
    strength: 6, intellect: 0, agility: 2, defense: 4
  },
  [ClassType.MAGE]: {
    hp: 80, maxHp: 80, mana: 150, maxMana: 150, stamina: 40, 
    strength: -1, intellect: 7, agility: 2, defense: 1
  },
  [ClassType.ROGUE]: {
    hp: 110, maxHp: 110, mana: 40, maxMana: 40, stamina: 100, 
    strength: 3, intellect: 2, agility: 7, defense: 2
  }
};

export const ENEMIES: Record<string, Enemy> = {
  // TIER 1
  'possessed_rat': {
    id: 'possessed_rat', name: 'Possessed Rat', hp: 10, maxHp: 10, 
    damageDice: '1d4', attackBonus: -1, defense: 0,
    description: "A large rat with glowing purple eyes.",
    aggressiveness: 0.8, xpReward: 10, canFlee: true
  },
  'rust_walker': {
    id: 'rust_walker', name: 'Rust Walker', hp: 20, maxHp: 20, 
    damageDice: '1d6', attackBonus: 0, defense: 2,
    description: "A shambling construct of scrap metal and vines.",
    aggressiveness: 0.5, xpReward: 20, canFlee: true
  },
  // TIER 2
  'shadow_teen': {
    id: 'shadow_teen', name: 'Shadow Teen', hp: 35, maxHp: 35,
    damageDice: '1d6', attackBonus: 2, defense: 1,
    description: "A flickering silhouette of a former arcade gamer.",
    aggressiveness: 0.9, xpReward: 40, canFlee: true
  },
  // TIER 3
  'spore_wolf': {
    id: 'spore_wolf', name: 'Spore Wolf', hp: 50, maxHp: 50,
    damageDice: '2d4', attackBonus: 3, defense: 2,
    description: "A wolf with fungal growths bursting from its back.",
    aggressiveness: 1.0, xpReward: 60, canFlee: false
  },
  'corrupted_student': {
    id: 'corrupted_student', name: 'Corrupted Student', hp: 45, maxHp: 45,
    damageDice: '1d8', attackBonus: 3, defense: 1,
    description: "Wearing a varsity jacket, but the face is... wrong.",
    aggressiveness: 0.8, xpReward: 55, canFlee: true
  },
  'flesh_crawler': {
    id: 'flesh_crawler', name: 'Flesh Crawler', hp: 70, maxHp: 70,
    damageDice: '2d6', attackBonus: 4, defense: 3,
    description: "A mass of limbs rolling towards you.",
    aggressiveness: 1.0, xpReward: 100, canFlee: false,
    dropItem: 'map_fragment_1'
  },
  // TIER 4
  'signal_wraith': {
    id: 'signal_wraith', name: 'Signal Wraith', hp: 80, maxHp: 80,
    damageDice: '1d10', attackBonus: 5, defense: 0, // Hard to hit? High dodge?
    description: "A being made of static noise and electricity.",
    aggressiveness: 1.0, xpReward: 120, canFlee: true
  },
  'screamer_nurse': {
    id: 'screamer_nurse', name: 'Screamer Nurse', hp: 90, maxHp: 90,
    damageDice: '2d6', attackBonus: 5, defense: 2,
    description: "Her face is wrapped in bandages. She holds a rusty scalpel.",
    aggressiveness: 1.0, xpReward: 130, canFlee: false
  },
  'void_hawk': {
    id: 'void_hawk', name: 'Void Hawk', hp: 100, maxHp: 100,
    damageDice: '2d8', attackBonus: 6, defense: 4,
    description: "A bird of prey warped by the void. It dives silently.",
    aggressiveness: 1.0, xpReward: 150, canFlee: false,
    dropItem: 'map_fragment_2'
  },
  // TIER 5
  'summoned_horror': {
    id: 'summoned_horror', name: 'Summoned Horror', hp: 150, maxHp: 150,
    damageDice: '3d6', attackBonus: 7, defense: 5,
    description: "A writhing mass summoned by the cult.",
    aggressiveness: 1.0, xpReward: 250, canFlee: false,
    dropItem: 'map_fragment_3'
  },
  'veiled_mind': {
    id: 'veiled_mind', name: 'The Veiled Mind', hp: 300, maxHp: 300,
    damageDice: '4d6', attackBonus: 10, defense: 8,
    description: "The Avatar of the Gate. Reality bends around it.",
    aggressiveness: 1.0, xpReward: 5000, canFlee: false,
    dropItem: 'map_fragment_4'
  }
};

export const WORLD_MAP: Record<string, Location> = {
  // --- CENTER (SAFE) ---
  'town_square': {
    id: 'town_square',
    name: 'Town Center (Safe Zone)',
    description: "You stand in the Town Center. The streetlights buzz softly. It's safe here.",
    shortDescription: "Town Center.",
    exits: { 'north': 'hawkins_high', 'east': 'arcade', 'west': 'scrap_yard', 'south': 'quarry_edge' },
    triggers: (player) => {
      // Heal player in safe zone
      if (player.stats.hp < player.stats.maxHp) {
        player.stats.hp = player.stats.maxHp;
        player.stats.mana = player.stats.maxMana;
        return 'healed';
      }
      return null;
    }
  },

  // --- WEST BRANCH (Scrap Yard -> Hospital) ---
  'scrap_yard': {
    id: 'scrap_yard',
    name: 'Hawkins Scrap Yard (Tier 1)',
    description: "Piles of rusted cars and twisted metal. Fog clings to the ground.",
    shortDescription: "The Scrap Yard.",
    exits: { 'east': 'town_square', 'south': 'hospital' }, // Changed Hospital to South based on ASCII/Logic
    items: ['scrap_blade', 'lockpick_kit', 'arcane_wire'],
    randomEncounters: [{ enemyId: 'possessed_rat', chance: 0.4 }, { enemyId: 'rust_walker', chance: 0.2 }]
  },
  'hospital': {
    id: 'hospital',
    name: 'Old Hawkins Hospital (Tier 4)',
    description: "Flickering lights illuminate empty wheelchairs. The smell of antiseptic and rot is overwhelming.",
    shortDescription: "The Abandoned Hospital.",
    exits: { 'north': 'scrap_yard' },
    enemyId: 'screamer_nurse',
    items: ['surgical_blade', 'vitality_elixir']
  },

  // --- NORTH BRANCH (High School -> Tunnels -> Radio Tower) ---
  'hawkins_high': {
    id: 'hawkins_high',
    name: 'Hawkins High Basement (Tier 3)',
    description: "Rows of lockers line the halls. Blood trails lead to the basement.",
    shortDescription: "Hawkins High.",
    exits: { 'south': 'town_square', 'north': 'forest_tunnels' },
    items: ['courage_charm', 'school_keycard'],
    randomEncounters: [{ enemyId: 'corrupted_student', chance: 0.5 }]
  },
  'forest_tunnels': {
    id: 'forest_tunnels',
    name: 'Forest Service Tunnels (Tier 3)',
    description: "Earthen tunnels supported by rotting wood. Roots snake through the ceiling.",
    shortDescription: "The Dark Tunnels.",
    exits: { 'south': 'hawkins_high', 'north': 'radio_tower' },
    items: ['reinforced_boots', 'nature_rune'],
    randomEncounters: [{ enemyId: 'spore_wolf', chance: 0.6 }]
  },
  'radio_tower': {
    id: 'radio_tower',
    name: 'Hawkins Radio Tower (Tier 4)',
    description: "A massive steel structure humming with interference. The sky swirls with storm clouds.",
    shortDescription: "The Radio Tower.",
    exits: { 'south': 'forest_tunnels' },
    enemyId: 'signal_wraith',
    items: ['signal_amplifier', 'focus_lens'],
    triggers: (player) => {
        if (player.class === ClassType.MAGE && !player.flags['tower_stabilized']) {
            return 'mage_tower_fix';
        }
        return null;
    }
  },

  // --- EAST BRANCH (Arcade -> Starcourt) ---
  'arcade': {
    id: 'arcade',
    name: 'Abandoned Arcade (Tier 2)',
    description: "Broken cabinets of Pac-Man and Dig Dug. The air is cold.",
    shortDescription: "The Arcade.",
    exits: { 'west': 'town_square', 'east': 'starcourt_ruins', 'enter': 'arcade_backroom' },
    items: ['reflex_gloves', 'arcade_token'],
    lockedExits: {
        'enter': { reason: "The door is jammed tight.", requiredClass: ClassType.ROGUE }
    },
    randomEncounters: [{ enemyId: 'shadow_teen', chance: 0.4 }]
  },
  'arcade_backroom': {
    id: 'arcade_backroom',
    name: 'Arcade Office (Secret)',
    description: "A manager's office. A safe sits open.",
    shortDescription: "The Secret Backroom.",
    exits: { 'exit': 'arcade' },
    items: ['smoke_bomb', 'mana_token']
  },
  'starcourt_ruins': {
    id: 'starcourt_ruins',
    name: 'Starcourt Ruins (Tier 3)',
    description: "The skeletal remains of the mall. Spores drift like snow.",
    shortDescription: "Starcourt Ruins.",
    exits: { 'west': 'arcade' },
    enemyId: 'flesh_crawler', // Drops Fragment 1
    items: ['improvised_armor', 'psionic_shard', 'med_kit']
  },

  // --- SOUTH BRANCH (Quarry -> Cult -> Gate) ---
  'quarry_edge': {
    id: 'quarry_edge',
    name: 'Quarry Edge (Tier 4)',
    description: "The wind howls over the steep drop. Black water waits below.",
    shortDescription: "The Quarry.",
    exits: { 'north': 'town_square', 'south': 'cult_shelter' },
    enemyId: 'void_hawk', // Drops Fragment 2
    items: ['heavy_weapon_core', 'grappling_hook']
  },
  'cult_shelter': {
    id: 'cult_shelter',
    name: 'Underground Cult Shelter (Tier 5)',
    description: "Candles flicker. Strange symbols are painted in blood on the walls.",
    shortDescription: "The Cult Shelter.",
    exits: { 'north': 'quarry_edge', 'south': 'gate_nexus' },
    enemyId: 'summoned_horror', // Drops Fragment 3
    items: ['dark_tome', 'ritual_dagger']
  },
  'gate_nexus': {
    id: 'gate_nexus',
    name: 'Upside Down Gate Nexus (Tier 5)',
    description: "The center of the corruption. A tear in reality pulses with red light.",
    shortDescription: "The Gate.",
    exits: { 'north': 'cult_shelter', 'south': 'unknown_zone' },
    enemyId: 'veiled_mind', // Drops Fragment 4
    items: ['class_ultimate_item']
  },
  'unknown_zone': {
    id: 'unknown_zone',
    name: '???',
    description: "Static wall.",
    exits: { 'north': 'gate_nexus' },
    isConstruction: true
  }
};
