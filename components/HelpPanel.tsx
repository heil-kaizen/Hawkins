import React from 'react';
import { Player } from '../types';

interface HelpPanelProps {
  player?: Player;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ player }) => {
  return (
    <div className="hidden lg:block w-64 bg-zinc-900 border-l border-zinc-700 p-4 font-mono text-xs text-gray-400 overflow-y-auto h-full flex flex-col gap-4">
      
      {/* STATUS MONITOR - Only shows if player exists (game started) */}
      {player && (
        <section>
          <h3 className="text-green-500 text-lg mb-2 border-b border-green-900 pb-1">
            STATUS_MONITOR
          </h3>
          <div className="space-y-3 text-green-400">
             <div className="flex justify-between items-baseline border-b border-green-900/30 pb-1">
               <span className="text-gray-500">ID:</span>
               <span className="text-white font-bold">{player.name}</span>
             </div>
             <div className="flex justify-between items-baseline border-b border-green-900/30 pb-1">
               <span className="text-gray-500">CLASS:</span>
               <span className="text-white">{player.class || 'UNREGISTERED'}</span>
             </div>

             {/* HP */}
             <div className="pt-1">
               <div className="flex justify-between mb-1 text-[10px] uppercase">
                 <span>VITALS</span>
                 <span>{player.stats.hp}/{player.stats.maxHp}</span>
               </div>
               <div className="w-full bg-red-900/30 h-1.5 border border-red-900/50">
                 <div
                   className="bg-red-600 h-full transition-all duration-500"
                   style={{ width: `${Math.max(0, (player.stats.hp / player.stats.maxHp) * 100)}%` }}
                 ></div>
               </div>
             </div>

             {/* MANA */}
             <div>
               <div className="flex justify-between mb-1 text-[10px] uppercase">
                 <span>MANA (MP)</span>
                 <span>{player.stats.mana}/{player.stats.maxMana}</span>
               </div>
               <div className="w-full bg-blue-900/30 h-1.5 border border-blue-900/50">
                  <div
                   className="bg-blue-500 h-full transition-all duration-500"
                   style={{ width: `${Math.max(0, (player.stats.mana / player.stats.maxMana) * 100)}%` }}
                 ></div>
               </div>
             </div>

             {/* INVENTORY */}
             <div className="pt-2">
               <div className="mb-1 text-gray-500 uppercase text-[10px]">EQUIPMENT / ITEMS:</div>
               <div className="text-gray-300 pl-2 border-l-2 border-green-900/50 min-h-[30px]">
                  {player.inventory.length === 0 ? (
                    <span className="text-gray-600 italic">- EMPTY -</span>
                  ) : (
                    player.inventory.map((item, idx) => (
                      <div key={idx} className="capitalize text-green-200/80 leading-tight mb-0.5">
                        - {item.replace(/_/g, ' ')}
                      </div>
                    ))
                  )}
               </div>
             </div>

          </div>
        </section>
      )}

      {/* MANUAL SECTION */}
      <section>
        <h3 className="text-green-500 text-lg mb-2 border-b border-green-900 pb-1">MANUAL</h3>
        
        <div className="space-y-4">
          <section>
            <h4 className="text-white font-bold mb-1">COMMANDS</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><span className="text-green-300">NORTH/SOUTH...</span>: Move</li>
              <li><span className="text-green-300">LOOK</span>: Inspect area</li>
              <li><span className="text-green-300">STATUS</span>: Check stats</li>
              <li><span className="text-green-300">INVENTORY</span>: Check bag</li>
            </ul>
          </section>

          <section>
            <h4 className="text-white font-bold mb-1">COMBAT</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><span className="text-red-300">ATTACK</span>: Deal physical dmg</li>
              <li><span className="text-blue-300">DEFEND</span>: Reduce incoming dmg</li>
              <li><span className="text-purple-300">CAST [SPELL]</span>: Use magic</li>
              <li><span className="text-yellow-300">FLEE</span>: Attempt escape</li>
            </ul>
          </section>

          <section>
              <h4 className="text-white font-bold mb-1">CLASSES</h4>
              <p><strong>FIGHTER:</strong> Weapon Master. Tough & Versatile.</p>
              <p className="mt-1"><strong>MAGE:</strong> Arcane User. Uses MP for spells.</p>
              <p className="mt-1"><strong>ROGUE:</strong> Stealth Specialist. Sneak Attacks.</p>
          </section>
        </div>
      </section>
    </div>
  );
};