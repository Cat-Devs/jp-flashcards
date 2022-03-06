import type { CardData, CardMode, FlashCardData, UserData } from '../src/types';
import * as getUserData from './get-user-data';
import { practiceAllLearnedCards } from './practice-all-learned-cards';

describe('practiceAllLearnedCards', () => {
  const userHash = 'test_user_hash';
  const testItems: FlashCardData[] = [
    { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
    { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '2' },
    { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '3' },
    { id: '4', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
    { id: '5', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '4' },
    { id: '6', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '4' },
  ];
  const testUserData: UserData = {
    cards: [],
    current_level: '1',
    id: userHash,
    type: 'user',
  };

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);
  });

  it('', async () => {
    const cardMode: CardMode = 'en';

    const res = await practiceAllLearnedCards(userHash, testItems, cardMode);

    expect(res).toBeDefined();
  });

  it("should return no results when the user doesn't contain any card", async () => {
    const cardMode: CardMode = 'en';
    const expectedRes: CardData[] = [];

    const res = await practiceAllLearnedCards(userHash, testItems, cardMode);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the user cards when the mode is EN', async () => {
    const cardMode: CardMode = 'en';
    const userCards: CardData[] = [
      { id: '1', accuracy: '10' },
      { id: '2', accuracy: '10' },
      { id: '3', accuracy: '94' },
    ];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue({
      ...testUserData,
      cards: userCards,
    });

    const res = await practiceAllLearnedCards(userHash, testItems, cardMode);

    expect(res).toEqual(userCards);
  });

  it('should return all the cards in hiragana when the mode is HIRAGANA', async () => {
    const cardMode: CardMode = 'hiragana';
    const userCards: CardData[] = [
      { id: '1', accuracy: '10' },
      { id: '2', accuracy: '10' },
      { id: '3', accuracy: '94' },
      { id: '6', accuracy: '90' },
    ];
    const expectedRes: CardData[] = [userCards[0], userCards[3]];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue({
      ...testUserData,
      cards: userCards,
    });

    const res = await practiceAllLearnedCards(userHash, testItems, cardMode);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the cards with a kanji when the mode is KANJI', async () => {
    const cardMode: CardMode = 'kanji';
    const userCards: CardData[] = [
      { id: '1', accuracy: '10' },
      { id: '2', accuracy: '10' },
      { id: '3', accuracy: '94' },
    ];
    const expectedRes: CardData[] = [userCards[2]];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue({
      ...testUserData,
      cards: userCards,
    });

    const res = await practiceAllLearnedCards(userHash, testItems, cardMode);

    expect(res).toEqual(expectedRes);
  });

  it('should get the user data', async () => {
    const cardMode: CardMode = 'en';
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    await practiceAllLearnedCards(userHash, testItems, cardMode);

    expect(getUserData.getUserData).toHaveBeenCalledWith(userHash);
  });
});
