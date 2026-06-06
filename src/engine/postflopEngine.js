import * as PokerEvaluator from 'poker-evaluator';

export function calculatePotOdds(potSize, amountToCall) {
  if (amountToCall === 0) return 0;
  const totalPotAfterCall = potSize + amountToCall;
  return (amountToCall / totalPotAfterCall) * 100;
}

export function evaluateHand(heroCards, boardCards) {
  const allCards = [...heroCards, ...boardCards].filter(card => card !== '');
  if (allCards.length < 5) return { error: "Pas assez de cartes pour évaluer le post-flop" };

  try {
    const evaluation = PokerEvaluator.evalHand(allCards);
    return {
      handName: evaluation.handName,
      handValue: evaluation.value,
      handRank: evaluation.handRank
    };
  } catch (error) {
    return { error: "Format de cartes invalide pour l'évaluation." };
  }
}

export function getPostFlopAdvice(heroCards, boardCards, potSize, amountToCall) {
  const potOdds = calculatePotOdds(potSize, amountToCall);
  const handStrength = evaluateHand(heroCards, boardCards);

  if (handStrength.error) return handStrength.error === "Pas assez de cartes pour évaluer le post-flop" ? "En attente du Flop..." : handStrength.error;

  let advice = "";
  if (handStrength.handName === "high card" || handStrength.handName === "pair") {
     if (potOdds > 20) advice = "Action : Fold. Votre main est trop faible par rapport à la taille de la mise.";
     else advice = "Action : Check/Call (Cotes favorables pour un petit montant).";
  } else {
     advice = "Action : Raise/Call. Vous avez une main forte (" + handStrength.handName + ").";
  }

  return `Analyse de la main : ${handStrength.handName.toUpperCase()} \nCote du pot (Équité requise) : ${potOdds.toFixed(1)}% \n=> ${advice}`;
}