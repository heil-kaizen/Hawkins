
Below is a **clean, GitHub-ready README** you can paste directly into your repo.
It is written for a **working terminal-based game**, not a demo.

---

#  Hawkins Terminal

*A Stranger Things–inspired terminal-based adventure game*

Stranger Things inspired retro terminal game set in Hawkins, Indiana.
Navigate a darkening town, face creatures from the Upside Down, manage inventory, and survive through class-based story routes — all inside a CRT-style terminal experience.

---

##  Overview

**Hawkins Terminal** is a **web-based terminal game** inspired by classic D&D mechanics and 1980s retro computing aesthetics.

The game features:

* Text-driven exploration
* Direction-based movement
* Dice-based combat
* Gradually scaling enemies
* Multiple story routes
* Atmospheric sound design

The UI mimics an old television terminal with scanlines, static interference, and typewriter text effects.

---

##  Gameplay

###  Navigation

Move through Hawkins using classic commands:

```
north
south
east
west
```

Each location:

* Triggers story events
* Spawns enemies
* Drops loot
* Unlocks class-specific interactions

If a player reaches an unfinished area:

```
⚠ UNDER CONSTRUCTION ⚠
```

---

##  Classes & Story Routes

Choose one class at the start. Each class follows **unique story arcs** and endings.

###  Fighter

* High defense and melee damage
* Block and counter mechanics
* Story focuses on survival and brute force

###  Mage

* Spellcasting and control abilities
* Status effects and disruption
* Story focuses on knowledge and sacrifice

### 🗡 Rogue

* Stealth, evasion, critical strikes
* Trap and escape mechanics
* Story focuses on secrecy and deception

---

##  Combat System

* Dice-based outcomes (D&D-style)
* Enemies scale by **zone tier**
* Actions include:

  ```
  attack
  defend
  flee
  use item
  ```

Enemy difficulty increases as the player progresses deeper into Hawkins and closer to the Upside Down.

---

##  Inventory System

Inventory categories:

* Weapons
* Armor
* Consumables
* Quest items
* Crafting materials

Features:

* Limited slots early game
* Inventory expansion via items
* Key items unlock new areas and story paths

---

##  World Map

* Fully designed ASCII world map
* Locations include:

  * Hawkins High
  * Starcourt Ruins
  * Radio Tower
  * Forest Tunnels
  * Cult Shelter
  * Upside Down Gate (Endgame)

After completing the game:

* Map fragments combine
* Full world map is revealed
* Explored zones are marked

---

##  Audio & Atmosphere

* **Landing Page**

  * Looping TV static / interference audio
* **Terminal Gameplay**

  * Multiple OST tracks
  * User can switch or stop music at any time
* Sound transitions are tied to game state (landing → terminal)

---

##  UI & Visual Style

* CRT / TV screen effects
* Scanlines & distortion
* Typewriter text animation
* Terminal-only interaction (no mouse required in gameplay)

---

##  Built With

* HTML
* CSS
* JavaScript
* Web Audio API
* ASCII UI design

No backend required — runs entirely in the browser.

---

##  Development Notes

* The game prevents scene repetition using visit flags
* Map edges are expandable
* Unfinished areas clearly marked as **UNDER CONSTRUCTION**
* Designed for future procedural expansion

---

##  Disclaimer

This project is a **fan-made game** inspired by *Stranger Things*.
It is **not affiliated with or endorsed by Netflix**.

All references are used for creative and educational purposes only.

---

##  Status

 Fully playable
 Actively expandable
 Map growth planned


