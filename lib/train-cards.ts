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

  const newCardItems = items
    .filter((card: FlashCardData) => Number(userData.current_level) === Number(card.level))
    .filter((card: FlashCardData) => !learnedCards.includes(card.id) && !weakCards.includes(card.id))
    .map((card: FlashCardData) => card.id);

  if (!weakCards.length && !newCardItems.length && !userLevelBumped) {
    // Promote user to the next level
    if (Number(userData.current_level) < 5) {
      await bumpUserLevel(userHash);
      return trainCards(userHash, items, true);
    }
  }

  const totalCards = 15;
  const weakCardsLenth = weakCards.length;
  const learnedCardsLength = learnedCards.length;
  const newWordsCount = weakCardsLenth + learnedCardsLength < 5 ? 4 : 2;
  const weakCardsCount = learnedCardsLength <= 2 ? 10 : 8;
  const randomNewWords = pickRandomCards(newCardItems, newWordsCount);
  const randomWeakCards = pickRandomCards(weakCards, weakCardsCount);
  const remainingCards = totalCards - randomWeakCards.length - randomNewWords.length;
  const randomLearnedCards = pickRandomCards(learnedCards, remainingCards);
  const cardIds = [...randomLearnedCards, ...randomWeakCards, ...randomNewWords].sort(() => Math.random() - 0.5);

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
