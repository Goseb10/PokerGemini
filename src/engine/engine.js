import { formatHandNotation } from '../utils/cardUtils';
import { RANGES_100BB } from './strategyData';

export function getAdvice(heroPosition, card1, card2, actions) {
  const handString = formatHandNotation(card1, card2);
  if (!handString) return "Veuillez entrer une main valide (ex: As, Kd).";

  const opener = actions.find(a => a.actionType === 'Raise');
  
  if (!opener) {
    const positionRanges = RANGES_100BB.RFI[heroPosition];
    if (!positionRanges) return `Pas de data RFI pour la position ${heroPosition}.`;
    
    const advice = positionRanges[handString];
    if (!advice) return `Main ${handString} : Fold (Hors range d'ouverture).`;
    
    return `Main ${handString} | Action : ${advice.action} à ${advice.size}BB | EV estimée : ${advice.ev}`;
  }

  if (opener) {
    const villainPosition = opener.position;
    const heroFacingData = RANGES_100BB.FACING_OPEN[heroPosition];
    
    if (!heroFacingData || !heroFacingData[villainPosition]) {
      return `Pas de data pour ${heroPosition} face à un open de ${villainPosition}.`;
    }
    
    const advice = heroFacingData[villainPosition][handString];
    if (!advice) return `Main ${handString} face à ${villainPosition} : Fold (Ne pas défendre).`;

    if (advice.action === '3-Bet') {
      return `Main ${handString} | Action : ${advice.action} à ${advice.size}BB | EV : ${advice.ev}`;
    } else {
      return `Main ${handString} | Action : ${advice.action} | EV : ${advice.ev}`;
    }
  }
}