import { FlashCardData, UserData } from '../src/types';
import { bumpUserLevel } from './bump-user-level';
import * as getUserData from './get-user-data';
import * as pickRandomCards from './pick-random-card';
import { trainCards } from './train-cards';

jest.mock('./pick-random-card');
jest.mock('./get-user-data');
jest.mock('./bump-user-level');

describe('Train Cards', () => {
  const userHash = 'test_user_hash';
  const maxTotalCards = 15;

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
    jest.spyOn(pickRandomCards, 'pickRandomCards').mockImplementation((cards, limit) => [...cards].splice(0, limit));
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

  it('should only return the cards matching the current user level', async () => {
    const expectedRes = [testData[0].id, testData[3].id];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(pickRandomCards, 'pickRandomCards').mockImplementation((cards, limit) => cards.splice(0, limit));

    const res = await trainCards(userHash, testData);

    expect(res.cardIds.length).toEqual(2);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should include the weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: {
        '10': '50',
        '11': '50',
        '12': '50',
      },
    };
    const cardItems = [] as FlashCardData[];
    const expectedRes = ['10', '11', '12'];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.cardIds.length).toEqual(3);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should include a maximum of 10 weak cards when there are no learned cards available', async () => {
    const maxWeakCards = 10;
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
        '19': '50',
        '20': '50',
      },
    };
    const cardItems = [] as FlashCardData[];
    const expectedRes = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.cardIds.length).toBe(maxWeakCards);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should include a maximum of 10 weak cards when there are less than 2 learned cards available', async () => {
    const maxWeakCards = 10;
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
        '19': '50',
        '20': '50',
      },
      learned_cards: ['1', '2'],
    };
    const cardItems = [] as FlashCardData[];
    const expectedRes = ['1', '2', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.cardIds.length).toBe(maxWeakCards + testUserData.learned_cards.length);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should include at least 5 random learned cards', async () => {
    const maxWeakCards = 8;
    const maxLearnedCards = 5;
    const testUserData: UserData = {
      ...userData,
      weak_cards: {
        '1': '50',
        '2': '50',
        '3': '50',
        '4': '50',
        '5': '50',
        '6': '50',
        '7': '50',
        '8': '50',
        '9': '50',
      },
      learned_cards: ['10', '11', '12', '13', '14', '15', '16'],
    };
    const newWordsData = [
      { id: '20', level: '1' },
      { id: '21', level: '1' },
      { id: '22', level: '1' },
    ] as FlashCardData[];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);
    const expectedWeakCards = Object.keys(testUserData.weak_cards).splice(0, maxWeakCards);
    const expectedLearnedCards = [...testUserData.learned_cards].splice(0, maxLearnedCards);
    const expectedNewCards = [newWordsData[0].id, newWordsData[1].id];
    const expectedRes = [...expectedLearnedCards, ...expectedWeakCards, ...expectedNewCards];

    const res = await trainCards(userHash, newWordsData);

    expect(res.cardIds.length).toEqual(maxTotalCards);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should include more random learned cards when there are no new cards to learn but already learned cards available', async () => {
    const maxWeakCards = 8;
    const testUserData: UserData = {
      ...userData,
      weak_cards: {
        '1': '50',
        '2': '50',
        '3': '50',
        '4': '50',
        '5': '50',
        '6': '50',
        '7': '50',
        '8': '50',
        '9': '50',
        '10': '50',
      },
      learned_cards: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
    };
    const newWordsData = [] as FlashCardData[];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);
    const expectedWeakCards = Object.keys(testUserData.weak_cards).splice(0, maxWeakCards);
    const expectedLearnedCards = [...testUserData.learned_cards].splice(0, maxTotalCards - maxWeakCards);
    const expectedRes = [...expectedLearnedCards, ...expectedWeakCards];

    const res = await trainCards(userHash, newWordsData);

    expect(res.cardIds.length).toBe(maxTotalCards);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should include 15 random learned cards when there are no new or weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: {},
      learned_cards: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
    };
    const newWordsData = [] as FlashCardData[];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);
    const expectedLearnedCards = [...testUserData.learned_cards].splice(0, 15);

    const res = await trainCards(userHash, newWordsData);

    expect(res.cardIds).toEqual(expectedLearnedCards);
    expect(res.cardIds.length).toEqual(maxTotalCards);
  });

  it('should return only new cards when there are no learned nor weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: {},
    };
    const cardItems = [
      { id: '10', level: '1' },
      { id: '11', level: '1' },
      { id: '12', level: '1' },
      { id: '13', level: '1' },
      { id: '14', level: '1' },
    ] as FlashCardData[];
    const maxNewCards = 4;
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.cardIds.length).toEqual(maxNewCards);
    expect(res.cardIds).toEqual([cardItems[0].id, cardItems[1].id, cardItems[2].id, cardItems[3].id]);
  });

  it('should bump the level when there are no card left', async () => {
    const testUserData: UserData = {
      ...userData,
      learned_cards: ['1', '4'],
    };
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.cardIds.length).toEqual(testUserData.learned_cards.length);
    expect(bumpUserLevel).toHaveBeenCalledWith(userHash);
  });

  it('should not bump the level when there are still weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: { '2': '50' },
      learned_cards: ['1', '4'],
    };
    const expectedRes = [...testUserData.learned_cards, testData[1].id];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.cardIds).toEqual(expectedRes);
    expect(bumpUserLevel).not.toHaveBeenCalled();
  });

  it('should not bump the level when the user is already at the max level', async () => {
    const userLevel = '5';
    const testUserData: UserData = {
      ...userData,
      current_level: userLevel,
      learned_cards: ['1', '4'],
    };
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.cardIds.length).toEqual(testUserData.learned_cards.length);
    expect(bumpUserLevel).not.toHaveBeenCalled();
  });

  it('should keep returning a max of 15 random learned cards when the user is already at the max level', async () => {
    const userLevel = '5';
    const testUserData: UserData = {
      ...userData,
      current_level: userLevel,
      learned_cards: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
    };
    const expectedRes = [...testUserData.learned_cards].splice(0, maxTotalCards);
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.cardIds.length).toEqual(maxTotalCards);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should keep returning a max of 15 random learned and weak cards when the user is already at the max level', async () => {
    const userLevel = '5';
    const testUserData: UserData = {
      ...userData,
      current_level: userLevel,
      weak_cards: { '20': '50', '21': '50' },
      learned_cards: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
    };
    const expectedRes = [...testUserData.learned_cards]
      .splice(0, maxTotalCards - 2)
      .concat(Object.keys(testUserData.weak_cards));
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.cardIds.length).toEqual(maxTotalCards);
    expect(res.cardIds).toEqual(expectedRes);
  });

  it('should return a generated card stats data', async () => {
    const testUserData: UserData = {
      ...userData,
      weak_cards: { '2': '40' },
      learned_cards: ['1', '4'],
    };
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.cardsStats).toEqual([
      { id: testUserData.learned_cards[0], score: '100' },
      { id: testUserData.learned_cards[1], score: '100' },
      {
        id: Object.keys(testUserData.weak_cards)[0],
        score: testUserData.weak_cards[Object.keys(testUserData.weak_cards)[0]],
      },
    ]);
  });
});
