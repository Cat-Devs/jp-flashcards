import type { CardData, CardMode, FlashCardData, UserData } from '../src/types';
import { getUserData } from './get-user-data';

export const practiceWeakCards = async (
  userHash: string,
  items: FlashCardData[],
  cardMode: CardMode
): Promise<CardData[]> => {
  const userData: UserData = await getUserData(userHash);
  const userCards: CardData[] = userData.cards;
  const weakCards: string[] = userCards
    .filter((userCard: CardData) => Number(userCard.accuracy) < 93)
    .map((userCard: CardData) => userCard.id);

  return items
    .filter((card: FlashCardData) => weakCards.includes(card.id))
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .map(
      (card: FlashCardData): CardData => ({
        id: card.id,
        accuracy: userCards.find((userCard) => userCard.id === card.id).accuracy,
      })
    )
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);
};
