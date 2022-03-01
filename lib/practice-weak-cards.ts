import type { CardMode, FlashCardData } from '../src/types';
import { getUserData } from './get-user-data';

export const practiceWeakCards = async (
  userHash: string,
  items: FlashCardData[],
  cardMode: CardMode
): Promise<string[]> => {
  const userData = await getUserData(userHash);
  const weakCardIds = Object.keys(userData.weak_cards);

  return items
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .filter((card: FlashCardData) => weakCardIds.includes(card.id))
    .map((card: FlashCardData) => card.id)
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);
};
