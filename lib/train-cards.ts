import type { CardData, FlashCardData, UserData } from '../src/types';
import { bumpUserLevel } from './bump-user-level';
import { getUserData } from './get-user-data';
import { pickRandomCards } from './pick-random-card';

export const trainCards = async (
  userHash: string,
  items: FlashCardData[],
  userLevelBumped?: boolean
): Promise<CardData[]> => {
  const userData: UserData = await getUserData(userHash);
  const userCards: CardData[] = userData.cards;
  const userCardIds: string[] = userCards.map((userCard: CardData) => userCard.id);

  const weakCards: string[] = userCards
    .filter((userCard: CardData) => Number(userCard.accuracy) < 93)
    .map((userCard: CardData) => userCard.id);
  const learnedCards: string[] = userCards
    .filter((userCard: CardData) => Number(userCard.accuracy) >= 93)
    .map((userCard: CardData) => userCard.id);

  const newCardIds: string[] = items
    .filter((card: FlashCardData) => Number(userData.current_level) === Number(card.level))
    .filter((card: FlashCardData) => !userCardIds.includes(card.id))
    .map((card: FlashCardData) => card.id);

  if (!weakCards.length && !newCardIds.length && !userLevelBumped) {
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
  const randomNewWords = pickRandomCards(newCardIds, newWordsCount);
  const randomWeakCards = pickRandomCards(weakCards, weakCardsCount);
  const remainingCards = totalCards - randomWeakCards.length - randomNewWords.length;
  const randomLearnedCards = pickRandomCards(learnedCards, remainingCards);
  const cardIds = [...randomLearnedCards, ...randomWeakCards, ...randomNewWords].sort(() => Math.random() - 0.5);

  return cardIds.map((cardId) => ({
    id: cardId,
    accuracy: userCards.find((userCard: CardData) => userCard.id === cardId)?.accuracy || '0',
  }));
};
