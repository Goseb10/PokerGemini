const STRONG_RANGE_COMBOS = [
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 
  'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs',
  'AKo', 'AQo', 'AJo', 'KQo'
];

export function getRandomHandFromRange(remainingDeck, range = STRONG_RANGE_COMBOS) {
  const highCards = remainingDeck.filter(c => ['A', 'K', 'Q', 'J', 'T', '9', '8'].includes(c[0]));
  if (highCards.length >= 2) {
    const shuffled = highCards.sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  }
  // Fallback si pas assez de cartes hautes dispos
  return [remainingDeck[0], remainingDeck[1]];
}