import type { CardData, FlashCardData, UserData } from '../src/types';
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
    cards: [],
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
    const expectedRes: CardData[] = [
      { id: testData[0].id, accuracy: '0' },
      { id: testData[3].id, accuracy: '0' },
    ];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(userData);
    jest.spyOn(pickRandomCards, 'pickRandomCards').mockImplementation((cards, limit) => cards.splice(0, limit));

    const res = await trainCards(userHash, testData);

    expect(res.length).toEqual(2);
    expect(res).toEqual(expectedRes);
  });

  it('should include the weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      cards: [
        { id: '10', accuracy: '50' },
        { id: '11', accuracy: '50' },
        { id: '12', accuracy: '50' },
      ],
    };
    const cardItems = [] as FlashCardData[];
    const expectedRes: CardData[] = testUserData.cards;
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.length).toEqual(testUserData.cards.length);
    expect(res).toEqual(expectedRes);
  });

  it('should include a maximum of 10 weak cards when there are no learned cards available', async () => {
    const maxWeakCards = 10;
    const testUserData: UserData = {
      ...userData,
      cards: [
        { id: '10', accuracy: '50' },
        { id: '11', accuracy: '50' },
        { id: '12', accuracy: '50' },
        { id: '13', accuracy: '50' },
        { id: '14', accuracy: '50' },
        { id: '15', accuracy: '50' },
        { id: '16', accuracy: '50' },
        { id: '17', accuracy: '50' },
        { id: '18', accuracy: '50' },
        { id: '19', accuracy: '50' },
        { id: '20', accuracy: '50' },
      ],
    };
    const cardItems = [] as FlashCardData[];
    const expectedRes: CardData[] = [...testUserData.cards].splice(0, maxWeakCards);
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.length).toBe(maxWeakCards);
    expect(res).toEqual(expectedRes);
  });

  it('should include a maximum of 10 weak cards when there are less than 2 learned cards available', async () => {
    const maxWeakCards = 10;
    const testUserData: UserData = {
      ...userData,
      cards: [
        { id: '1', accuracy: '100' },
        { id: '2', accuracy: '95' },
        { id: '10', accuracy: '50' },
        { id: '11', accuracy: '50' },
        { id: '12', accuracy: '50' },
        { id: '13', accuracy: '50' },
        { id: '14', accuracy: '50' },
        { id: '15', accuracy: '50' },
        { id: '16', accuracy: '50' },
        { id: '17', accuracy: '50' },
        { id: '18', accuracy: '50' },
        { id: '19', accuracy: '50' },
        { id: '20', accuracy: '50' },
      ],
    };
    const cardItems = [] as FlashCardData[];
    const expectedRes = [
      ...testUserData.cards.filter((card) => Number(card.accuracy) >= 93),
      ...testUserData.cards.filter((card) => Number(card.accuracy) < 93).splice(0, maxWeakCards),
    ];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.length).toBe(expectedRes.length);
    expect(res).toEqual(expectedRes);
  });

  it('should include at least 5 random learned cards', async () => {
    const maxWeakCards = 8;
    const weakCards: CardData[] = [
      { id: '3', accuracy: '50' },
      { id: '4', accuracy: '50' },
      { id: '5', accuracy: '50' },
      { id: '6', accuracy: '50' },
      { id: '7', accuracy: '50' },
      { id: '8', accuracy: '50' },
      { id: '9', accuracy: '50' },
    ];
    const learnedCards: CardData[] = [
      { id: '1', accuracy: '100' },
      { id: '2', accuracy: '95' },
      { id: '10', accuracy: '100' },
      { id: '11', accuracy: '100' },
      { id: '12', accuracy: '100' },
      { id: '13', accuracy: '100' },
      { id: '14', accuracy: '100' },
      { id: '15', accuracy: '100' },
      { id: '16', accuracy: '100' },
    ];

    const testUserData: UserData = {
      ...userData,
      cards: [...learnedCards, ...weakCards],
    };
    const newWordsData = [
      { id: '20', level: '1' },
      { id: '21', level: '1' },
      { id: '22', level: '1' },
    ] as FlashCardData[];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);
    const expectedNewCards: CardData[] = [
      { id: newWordsData[0].id, accuracy: '0' },
      { id: newWordsData[1].id, accuracy: '0' },
    ];
    const expectedWeakCards = [...testUserData.cards]
      .filter((card) => Number(card.accuracy) < 93)
      .splice(0, maxWeakCards);
    const expectedLearnedCards = [...testUserData.cards]
      .filter((card) => Number(card.accuracy) >= 93)
      .splice(0, maxTotalCards - expectedWeakCards.length - expectedNewCards.length);

    const expectedRes = [...expectedLearnedCards, ...expectedWeakCards, ...expectedNewCards];

    const res = await trainCards(userHash, newWordsData);

    expect(res.length).toEqual(maxTotalCards);
    expect(expectedRes.length).toEqual(maxTotalCards);
    expect(res).toEqual(expectedRes);
  });

  it('should include more random learned cards when there are no new cards to learn but already learned cards available', async () => {
    const maxWeakCards = 8;
    const testUserData: UserData = {
      ...userData,
      cards: [
        { id: '1', accuracy: '50' },
        { id: '2', accuracy: '50' },
        { id: '3', accuracy: '50' },
        { id: '4', accuracy: '50' },
        { id: '5', accuracy: '50' },
        { id: '6', accuracy: '50' },
        { id: '7', accuracy: '50' },
        { id: '8', accuracy: '50' },
        { id: '9', accuracy: '50' },
        { id: '10', accuracy: '50' },
        { id: '20', accuracy: '100' },
        { id: '21', accuracy: '100' },
        { id: '22', accuracy: '100' },
        { id: '23', accuracy: '100' },
        { id: '24', accuracy: '100' },
        { id: '25', accuracy: '100' },
        { id: '26', accuracy: '100' },
        { id: '27', accuracy: '100' },
        { id: '28', accuracy: '100' },
        { id: '29', accuracy: '100' },
      ],
    };
    const newWordsData = [] as FlashCardData[];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);
    const expectedWeakCards = [...testUserData.cards]
      .filter((card) => Number(card.accuracy) < 93)
      .splice(0, maxWeakCards);
    const expectedLearnedCards = [...testUserData.cards]
      .filter((card) => Number(card.accuracy) >= 93)
      .splice(0, maxTotalCards - expectedWeakCards.length);
    const expectedRes = [...expectedLearnedCards, ...expectedWeakCards];

    const res = await trainCards(userHash, newWordsData);

    expect(res.length).toBe(maxTotalCards);
    expect(res).toEqual(expectedRes);
  });

  it('should include 15 random learned cards when there are no new or weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      cards: [
        { id: '10', accuracy: '100' },
        { id: '11', accuracy: '100' },
        { id: '12', accuracy: '100' },
        { id: '13', accuracy: '100' },
        { id: '14', accuracy: '100' },
        { id: '15', accuracy: '100' },
        { id: '16', accuracy: '100' },
        { id: '17', accuracy: '100' },
        { id: '18', accuracy: '100' },
        { id: '19', accuracy: '100' },
        { id: '20', accuracy: '100' },
        { id: '21', accuracy: '100' },
        { id: '22', accuracy: '100' },
        { id: '23', accuracy: '100' },
        { id: '24', accuracy: '100' },
        { id: '25', accuracy: '100' },
      ],
    };
    const newWordsData = [] as FlashCardData[];
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);
    const expectedLearnedCards = [...testUserData.cards].splice(0, maxTotalCards);

    const res = await trainCards(userHash, newWordsData);

    expect(res.length).toEqual(maxTotalCards);
    expect(res).toEqual(expectedLearnedCards);
  });

  it('should return only new cards when there are no learned nor weak cards', async () => {
    const maxNewCards = 4;
    const testUserData: UserData = { ...userData };
    const cardItems = [
      { id: '10', level: '1' },
      { id: '11', level: '1' },
      { id: '12', level: '1' },
      { id: '13', level: '1' },
      { id: '14', level: '1' },
    ] as FlashCardData[];
    const expectedRes: CardData[] = [...cardItems]
      .map((cardItem) => ({
        id: cardItem.id,
        accuracy: '0',
      }))
      .splice(0, maxNewCards);
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, cardItems);

    expect(res.length).toEqual(maxNewCards);
    expect(res).toEqual(expectedRes);
  });

  it('should bump the level when there are no card left', async () => {
    const learnedCards: FlashCardData[] = [testData[0], testData[3]];
    const testUserData: UserData = {
      ...userData,
      cards: learnedCards.map((learnedCards) => ({ id: learnedCards.id, accuracy: '100' })),
    };
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.length).toEqual(learnedCards.length);
    expect(bumpUserLevel).toHaveBeenCalledWith(userHash);
  });

  it('should not bump the level when there are still weak cards', async () => {
    const testUserData: UserData = {
      ...userData,
      cards: [
        { id: '1', accuracy: '100' },
        { id: '2', accuracy: '50' },
        { id: '4', accuracy: '100' },
      ],
    };
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.sort).toEqual(testUserData.cards.sort);
    expect(bumpUserLevel).not.toHaveBeenCalled();
  });

  it('should not bump the level when the user is already at the max level', async () => {
    const userLevel = '5';
    const testUserData: UserData = {
      ...userData,
      current_level: userLevel,
      cards: [
        { id: '1', accuracy: '100' },
        { id: '4', accuracy: '100' },
      ],
    };
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.length).toEqual(testUserData.cards.length);
    expect(bumpUserLevel).not.toHaveBeenCalled();
  });

  it('should keep returning a max of 15 random learned cards when the user is already at the max level', async () => {
    const userLevel = '5';
    const testUserData: UserData = {
      ...userData,
      current_level: userLevel,
      cards: [
        { id: '1', accuracy: '100' },
        { id: '2', accuracy: '100' },
        { id: '3', accuracy: '100' },
        { id: '4', accuracy: '100' },
        { id: '5', accuracy: '100' },
        { id: '6', accuracy: '100' },
        { id: '7', accuracy: '100' },
        { id: '8', accuracy: '100' },
        { id: '9', accuracy: '100' },
        { id: '10', accuracy: '100' },
        { id: '11', accuracy: '100' },
        { id: '12', accuracy: '100' },
        { id: '13', accuracy: '100' },
        { id: '14', accuracy: '100' },
        { id: '15', accuracy: '100' },
        { id: '16', accuracy: '100' },
        { id: '17', accuracy: '100' },
      ],
    };
    const expectedRes = [...testUserData.cards].splice(0, maxTotalCards);
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.length).toEqual(maxTotalCards);
    expect(res).toEqual(expectedRes);
  });

  it('should keep returning a max of 15 random learned and weak cards when the user is already at the max level', async () => {
    const userLevel = '5';
    const testUserData: UserData = {
      ...userData,
      current_level: userLevel,
      cards: [
        { id: '1', accuracy: '100' },
        { id: '2', accuracy: '100' },
        { id: '3', accuracy: '100' },
        { id: '4', accuracy: '100' },
        { id: '5', accuracy: '100' },
        { id: '6', accuracy: '100' },
        { id: '7', accuracy: '100' },
        { id: '8', accuracy: '100' },
        { id: '9', accuracy: '100' },
        { id: '10', accuracy: '100' },
        { id: '11', accuracy: '100' },
        { id: '12', accuracy: '100' },
        { id: '13', accuracy: '100' },
        { id: '14', accuracy: '100' },
        { id: '15', accuracy: '100' },
        { id: '16', accuracy: '100' },
        { id: '17', accuracy: '100' },
        { id: '20', accuracy: '50' },
        { id: '21', accuracy: '50' },
      ],
    };
    const expectedWeakCards = [...testUserData.cards].filter((card) => Number(card.accuracy) < 93);
    const expectedRes = [...testUserData.cards]
      .filter((card) => Number(card.accuracy) >= 93)
      .splice(0, maxTotalCards - 2)
      .concat(expectedWeakCards);
    jest.spyOn(getUserData, 'getUserData').mockResolvedValue(testUserData);

    const res = await trainCards(userHash, testData);

    expect(res.length).toEqual(maxTotalCards);
    expect(res).toEqual(expectedRes);
  });
});
