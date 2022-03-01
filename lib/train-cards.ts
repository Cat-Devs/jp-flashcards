import type { FlashCardData } from '../src/types';
import { bumpUserLevel } from './bump-user-level';
import { getUserData } from './get-user-data';
import { pickRandomCards } from './pick-random-card';

export const trainCards = async (
  userHash: string,
  items: FlashCardData[],
  userLevelBumped?: boolean
): Promise<string[]> => {
  const userData = await getUserData(userHash);
  const learnedCards = userData.learned_cards;
  const weakCards = Object.keys(userData.weak_cards);
  const randomLearnedCards = pickRandomCards(learnedCards, 3);

  const cardIds = items
    .filter((card: FlashCardData) => Number(userData.current_level) === Number(card.level))
    .filter((card: FlashCardData) => !learnedCards.includes(card.id) && !weakCards.includes(card.id))
    .map((card: FlashCardData) => card.id);

  if (!weakCards.length) {
    if (!cardIds.length && Number(userData.current_level) >= 5) {
      // Max level reach
      return [];
    }

    // Promote user to the next level
    if (!cardIds.length && !userLevelBumped) {
      await bumpUserLevel(userHash);
      return trainCards(userHash, items, true);
    }
  }

  return [...weakCards, ...cardIds]
    .splice(0, 10)
    .sort(() => Math.random() - 0.5)
    .concat(randomLearnedCards)
    .sort(() => Math.random() - 0.5);
};
