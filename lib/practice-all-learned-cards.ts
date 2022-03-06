import type { CardData, CardMode, FlashCardData, UserData } from '../src/types';
import { getUserData } from './get-user-data';

export const practiceAllLearnedCards = async (
  userHash: string,
  items: FlashCardData[],
  cardMode: CardMode
): Promise<CardData[]> => {
  const userData: UserData = await getUserData(userHash);
  const userCards: CardData[] = userData.cards;
  const userCardIds: string[] = userCards.map((userCard: CardData) => userCard.id);

  return items
    .filter((card: FlashCardData) => {
      if (cardMode === 'hiragana') {
        return card.hiragana;
      } else if (cardMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .filter((card: FlashCardData) => userCardIds.includes(card.id))
    .map(
      (card: FlashCardData): CardData => ({
        id: card.id,
        accuracy: userCards.find((userCard) => userCard.id === card.id).accuracy,
      })
    )
    .sort(() => Math.random() - 0.5)
    .splice(0, 15);
};
