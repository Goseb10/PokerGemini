import React, { useState } from 'react';
import { getAdvice } from './engine/engine';
import { getPostFlopAdvice } from './engine/postflopEngine';
import { runMonteCarlo } from './engine/monteCarloEngine';

const POSITIONS_6MAX = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

export default function App() {
  // --- ÉTATS (STATES) ---
  const [heroPosition, setHeroPosition] = useState('BTN');
  const [cards, setCards] = useState({ card1: '', card2: '' });
  const [actions, setActions] = useState([]);
  const [board, setBoard] = useState({ flop1: '', flop2: '', flop3: '', turn: '', river: '' });
  const [potSize, setPotSize] = useState(0); 
  const [villainBet, setVillainBet] = useState(0); 
  const [equityData, setEquityData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // --- FONCTIONS ---
  const handleAddAction = (position, actionType, amount) => {
    setActions([...actions, { position, actionType, amount }]);
  };

  const resetHand = () => {
    setCards({ card1: '', card2: '' });
    setActions([]);
    setBoard({ flop1: '', flop2: '', flop3: '', turn: '', river: '' });
    setPotSize(0);
    setVillainBet(0);
    setEquityData(null);
  };

  const calculateNetEV = () => {
    if (!equityData || villainBet === 0) return null;
    const probabilityOfWinning = equityData.equity;
    const totalPotAfterCall = potSize + villainBet + villainBet; 
    const expectedValue = (probabilityOfWinning * totalPotAfterCall) - villainBet;
    return expectedValue.toFixed(2);
  };

  // --- RENDU (JSX) ---
  return (
    <div className="poker-app p-6 bg-gray-900 text-white min-h-screen font-sans pb-20">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Simulateur Cash Game</h1>
        <p className="text-gray-400 text-sm mt-2">Moteur d'analyse EV et Stratégie GTO</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PANEL 1 : SITUATION */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">1. Ma Situation</h2>
          <div className="mb-4">
            <label className="block text-sm mb-2 text-gray-300">Ma Position (Hero)</label>
            <select 
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" 
              value={heroPosition} 
              onChange={(e) => setHeroPosition(e.target.value)}
            >
              {POSITIONS_6MAX.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2 text-gray-300">Mes Cartes (ex: As, Kd)</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Carte 1" 
                className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-center uppercase" 
                value={cards.card1} 
                onChange={(e) => setCards({ ...cards, card1: e.target.value })} 
              />
              <input 
                type="text" 
                placeholder="Carte 2" 
                className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-center uppercase" 
                value={cards.card2} 
                onChange={(e) => setCards({ ...cards, card2: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* PANEL 2 : SÉQUENCE PRE-FLOP */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">2. Séquence Pré-flop</h2>
          <div className="mb-6 min-h-[120px] bg-gray-900 p-4 rounded border border-gray-700">
            {actions.length === 0 ? (
              <span className="text-gray-500 italic">Le pot n'est pas ouvert. En attente d'action...</span>
            ) : (
              <ul className="space-y-2">
                {actions.map((act, idx) => (
                  <li key={idx} className="text-sm flex justify-between">
                    <span><span className="font-bold text-blue-400">{act.position}</span> a choisi de <span className="font-semibold">{act.actionType}</span></span>
                    {act.amount && <span className="text-green-400 font-mono">{act.amount} BB</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
             <button onClick={() => handleAddAction('UTG', 'Raise', 2.5)} className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500 rounded text-sm transition">UTG Open 2.5bb</button>
             <button onClick={() => handleAddAction('CO', 'Call', 2.5)} className="px-3 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500 rounded text-sm transition">CO Call</button>
             <button onClick={resetHand} className="px-3 py-2 bg-gray-700 rounded text-sm ml-auto transition">Nouvelle Main</button>
          </div>
        </div>
      </div>

      {/* RECOMMANDATION DU MOTEUR */}
      <div className="mt-8 bg-blue-900/50 p-6 rounded-lg shadow-lg border border-blue-500">
        <h2 className="text-xl font-semibold mb-2 text-blue-300">Recommandation du Moteur</h2>
        {board.flop1 && board.flop2 && board.flop3 ? (
          <p className="text-lg text-white font-mono bg-black p-4 rounded border border-gray-700 whitespace-pre-line">
            {getPostFlopAdvice([cards.card1, cards.card2], [board.flop1, board.flop2, board.flop3, board.turn, board.river], potSize, villainBet)}
          </p>
        ) : (
          <p className="text-lg text-white font-mono bg-black p-4 rounded border border-gray-700 whitespace-pre-line">
            {getAdvice(heroPosition, cards.card1, cards.card2, actions)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* PANEL 3 : LE BOARD */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">3. Le Board</h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex gap-2">
              <input type="text" placeholder="F1" className="w-14 p-2 bg-gray-900 border border-green-700 rounded text-center text-white uppercase" value={board.flop1} onChange={(e) => setBoard({...board, flop1: e.target.value})} />
              <input type="text" placeholder="F2" className="w-14 p-2 bg-gray-900 border border-green-700 rounded text-center text-white uppercase" value={board.flop2} onChange={(e) => setBoard({...board, flop2: e.target.value})} />
              <input type="text" placeholder="F3" className="w-14 p-2 bg-gray-900 border border-green-700 rounded text-center text-white uppercase" value={board.flop3} onChange={(e) => setBoard({...board, flop3: e.target.value})} />
            </div>
            <input type="text" placeholder="T" className="w-14 p-2 bg-gray-900 border border-yellow-600 rounded text-center text-white uppercase" value={board.turn} onChange={(e) => setBoard({...board, turn: e.target.value})} />
            <input type="text" placeholder="R" className="w-14 p-2 bg-gray-900 border border-red-600 rounded text-center text-white uppercase" value={board.river} onChange={(e) => setBoard({...board, river: e.target.value})} />
          </div>
        </div>

        {/* PANEL 4 : DONNÉES FINANCIÈRES */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">4. Données Financières</h2>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm mb-1 text-gray-300">Pot Total (BB)</label>
              <input type="number" min="0" step="0.5" className="w-full p-2 bg-gray-900 border border-blue-700 rounded text-white" value={potSize} onChange={(e) => setPotSize(Number(e.target.value))} />
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1 text-gray-300">Mise à payer (BB)</label>
              <input type="number" min="0" step="0.5" className="w-full p-2 bg-gray-900 border border-red-700 rounded text-white" value={villainBet} onChange={(e) => setVillainBet(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 5 : SIMULATION MONTE CARLO */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mt-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
          <h2 className="text-xl font-semibold">5. Simulation Monte-Carlo</h2>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition"
            onClick={() => {
              setIsCalculating(true);
              setTimeout(() => {
                const result = runMonteCarlo([cards.card1, cards.card2], [board.flop1, board.flop2, board.flop3, board.turn, board.river], 2000);
                if (result) {
                  setEquityData(result);
                } else {
                  alert("Veuillez remplir vos 2 cartes et au moins le flop (3 cartes).");
                }
                setIsCalculating(false);
              }, 100);
            }}
          >
            Lancer la Simulation
          </button>
        </div>
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          {isCalculating ? (
            <p className="text-blue-400 animate-pulse text-center">Génération des scénarios...</p>
          ) : equityData ? (
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-2">Équité (Probabilité de Gagner)</span>
              <span className="text-4xl font-bold text-white">{(equityData.equity * 100).toFixed(1)}%</span>
            </div>
          ) : (
            <p className="text-gray-500 text-center italic">Entrez vos cartes et le board, puis lancez la simulation.</p>
          )}
        </div>
      </div>

      {/* VERDICT FINAL EV */}
      {equityData && villainBet > 0 && (
        <div className="mt-8 bg-gray-900 p-8 rounded-lg shadow-2xl border-2 border-indigo-500 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white mb-6">Verdict Stratégique</h1>
          <div className="grid grid-cols-3 gap-8 w-full max-w-2xl text-center mb-8">
            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <span className="block text-sm text-gray-500 uppercase">Pot Odds</span>
              <span className="text-2xl font-bold text-gray-300">{((villainBet / (potSize + villainBet * 2)) * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <span className="block text-sm text-gray-500 uppercase">Ton Équité</span>
              <span className="text-2xl font-bold text-blue-400">{(equityData.equity * 100).toFixed(1)}%</span>
            </div>
            <div className={`p-4 rounded border ${calculateNetEV() > 0 ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
              <span className="block text-sm uppercase text-gray-400">EV Nette</span>
              <span className={`text-3xl font-bold ${calculateNetEV() > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {calculateNetEV() > 0 ? '+' : ''}{calculateNetEV()} BB
              </span>
            </div>
          </div>
          <button className={`w-full max-w-md py-4 text-white text-2xl font-black rounded cursor-default ${calculateNetEV() > 0 ? 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
            ACTION RECOMMANDÉE : {calculateNetEV() > 0 ? 'CALL / RAISE' : 'FOLD'}
          </button>
        </div>
      )}
    </div>
  );
}