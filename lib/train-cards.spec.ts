import { createHash } from 'crypto';
import { FlashCardData, UserData } from '../src/types';
import { bumpUserLevel } from './bump-user-level';
import { dynamoDb } from './dynamo-db';
import { trainCards } from './train-cards';

jest.mock('./dynamo-db');
jest.mock('./bump-user-level');

describe('Train Cards', () => {
  const testMail = 'test@mail.com';

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

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
    { id: '5', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '4' },
    { id: '6', en: 'test', jp: 'test', kanji: 'test', category: 'test', level: '4' },
  ];

  it('should return all the cards matching the current user level', async () => {
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: userData });
    const expectedRes = [testData[0].id, testData[3].id];

    const res = await trainCards(testMail, testData);

    expect(res).toEqual(expectedRes);
  });

  it('should return a default user data when playing the first time', async () => {
    const testUserData = undefined;

    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    const expectedRes = [testData[0].id, testData[3].id];

    const res = await trainCards(testMail, testData);

    expect(res).toEqual(expectedRes);
  });

  it('should include all the weak cards first', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: {
        '10': '50',
        '11': '50',
        '12': '50',
        '13': '50',
        '14': '50',
        '15': '50',
        '16': '50',
        '17': '50',
        '18': '50',
      },
    };
    const cardItems = [
      { id: '1', level: '1' },
      { id: '2', level: '1' },
      { id: '3', level: '1' },
      { id: '4', level: '1' },
      { id: '5', level: '1' },
      { id: '6', level: '1' },
      { id: '7', level: '1' },
      { id: '8', level: '1' },
      { id: '9', level: '1' },
      { id: '10', level: '1' },
      { id: '11', level: '1' },
      { id: '12', level: '1' },
      { id: '13', level: '1' },
      { id: '14', level: '1' },
      { id: '15', level: '1' },
      { id: '16', level: '1' },
      { id: '17', level: '1' },
      { id: '18', level: '1' },
    ] as FlashCardData[];
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    const expectedRes = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '1', '2', '3', '4'];

    const res = await trainCards(testMail, cardItems);

    expect(res).toEqual(expectedRes);
  });

  it('should include 2 random learned cards', async () => {
    const testUserData: UserData = {
      ...userData,
      learned_cards: ['2', '3'],
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    const expectedRes = [testData[0].id, testData[3].id, ...testUserData.learned_cards];

    const res = await trainCards(testMail, testData);

    expect(res.sort()).toEqual(expectedRes.sort());
  });

  it('should include all the weak cards and 2 learned cards', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: {
        '10': '50',
        '11': '50',
        '12': '50',
        '13': '50',
        '14': '50',
        '15': '50',
        '16': '50',
        '17': '50',
        '18': '50',
      },
      learned_cards: ['7', '8'],
    };
    const cardItems = [
      { id: '1', level: '1' },
      { id: '2', level: '1' },
      { id: '3', level: '1' },
      { id: '4', level: '1' },
      { id: '5', level: '1' },
      { id: '6', level: '1' },
      { id: '7', level: '1' },
      { id: '8', level: '1' },
      { id: '9', level: '1' },
      { id: '10', level: '1' },
      { id: '11', level: '1' },
      { id: '12', level: '1' },
      { id: '13', level: '1' },
      { id: '14', level: '1' },
      { id: '15', level: '1' },
      { id: '16', level: '1' },
      { id: '17', level: '1' },
      { id: '18', level: '1' },
    ] as FlashCardData[];
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    const expectedRes = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '1', '2', '3', '4', '8', '7'];

    const res = await trainCards(testMail, cardItems);

    expect(res).toEqual(expectedRes);
  });

  it('should include only 2 random learned cards', async () => {
    const expectedLearnedCards = ['3', '5'];
    const testUserData: UserData = {
      ...userData,
      learned_cards: ['2', ...expectedLearnedCards, '6'],
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    const expectedRes = [testData[0].id, testData[3].id, ...expectedLearnedCards];

    const res = await trainCards(testMail, testData);

    expect(res.sort()).toEqual(expectedRes.sort());
  });

  it('should bump the level when there are no card left', async () => {
    const userHash = createHash('sha256').update(testMail).digest('hex') || null;
    const testUserData: UserData = {
      ...userData,
      learned_cards: ['1', '4'],
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });

    await trainCards(testMail, testData);

    expect(bumpUserLevel).toHaveBeenCalledWith(userHash);
  });

  it('should not bump the level when there are still weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: { '2': '50' },
      learned_cards: ['1', '4'],
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    const expectedRes = [testData[0].id, testData[1].id, testData[3].id];

    const res = await trainCards(testMail, testData);

    expect(bumpUserLevel).not.toHaveBeenCalled();
    expect(res.sort()).toEqual(expectedRes.sort());
  });

  it('should not bump the level when the user is already at the max level', async () => {
    const userLevel = '5';
    const testUserData: UserData = {
      ...userData,
      current_level: userLevel,
      learned_cards: ['1', '4'],
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    const expectedRes = [];

    const res = await trainCards(testMail, testData);

    expect(bumpUserLevel).not.toHaveBeenCalled();
    expect(res.sort()).toEqual(expectedRes.sort());
  });
});
