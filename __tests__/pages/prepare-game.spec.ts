import { NextApiRequest } from 'next';
import * as nextAuth from 'next-auth/react';
import { dynamoDb } from '../../lib/dynamo-db';
import prepareGame from '../../pages/api/prepare-game';
import { CardMode, GameLevel, GameMode } from '../../src/AppState';
import { FlashCardData, UserData } from '../../src/types';

describe('Prepare game', () => {
  it.each([
    '',
    JSON.stringify({}),
    JSON.stringify({ config: {} }),
    JSON.stringify({ config: { cardMode: 'a' } }),
    JSON.stringify({ config: { cardMode: 'a', gameLevel: 'b' } }),
  ])('should return an error when providing missing information', async (testConfig) => {
    const testError = 'Error! Missing required information';
    const testReq = { body: testConfig } as NextApiRequest;
    const testRes: any = { json: jest.fn() };

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith({ error: testError });
  });

  it('should return some card ids', async () => {
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: [{}] });
    const testBody = { config: { cardMode: 'a', gameLevel: 'b', gameMode: 'c' } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };
    const expectedRes = { cardIds: [] };

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith(expectedRes);
  });

  it('should return an error when the user data is invalid', async () => {
    const gameMode: GameMode = 'learn';
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '2';
    const testData: FlashCardData[] = [{ id: '1', en: 'test', jp: 'test', category: 'test', level: '1' }];
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({} as any);
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };
    const expectedError = 'Cannot find user session';

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith({ error: expectedError });
  });

  describe('Guest user', () => {
    it('should return an error when not able to fetch the cards from the DB', async () => {
      const testError = 'Error! Missing data';
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: [] });
      const testBody = { config: { cardMode: 'a', gameLevel: 'b', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ error: testError });
    });

    it('should return all the cards when choosing the English card mode', async () => {
      const cardMode: CardMode = 'en';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should return all the cards when choosing the Kana card mode', async () => {
      const cardMode: CardMode = 'kana';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should only return the cards having an Hiragana version', async () => {
      const cardMode: CardMode = 'hiragana';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.filter((card) => card.hiragana).map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should only return the cards having a Kanji version', async () => {
      const cardMode: CardMode = 'kanji';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.filter((card) => card.hiragana).map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should return all the cards matching the requested level', async () => {
      const cardMode: CardMode = 'en';
      const gameLevel: GameLevel = '2';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '2' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '3' },
      ];
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel, gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.filter((card) => card.level <= gameLevel).map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });
  });

  describe('Learn new words', () => {
    const gameMode: GameMode = 'learn';
    const userData: UserData = {
      id: '123',
      type: 'user',
      current_level: '1',
      learned_cards: [],
      weak_cards: {},
    };
    const testData: FlashCardData[] = [
      { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
      { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '2' },
      { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '3' },
      { id: '4', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
    ];

    it('should return all the cards not learned matching the current user level', async () => {
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: { email: 'test' }, expires: '' });
      jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: userData });
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { gameMode } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = [testData[0].id, testData[3].id];

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should discard cards already learned', async () => {
      const testUserData: UserData = {
        ...userData,
        learned_cards: ['4'],
      };
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: { email: 'test' }, expires: '' });
      jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { gameMode } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = [testData[0].id];

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should include weak cards', async () => {
      const testUserData: UserData = {
        ...userData,
        weak_cards: { '4': '50' },
      };
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: { email: 'test' }, expires: '' });
      jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { gameMode } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = ['1', '4'];

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should include 2 random learned cards', async () => {
      const testUserData: UserData = {
        ...userData,
        learned_cards: ['1', '2'],
      };
      jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: { email: 'test' }, expires: '' });
      jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { gameMode } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = ['1', '4'];

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });
  });
});
