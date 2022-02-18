import { appReducer } from './appReducer';
import { AppAction, AppActionType, AppState, CardMode, GameLevel, GameMode } from './types';

describe('appReducer', () => {
  const initialState: AppState = {
    remainingCards: [],
    usedCards: [],
    wrongCards: [],
    correctCards: [],
    nextCard: '',
    cardMode: 'en',
    gameLevel: '1',
    gameMode: 'guest',
    currentCard: '',
    loading: false,
    loadingData: false,
    loadingSound: false,
  };

  describe('default', () => {
    it('should return the state by default', () => {
      const res = appReducer(initialState, {} as AppAction);

      expect(res).toEqual(initialState);
    });
  });

  describe('LOADING', () => {
    it('should set the loading to true', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING,
        payload: true,
      });

      expect(res.loading).toBe(true);
    });

    it('should set the loading to false', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING,
        payload: false,
      });

      expect(res.loading).toBe(false);
    });

    it('should not set the loading to false when still loading a sound', () => {
      const loadingSound = true;
      const testState: AppState = {
        ...initialState,
        loadingSound,
      };

      const res = appReducer(testState, {
        type: AppActionType.LOADING,
        payload: false,
      });

      expect(res.loadingData).toBe(false);
      expect(res.loading).toBe(true);
    });
  });

  describe('LOADING_SOUND', () => {
    it('should set the loading to true', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: true,
      });

      expect(res.loading).toBe(true);
    });

    it('should set the loading to false', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: false,
      });

      expect(res.loading).toBe(false);
    });

    it('should set the loading sound to true', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: true,
      });

      expect(res.loadingSound).toBe(true);
    });

    it('should set the loading sound to false', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: false,
      });

      expect(res.loadingSound).toBe(false);
    });

    it('should not set the loading to false when still loading data', () => {
      const loadingData = true;
      const testState: AppState = {
        ...initialState,
        loadingData,
      };

      const res = appReducer(testState, {
        type: AppActionType.LOADING_SOUND,
        payload: false,
      });

      expect(res.loadingSound).toBe(false);
      expect(res.loading).toBe(true);
    });
  });

  describe('LOAD_DATA', () => {
    const cardIds = ['1', '2', '3', '4', '5'];

    it('should create a new state', () => {
      const currentCard = '1';
      const testState: AppState = {
        ...initialState,
        currentCard,
        remainingCards: ['2'],
        usedCards: ['3', '4', '5'],
        nextCard: '6',
      };

      const res = appReducer(
        { ...testState },
        {
          type: AppActionType.LOAD_DATA,
          payload: {
            cardIds,
            nextCard: currentCard,
          },
        }
      );

      expect(res).not.toEqual(testState);
    });

    it.only('should not set a next card when there is only 1 card in total', () => {
      const currentCard = '1';
      const testState: AppState = {
        ...initialState,
        currentCard,
        remainingCards: [],
        usedCards: [],
        nextCard: '',
      };

      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds: [currentCard],
          nextCard: currentCard,
        },
      });

      expect(res).toEqual(testState);
    });

    it('should correctly set the current card to be displayed', () => {
      const nextCard = '1';
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds,
          nextCard,
        },
      });

      expect(res.currentCard).toBe(nextCard);
    });

    it('should correctly set the next card to use', () => {
      const currentCard = '1';
      const testCardIds = ['1', '2'];
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds: testCardIds,
          nextCard: currentCard,
        },
      });
      const expectedNextCard = testCardIds.filter((cardId) => cardId !== currentCard)[0];

      expect(res.nextCard).toBe(expectedNextCard);
    });

    it('should correctly set the remaining cards', () => {
      const currentCard = '1';
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds,
          nextCard: currentCard,
        },
      });
      const remainingCards = cardIds.filter((cardId) => cardId !== currentCard);

      expect(res.remainingCards).toEqual(remainingCards);
      expect(res.currentCard).toEqual(currentCard);
    });

    it('should correctly set the used cards', () => {
      const currentCard = '1';
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds,
          nextCard: currentCard,
        },
      });

      expect(res.usedCards).toEqual([]);
    });
  });

  describe('NEXT_CARD', () => {
    const remainingCards = ['2', '3', '4', '5'];

    it('should correctly pick a new current card to use', () => {
      const nextCard = '2';
      const appState: AppState = {
        ...initialState,
        nextCard,
        remainingCards,
        currentCard: '1',
      };
      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.currentCard).toBe(nextCard);
    });

    it('should correctly set a new next card to use', () => {
      const nextCard = '2';
      const appState: AppState = {
        ...initialState,
        nextCard,
        remainingCards,
        currentCard: '1',
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.nextCard).not.toBe(nextCard);
      expect(remainingCards).toContain(res.nextCard);
    });

    it('should remove the new current card from the remaining ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        currentCard,
        nextCard,
        remainingCards,
      };

      expect(appState.remainingCards).toContain(nextCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.remainingCards).not.toContain(nextCard);
    });

    it('should add the current card to the used ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        currentCard,
        nextCard,
        remainingCards,
      };

      expect(appState.usedCards).not.toContain(currentCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.usedCards).toContain(currentCard);
    });

    it('should add the current card to the correct ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        currentCard,
        nextCard,
        remainingCards,
      };

      expect(appState.correctCards).not.toContain(currentCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.correctCards).toContain(currentCard);
    });

    it('should add the current card to the wrong ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        currentCard,
        nextCard,
        remainingCards,
      };

      expect(appState.wrongCards).not.toContain(currentCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'wrong',
      });

      expect(res.wrongCards).toContain(currentCard);
    });

    it('should pick the last card from the remaining and not create a new next card', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        currentCard,
        nextCard,
        remainingCards: [nextCard],
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.nextCard).toBe('');
    });

    it('should not create a new current card when the next card is empty', () => {
      const currentCard = '1';
      const nextCard = '';

      const appState: AppState = {
        ...initialState,
        currentCard,
        nextCard,
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.currentCard).toBe('');
      expect(res.nextCard).toBe('');
      expect(res.remainingCards).toEqual([]);
      expect(res.usedCards).toEqual([currentCard]);
    });
  });

  describe('Game Mode', () => {
    it('should change the game mode to hiragana', () => {
      const appState: AppState = {
        ...initialState,
        cardMode: 'en',
      };
      const testCardMode: CardMode = 'hiragana';

      const res = appReducer(appState, {
        type: AppActionType.SET_GAME,
        payload: testCardMode,
      });

      expect(res.cardMode).toEqual(testCardMode);
    });

    it('should change the game mode to kanji', () => {
      const appState: AppState = {
        ...initialState,
        cardMode: 'en',
      };
      const testCardMode: CardMode = 'kanji';

      const res = appReducer(appState, {
        type: AppActionType.SET_GAME,
        payload: testCardMode,
      });

      expect(res.cardMode).toEqual(testCardMode);
    });

    it('should change the game mode to kana', () => {
      const appState: AppState = {
        ...initialState,
        cardMode: 'en',
      };
      const testCardMode: CardMode = 'kana';

      const res = appReducer(appState, {
        type: AppActionType.SET_GAME,
        payload: testCardMode,
      });

      expect(res.cardMode).toEqual(testCardMode);
    });
  });

  describe('Set Game Level', () => {
    it('should change the game level', () => {
      const appState: AppState = {
        ...initialState,
        gameLevel: '1',
      };
      const testGameLevel: GameLevel = '2';

      const res = appReducer(appState, {
        type: AppActionType.SET_LEVEL,
        payload: testGameLevel,
      });

      expect(res.gameLevel).toEqual(testGameLevel);
    });
  });

  describe('Set Game Mode', () => {
    it('should change the game mode', () => {
      const appState: AppState = {
        ...initialState,
        gameMode: 'guest',
      };
      const testGameMode: GameMode = 'learn';

      const res = appReducer(appState, {
        type: AppActionType.SET_MODE,
        payload: testGameMode,
      });

      expect(res.gameMode).toEqual(testGameMode);
    });
  });

  describe('Play wrong cards', () => {
    it('should create a new game using only the wrong cards from the previous session', () => {
      const testWrongCards = ['1', '2', '3', '4'];
      const appState: AppState = {
        ...initialState,
        currentCard: '',
        wrongCards: testWrongCards,
      };

      const res = appReducer(appState, { type: AppActionType.PLAY_WRONG_CARDS });

      expect(res.wrongCards).toEqual([]);
      expect(res.remainingCards.length).toEqual(testWrongCards.length - 1);
      expect(testWrongCards.includes(res.currentCard)).toBe(true);
      expect(testWrongCards.includes(res.nextCard)).toBe(true);
    });

    it('should only ask for 1 card when the wrong cards pool contains only 1 item', () => {
      const testWrongCards = ['1'];
      const appState: AppState = {
        ...initialState,
        currentCard: '',
        wrongCards: testWrongCards,
      };

      const res = appReducer(appState, { type: AppActionType.PLAY_WRONG_CARDS });

      expect(res.wrongCards).toEqual([]);
      expect(res.remainingCards.length).toEqual(testWrongCards.length - 1);
      expect(testWrongCards.includes(res.currentCard)).toBe(true);
      expect(testWrongCards.includes(res.nextCard)).toBe(false);
    });

    it('should do nothing when there are no wrong cards left', () => {
      const testWrongCards = [];
      const appState: AppState = {
        ...initialState,
        currentCard: '',
        wrongCards: testWrongCards,
      };

      const res = appReducer(appState, { type: AppActionType.PLAY_WRONG_CARDS });

      expect(res.wrongCards).toEqual([]);
      expect(res.remainingCards.length).toEqual(0);
      expect(res.currentCard).toEqual('');
    });
  });
});
