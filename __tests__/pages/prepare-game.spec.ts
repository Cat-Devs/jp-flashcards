import { createHash } from 'crypto';
import { NextApiRequest } from 'next';
import * as nextAuth from 'next-auth/react';
import * as dbClient from '../../lib/dynamo-db';
import * as getAllCards from '../../lib/get-all-cards';
import * as guestUserCards from '../../lib/guest-user-cards';
import * as practice from '../../lib/practice-all-learned-cards';
import * as practiceWeak from '../../lib/practice-weak-cards';
import * as trainCards from '../../lib/train-cards';
import prepareGame from '../../pages/api/prepare-game';
import { CardMode, GameLevel, GameMode } from '../../src/AppState';
import type { FlashCardData } from '../../src/types';

jest.mock('../../lib/dynamo-db');
jest.mock('../../lib/guest-user-cards');
jest.mock('../../lib/get-all-cards');
jest.mock('../../lib/practice-all-learned-cards');
jest.mock('../../lib/train-cards');

describe('Prepare game', () => {
  const mockDBClient = {
    scan: jest.fn(),
  };

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

  it('should return an error when the game mode is not train but the cardMode is missing', async () => {
    const gameMode: GameMode = 'practice';
    const gameLevel: GameLevel = '2';
    const testError = 'Error! Missing required information';
    const testBody = { config: { gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith({ error: testError });
  });

  it('should return an error when the game mode is not train but the gameLevel is missing', async () => {
    const gameMode: GameMode = 'practice';
    const cardMode: CardMode = 'en';
    const testError = 'Error! Missing required information';
    const testBody = { config: { cardMode, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith({ error: testError });
  });

  it('should return an error when the user data is invalid', async () => {
    const gameMode: GameMode = 'train';
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '2';
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({} as any);
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };
    const expectedError = 'Cannot find user session';

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith({ error: expectedError });
  });

  it('should return an error when not able to fetch the cards from the DB', async () => {
    const gameMode: GameMode = 'train';
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '2';
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    jest.spyOn(mockDBClient, 'scan').mockImplementation(() => ({ Items: [] }));
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };
    const expectedError = 'Error! Missing data';

    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith({ error: expectedError });
  });

  it('should return some guest cards when the user is not authenticated', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '1';
    const gameMode: GameMode = 'guest';
    const testData: FlashCardData[] = [{ id: '1', en: 'test', jp: 'test', category: 'test', level: '1' }];
    const expectedRes = testData.map((card) => card.id);
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue(undefined);
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    jest.spyOn(mockDBClient, 'scan').mockImplementation(() => ({ Items: testData }));
    jest.spyOn(guestUserCards, 'guestUserCards').mockReturnValue(expectedRes);
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };
    await prepareGame(testReq, testRes);

    expect(testRes.json).toBeCalledWith({ cardIds: expectedRes });
    expect(guestUserCards.guestUserCards).toBeCalledWith(testData, cardMode, gameLevel);
  });

  it('should return some train cards when the user is authenticated and "learn" is the Game Mode', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '1';
    const gameMode: GameMode = 'train';
    const testData: FlashCardData[] = [
      { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
      { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
      { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
    ];
    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const expectedRes = testData.map((card) => card.id);
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    jest.spyOn(mockDBClient, 'scan').mockImplementation(() => ({ Items: testData }));
    jest.spyOn(trainCards, 'trainCards').mockResolvedValue(expectedRes);
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };

    await prepareGame(testReq, testRes);

    expect(trainCards.trainCards).toBeCalledWith(userHash, testData);
    expect(testRes.json).toBeCalledWith({ cardIds: expectedRes });
  });

  it('should return the learned cards when the user is authenticated and "practice" is the Game Mode', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '1';
    const gameMode: GameMode = 'practice';
    const testData: FlashCardData[] = [
      { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
      { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
      { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
    ];
    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const expectedRes = testData.map((card) => card.id);
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    jest.spyOn(mockDBClient, 'scan').mockImplementation(() => ({ Items: testData }));
    jest.spyOn(practice, 'practiceAllLearnedCards').mockResolvedValue(expectedRes);
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };

    await prepareGame(testReq, testRes);

    expect(practice.practiceAllLearnedCards).toBeCalledWith(userHash, testData, cardMode);
    expect(testRes.json).toBeCalledWith({ cardIds: expectedRes });
  });

  it('should return the weak cards when the user is authenticated and "weak" is the Game Mode', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '1';
    const gameMode: GameMode = 'weak';
    const testData: FlashCardData[] = [
      { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
      { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
      { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
    ];

    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const expectedRes = testData.map((card) => card.id);
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    jest.spyOn(mockDBClient, 'scan').mockImplementation(() => ({ Items: testData }));
    jest.spyOn(practiceWeak, 'practiceWeakCards').mockResolvedValue(expectedRes);
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };

    await prepareGame(testReq, testRes);

    expect(practiceWeak.practiceWeakCards).toBeCalledWith(userHash, testData, cardMode);
    expect(testRes.json).toBeCalledWith({ cardIds: expectedRes });
  });

  it('should return all the cards with the given level when the user is authenticated and "guest" is the Game Mode', async () => {
    const cardMode: CardMode = 'en';
    const gameLevel: GameLevel = '1';
    const gameMode: GameMode = 'guest';
    const testData: FlashCardData[] = [
      { id: '1', en: 'test', jp: 'test', hiragana: 'test', category: 'test', level: '1' },
      { id: '2', en: 'test', jp: 'test', katakana: 'test', category: 'test', level: '1' },
      { id: '3', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '1' },
    ];

    const testUser = { email: 'test' };
    const userHash = createHash('sha256').update(testUser.email).digest('hex');
    const expectedRes = testData.map((card) => card.id);
    jest.spyOn(nextAuth, 'getSession').mockResolvedValue({ user: testUser, expires: '' });
    jest.spyOn(dbClient, 'getDbClient').mockImplementation(() => mockDBClient as any);
    jest.spyOn(mockDBClient, 'scan').mockImplementation(() => ({ Items: testData }));
    jest.spyOn(getAllCards, 'getAllCards').mockResolvedValue(expectedRes);
    const testBody = { config: { cardMode, gameLevel, gameMode } };
    const testReq = { body: JSON.stringify(testBody) } as NextApiRequest;
    const testRes: any = { json: jest.fn() };

    await prepareGame(testReq, testRes);

    expect(getAllCards.getAllCards).toBeCalledWith(userHash, testData, cardMode, gameLevel);
    expect(testRes.json).toBeCalledWith({ cardIds: expectedRes });
  });
});
