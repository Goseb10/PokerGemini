import * as PokerEvaluator from 'poker-evaluator';
import { getRandomHandFromRange } from '../utils/rangeUtils';

const FULL_DECK = [
  '2c','3c','4c','5c','6c','7c','8c','9c','Tc','Jc','Qc','Kc','Ac',
  '2d','3d','4d','5d','6d','7d','8d','9d','Td','Jd','Qd','Kd','Ad',
  '2h','3h','4h','5h','6h','7h','8h','9h','Th','Jh','Qh','Kh','Ah',
  '2s','3s','4s','5s','6s','7s','8s','9s','Ts','Js','Qs','Ks','As'
];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export function runMonteCarlo(heroCards, boardCards, iterations = 1000) {
  const knownCards = [...heroCards, ...boardCards].filter(c => c !== '');
  
  // Vérification de sécurité avant de lancer l'algo
  if (heroCards.length !== 2 || knownCards.some(c => c.length !== 2)) return null;
  if (boardCards.filter(c => c !== '').length < 3) return null;

  let wins = 0, ties = 0, losses = 0;

  for (let i = 0; i < iterations; i++) {
    let availableDeck = FULL_DECK.filter(card => !knownCards.includes(card));
    const villainCards = getRandomHandFromRange(availableDeck);
    
    availableDeck = availableDeck.filter(card => !villainCards.includes(card));
    availableDeck = shuffle(availableDeck);
    
    const simulatedBoard = [...boardCards].filter(c => c !== '');
    while (simulatedBoard.length < 5) {
      simulatedBoard.push(availableDeck.pop());
    }

    try {
      const heroEval = PokerEvaluator.evalHand([...heroCards, ...simulatedBoard]);
      const villainEval = PokerEvaluator.evalHand([...villainCards, ...simulatedBoard]);

      if (heroEval.value > villainEval.value) wins++;
      else if (heroEval.value < villainEval.value) losses++;
      else ties++;
    } catch (e) {
      // Ignorer les mains mal formatées générées aléatoirement
      continue;
    }
  }

  const total = wins + ties + losses;
  if (total === 0) return { equity: 0, iterations: 0 };
  
  return {
    equity: ((wins + (ties / 2)) / total), 
    iterations: total
  };
}