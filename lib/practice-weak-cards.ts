import type { CardMode, CardStats, FlashCardData } from '../src/types';
import { getUserData } from './get-user-data';

export const practiceWeakCards = async (
  userHash: string,
  items: FlashCardData[],
  cardMode: CardMode
): Promise<{ cardsStats: CardStats[]; cardIds: string[] }> => {
  const userData = await getUserData(userHash);
  const weakCards = Object.keys(userData.weak_cards);

  const cardIds = items
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .filter((card: FlashCardData) => weakCards.includes(card.id))
    .map((card: FlashCardData) => card.id)
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);

  const cardsStats = cardIds.reduce((acc, curr) => {
    if (weakCards.includes(curr)) {
      return [...acc, { id: curr, score: userData.weak_cards[curr] }];
    }
    return [...acc, { id: curr, score: '0' }];
  }, []);

  return { cardsStats, cardIds };
};
