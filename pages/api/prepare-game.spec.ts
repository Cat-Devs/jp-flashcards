import { NextApiRequest } from 'next';
import { dynamoDb } from '../../lib/dynamo-db';
import { CardMode, GameLevel, GameMode } from '../../src/AppState';
import { FlashCardData } from '../../src/types';
import prepareGame from './prepare-game';
import { mockSession } from './__mocks__/next-auth/react';

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
    mockSession(undefined);
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: [{}] });
    const testBody = { config: { cardMode: 'a', gameLevel: 'b', gameMode: 'c' } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };
    const expectedRes = { cardIds: [] };

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith(expectedRes);
  });

  it('should return an error when the user data is invalid', async () => {
    mockSession({});
    const gameMode: GameMode = 'learn';
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '2';
    const testData: FlashCardData[] = [{ id: '1', en: 'test', jp: 'test', category: 'test', level: '1' }];
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
      mockSession(undefined);
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: [] });
      const testBody = { config: { cardMode: 'a', gameLevel: 'b', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ error: testError });
    });

    it('should return all the cards when choosing the English card mode', async () => {
      mockSession(undefined);
      const cardMode: CardMode = 'en';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should return all the cards when choosing the Kana card mode', async () => {
      mockSession(undefined);
      const cardMode: CardMode = 'kana';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should only return the cards having an Hiragana version', async () => {
      mockSession(undefined);
      const cardMode: CardMode = 'hiragana';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.filter((card) => card.hiragana).map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should only return the cards having a Kanji version', async () => {
      mockSession(undefined);
      const cardMode: CardMode = 'kanji';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
        { id: '3', en: 'test', jp: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel: '1', gameMode: 'c' } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = testData.filter((card) => card.hiragana).map((card) => card.id);

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should return all the cards matching the requested level', async () => {
      mockSession(undefined);
      const cardMode: CardMode = 'en';
      const gameLevel: GameLevel = '2';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '2' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '3' },
      ];
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
    it('should return all the cards not learned matching the current level', async () => {
      mockSession({ user: { email: 'test' } });
      const gameMode: GameMode = 'learn';
      const cardMode: CardMode = 'en';
      const gameLevel: GameLevel = '1';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '2' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '3' },
        { id: '4', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      const testBody = { config: { cardMode, gameLevel, gameMode } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = [testData[0].id, testData[3].id];

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });

    it('should discard all the cards already learned', async () => {
      mockSession({ user: { email: 'test' } });
      const gameMode: GameMode = 'learn';
      const cardMode: CardMode = 'en';
      const gameLevel: GameLevel = '1';
      const testData: FlashCardData[] = [
        { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
        { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '2' },
        { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '3' },
        { id: '4', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
      ];
      jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
      jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: { learned_cards: ['4'] } });
      const testBody = { config: { cardMode, gameLevel, gameMode } };
      const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
      const testRes: any = { json: jest.fn() };
      const expectedRes = [testData[0].id];

      await prepareGame(testReq, testRes);

      expect(testRes.json).toBeCalledWith({ cardIds: expect.arrayContaining(expectedRes) });
    });
  });
});
