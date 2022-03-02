import type { CardStats, FlashCardData } from '../src/types';
import { bumpUserLevel } from './bump-user-level';
import { getUserData } from './get-user-data';
import { pickRandomCards } from './pick-random-card';

export const trainCards = async (
  userHash: string,
  items: FlashCardData[],
  userLevelBumped?: boolean
): Promise<{ cardsStats: CardStats[]; cardIds: string[] }> => {
  const userData = await getUserData(userHash);
  const learnedCards = userData.learned_cards;
  const weakCards = Object.keys(userData.weak_cards);
  const randomLearnedCards = pickRandomCards(learnedCards, 3);

  const cardItems = items
    .filter((card: FlashCardData) => Number(userData.current_level) === Number(card.level))
    .filter((card: FlashCardData) => !learnedCards.includes(card.id) && !weakCards.includes(card.id))
    .map((card: FlashCardData) => card.id);

  if (!weakCards.length) {
    if (!cardItems.length && Number(userData.current_level) >= 5) {
      // Max level reach
      return;
    }

    // Promote user to the next level
    if (!cardItems.length && !userLevelBumped) {
      await bumpUserLevel(userHash);
      return trainCards(userHash, items, true);
    }
  }

  const cardIds = [...weakCards, ...cardItems]
    .splice(0, 10)
    .sort(() => Math.random() - 0.5)
    .concat(randomLearnedCards)
    .sort(() => Math.random() - 0.5);

  const cardsStats = cardIds.reduce((acc, curr) => {
    if (learnedCards.includes(curr)) {
      return [...acc, { id: curr, score: '100' }];
    }
    if (weakCards.includes(curr)) {
      return [...acc, { id: curr, score: userData.weak_cards[curr] }];
    }
    return [...acc, { id: curr, score: '0' }];
  }, []);

  return { cardsStats, cardIds };
};
