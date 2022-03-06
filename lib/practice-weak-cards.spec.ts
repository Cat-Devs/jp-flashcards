import type { CardData, CardMode, FlashCardData, UserData } from '../src/types';
import * as getUserData from './get-user-data';
import { practiceWeakCards } from './practice-weak-cards';

describe('practiceWeakCards', () => {
  const userHash = 'test_user_hash';
  const testItems: FlashCardData[] = [
    { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
    { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '2' },
    { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '3' },
    { id: '4', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
    { id: '5', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '4' },
    { id: '6', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '4' },
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

  it('should return some cards', async () => {
    const cardMode: CardMode = 'en';

    const res = await practiceWeakCards(userHash, testItems, cardMode);

    expect(res).toBeDefined();
  });

  it('should return all the weak cards when the mode is EN', async () => {
    const cardMode: CardMode = 'en';
    const userData: UserData = {
      ...testUserData,
      cards: [
        { id: '1', accuracy: '10' },
        { id: '2', accuracy: '10' },
      ],
    };
    const expectedRes: CardData[] = userData.cards;
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);

    const res = await practiceWeakCards(userHash, testItems, cardMode);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the weak cards having an hiragana when the mode is HIRAGANA', async () => {
    const cardMode: CardMode = 'hiragana';
    const userData: UserData = {
      ...testUserData,
      cards: [
        { id: '1', accuracy: '10' },
        { id: '2', accuracy: '10' },
      ],
    };
    const expectedRes: CardData[] = [userData.cards[0]];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);

    const res = await practiceWeakCards(userHash, testItems, cardMode);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the weak cards having a kanji when the mode is KANJI', async () => {
    const cardMode: CardMode = 'kanji';
    const userData: UserData = {
      ...testUserData,
      cards: [
        { id: '1', accuracy: '10' },
        { id: '2', accuracy: '10' },
        { id: '3', accuracy: '10' },
      ],
    };
    const expectedRes: CardData[] = [userData.cards[2]];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);

    const res = await practiceWeakCards(userHash, testItems, cardMode);

    expect(res).toEqual(expectedRes);
  });

  it('should get the user data', async () => {
    const cardMode: CardMode = 'en';
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    await practiceWeakCards(userHash, testItems, cardMode);

    expect(getUserData.getUserData).toHaveBeenCalledWith(userHash);
  });

  it('should ', async () => {
    const cardMode: CardMode = 'kanji';
    const userData: UserData = {
      ...testUserData,
      cards: [
        { id: '1', accuracy: '10' },
        { id: '2', accuracy: '10' },
        { id: '3', accuracy: '10' },
      ],
    };
    const expectedRes: CardData[] = [userData.cards[2]];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);

    const res = await practiceWeakCards(userHash, testItems, cardMode);

    expect(res).toEqual(expectedRes);
  });
});
