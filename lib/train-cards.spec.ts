import { FlashCardData, UserData } from '../src/types';
import { dynamoDb } from './dynamo-db';
import { trainCards } from './train-cards';

describe('Train Cards', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  const testMail = 'test@mail.com';
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

  it('should return all the cards matching the current user level', async () => {
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: userData });
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
    const expectedRes = [testData[0].id, testData[3].id];

    const res = await trainCards(testMail, testData);

    expect(res).toEqual(expectedRes);
  });

  it('should include all the weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: { '4': '50' },
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
    const expectedRes = ['1', '4'];

    const res = await trainCards(testMail, testData);

    expect(res).toEqual(expectedRes);
  });

  it('should include 2 random learned cards', async () => {
    const testUserData: UserData = {
      ...userData,
      learned_cards: ['2', '3'],
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
    const expectedRes = [testData[0].id, testData[3].id, ...testUserData.learned_cards];

    const res = await trainCards(testMail, testData);

    expect(res.sort()).toEqual(expectedRes.sort());
  });

  it('should include only 2 random learned cards', async () => {
    const expectedLearnedCards = ['3', '5'];
    const testUserData: UserData = {
      ...userData,
      learned_cards: ['2', ...expectedLearnedCards, '6'],
    };
    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
    const expectedRes = [testData[0].id, testData[3].id, ...expectedLearnedCards];

    const res = await trainCards(testMail, testData);

    expect(res.sort()).toEqual(expectedRes.sort());
  });

  it('should bump the level when there are no card left', async () => {
    const testUserData: UserData = {
      ...userData,
      learned_cards: ['1', '4'],
    };

    jest.spyOn(dynamoDb, 'get').mockResolvedValue({ Item: testUserData });
    jest.spyOn(dynamoDb, 'scan').mockResolvedValue({ Items: testData });
    jest.spyOn(dynamoDb, 'update');

    await trainCards(testMail, testData);

    expect(dynamoDb.update).toHaveBeenCalledWith({
      Key: { id: expect.any(String) },
      UpdateExpression: 'set level = :l',
      ExpressionAttributeValues: { ':l': '2' },
    });
  });
});
