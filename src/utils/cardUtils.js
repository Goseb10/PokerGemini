const RANK_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export function formatHandNotation(card1, card2) {
  if (!card1 || !card2 || card1.length < 2 || card2.length < 2) return null; 

  const r1 = card1[0].toUpperCase();
  const s1 = card1[1].toLowerCase();
  const r2 = card2[0].toUpperCase();
  const s2 = card2[1].toLowerCase();

  if (!RANK_VALUES[r1] || !RANK_VALUES[r2]) return null;

  let highCard, lowCard;
  if (RANK_VALUES[r1] >= RANK_VALUES[r2]) {
    highCard = r1; lowCard = r2;
  } else {
    highCard = r2; lowCard = r1;
  }

  if (highCard === lowCard) return `${highCard}${lowCard}`;
  else if (s1 === s2) return `${highCard}${lowCard}s`;
  else return `${highCard}${lowCard}o`;
}