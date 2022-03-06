import { CardData, CardMode, FlashCardData, GameLevel, UserData } from '../src/types';
import { getAllCards } from './get-all-cards';
import * as getUserData from './get-user-data';

jest.mock('./get-user-data');

describe('getAllCards', () => {
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
    const gameLevel: GameLevel = '5';

    const res = await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(res).toBeDefined();
  });

  it('should return all the cards when the mode is EN and the level is the last available', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '5';
    const expectedRes: CardData[] = testItems.map((item) => ({ id: item.id, accuracy: '0' }));

    const res = await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the cards in hiragana when the mode is HIRAGANA and the level is the last available', async () => {
    const cardMode: CardMode = 'hiragana';
    const gameLevel: GameLevel = '5';
    const expectedRes: CardData[] = testItems
      .filter((item) => item.hiragana)
      .map((item) => ({ id: item.id, accuracy: '0' }));

    const res = await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the cards when the mode is KANA and the level is the last available', async () => {
    const cardMode: CardMode = 'kana';
    const gameLevel: GameLevel = '5';
    const expectedRes: CardData[] = testItems.map((item) => ({ id: item.id, accuracy: '0' }));

    const res = await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the cards with a kanji when the mode is KANJI and the level is the last available', async () => {
    const cardMode: CardMode = 'kanji';
    const gameLevel: GameLevel = '5';
    const expectedRes: CardData[] = testItems
      .filter((item) => item.kanji)
      .map((item) => ({ id: item.id, accuracy: '0' }));

    const res = await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(res).toEqual(expectedRes);
  });

  it('should return all the cards with at least a level of 3', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '3';
    const expectedRes: CardData[] = testItems
      .filter((item) => item.level <= gameLevel)
      .map((item) => ({ id: item.id, accuracy: '0' }));

    const res = await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(res).toEqual(expectedRes);
  });

  it('should get the user data', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '3';
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(getUserData.getUserData).toHaveBeenCalledWith(userHash);
  });

  it('should return the card accuracy from the user data', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '3';
    const userCard: CardData = { id: '1', accuracy: '10' };
    const expectedRes: CardData[] = testItems
      .filter((item) => item.level <= gameLevel)
      .map((item) => ({
        id: item.id,
        accuracy: userCard.id === item.id ? userCard.accuracy : '0',
      }));
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue({
      ...testUserData,
      cards: [userCard],
    });

    const res = await getAllCards(userHash, testItems, cardMode, gameLevel);

    expect(res).toEqual(expectedRes);
  });
});
