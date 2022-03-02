import { appReducer } from './appReducer';
import { AppAction, AppActionType, AppState, CardMode, GameLevel, GameMode } from './types';

describe('appReducer', () => {
  const initialState: AppState = {
    userStats: undefined,
    loading: {
      loading: false,
      loadingUser: false,
      loadingUserStats: false,
      loadingData: false,
      loadingSound: false,
    },
    game: {
      remainingCards: [],
      usedCards: [],
      wrongCards: [],
      correctCards: [],
      nextCard: '',
      cardMode: 'en',
      gameLevel: '1',
      gameMode: 'guest',
      currentCard: '',
    },
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

      expect(res.loading.loading).toBe(true);
    });

    it('should set the loading to false', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING,
        payload: false,
      });

      expect(res.loading.loading).toBe(false);
    });

    it('should not set the loading to false when still loading a sound', () => {
      const loadingSound = true;
      const testState: AppState = {
        ...initialState,
        loading: {
          ...initialState.loading,
          loadingSound,
        },
      };

      const res = appReducer(testState, {
        type: AppActionType.LOADING,
        payload: false,
      });

      expect(res.loading.loadingData).toBe(false);
      expect(res.loading.loading).toBe(true);
    });
  });

  describe('LOADING_SOUND', () => {
    it('should set the loading to true', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: true,
      });

      expect(res.loading.loading).toBe(true);
    });

    it('should set the loading to false', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: false,
      });

      expect(res.loading.loading).toBe(false);
    });

    it('should set the loading sound to true', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: true,
      });

      expect(res.loading.loadingSound).toBe(true);
    });

    it('should set the loading sound to false', () => {
      const res = appReducer(initialState, {
        type: AppActionType.LOADING_SOUND,
        payload: false,
      });

      expect(res.loading.loadingSound).toBe(false);
    });

    it('should not set the loading to false when still loading data', () => {
      const loadingData = true;
      const testState: AppState = {
        ...initialState,
        loading: {
          ...initialState.loading,
          loadingData,
        },
      };

      const res = appReducer(testState, {
        type: AppActionType.LOADING_SOUND,
        payload: false,
      });

      expect(res.loading.loadingSound).toBe(false);
      expect(res.loading.loading).toBe(true);
    });
  });

  describe('LOAD_DATA', () => {
    const cardIds = ['1', '2', '3', '4', '5'];

    it('should create a new state', () => {
      const currentCard = '1';
      const testState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          remainingCards: ['2'],
          usedCards: ['3', '4', '5'],
          nextCard: '6',
        },
      };

      const res = appReducer(
        { ...testState },
        {
          type: AppActionType.LOAD_DATA,
          payload: {
            cardIds,
            cardsStats: undefined,
            nextCard: currentCard,
          },
        }
      );

      expect(res).not.toEqual(testState);
    });

    it('should not set a next card when there is only 1 card in total', () => {
      const currentCard = '1';
      const testState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          remainingCards: [],
          usedCards: [],
          nextCard: '',
        },
      };

      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardsStats: undefined,
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
          cardsStats: undefined,
          cardIds,
          nextCard,
        },
      });

      expect(res.game.currentCard).toBe(nextCard);
    });

    it('should correctly set the next card to use', () => {
      const currentCard = '1';
      const testCardIds = ['1', '2'];
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardsStats: undefined,
          cardIds: testCardIds,
          nextCard: currentCard,
        },
      });
      const expectedNextCard = testCardIds.filter((cardId) => cardId !== currentCard)[0];

      expect(res.game.nextCard).toBe(expectedNextCard);
    });

    it('should correctly set the remaining cards', () => {
      const currentCard = '1';
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardsStats: undefined,
          cardIds,
          nextCard: currentCard,
        },
      });
      const remainingCards = cardIds.filter((cardId) => cardId !== currentCard);

      expect(res.game.remainingCards).toEqual(remainingCards);
      expect(res.game.currentCard).toEqual(currentCard);
    });

    it('should correctly set the used cards', () => {
      const currentCard = '1';
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardsStats: undefined,
          cardIds,
          nextCard: currentCard,
        },
      });

      expect(res.game.usedCards).toEqual([]);
    });
  });

  describe('NEXT_CARD', () => {
    const remainingCards = ['2', '3', '4', '5'];

    it('should correctly pick a new current card to use', () => {
      const nextCard = '2';
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          nextCard,
          remainingCards,
          currentCard: '1',
        },
      };
      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.game.currentCard).toBe(nextCard);
    });

    it('should correctly set a new next card to use', () => {
      const nextCard = '2';
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          nextCard,
          remainingCards,
          currentCard: '1',
        },
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.game.nextCard).not.toBe(nextCard);
      expect(remainingCards).toContain(res.game.nextCard);
    });

    it('should remove the new current card from the remaining ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          nextCard,
          remainingCards,
        },
      };

      expect(appState.game.remainingCards).toContain(nextCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.game.remainingCards).not.toContain(nextCard);
    });

    it('should add the current card to the used ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          nextCard,
          remainingCards,
        },
      };

      expect(appState.game.usedCards).not.toContain(currentCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.game.usedCards).toContain(currentCard);
    });

    it('should add the current card to the correct ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          nextCard,
          remainingCards,
        },
      };

      expect(appState.game.correctCards).not.toContain(currentCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.game.correctCards).toContain(currentCard);
    });

    it('should add the current card to the wrong ones', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          nextCard,
          remainingCards,
        },
      };

      expect(appState.game.wrongCards).not.toContain(currentCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'wrong',
      });

      expect(res.game.wrongCards).toContain(currentCard);
    });

    it('should pick the last card from the remaining and not create a new next card', () => {
      const currentCard = '1';
      const nextCard = '2';

      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          nextCard,
          remainingCards: [nextCard],
        },
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.game.nextCard).toBe('');
    });

    it('should not create a new current card when the next card is empty', () => {
      const currentCard = '1';
      const nextCard = '';

      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard,
          nextCard,
        },
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
        payload: 'correct',
      });

      expect(res.game.currentCard).toBe('');
      expect(res.game.nextCard).toBe('');
      expect(res.game.remainingCards).toEqual([]);
      expect(res.game.usedCards).toEqual([currentCard]);
    });
  });

  describe('SET_CARDS', () => {
    it('should change the game mode to hiragana', () => {
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          cardMode: 'en',
        },
      };
      const testCardMode: CardMode = 'hiragana';

      const res = appReducer(appState, {
        type: AppActionType.SET_CARDS,
        payload: testCardMode,
      });

      expect(res.game.cardMode).toEqual(testCardMode);
    });

    it('should change the game mode to kanji', () => {
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          cardMode: 'en',
        },
      };
      const testCardMode: CardMode = 'kanji';

      const res = appReducer(appState, {
        type: AppActionType.SET_CARDS,
        payload: testCardMode,
      });

      expect(res.game.cardMode).toEqual(testCardMode);
    });

    it('should change the game mode to kana', () => {
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          cardMode: 'en',
        },
      };
      const testCardMode: CardMode = 'kana';

      const res = appReducer(appState, {
        type: AppActionType.SET_CARDS,
        payload: testCardMode,
      });

      expect(res.game.cardMode).toEqual(testCardMode);
    });
  });

  describe('SET_LEVEL', () => {
    it('should change the game level', () => {
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          gameLevel: '1',
        },
      };
      const testGameLevel: GameLevel = '2';

      const res = appReducer(appState, {
        type: AppActionType.SET_LEVEL,
        payload: testGameLevel,
      });

      expect(res.game.gameLevel).toEqual(testGameLevel);
    });
  });

  describe('SET_GAME_MODE', () => {
    it('should change the game mode', () => {
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          gameMode: 'guest',
        },
      };
      const testGameMode: GameMode = 'train';

      const res = appReducer(appState, {
        type: AppActionType.SET_GAME_MODE,
        payload: testGameMode,
      });

      expect(res.game.gameMode).toEqual(testGameMode);
    });
  });

  describe('Play wrong cards', () => {
    it('should create a new game using only the wrong cards from the previous session', () => {
      const testWrongCards = ['1', '2', '3', '4'];
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard: '',
          wrongCards: testWrongCards,
        },
      };

      const res = appReducer(appState, { type: AppActionType.PLAY_WRONG_CARDS });

      expect(res.game.wrongCards).toEqual([]);
      expect(res.game.remainingCards.length).toEqual(testWrongCards.length - 1);
      expect(testWrongCards.includes(res.game.currentCard)).toBe(true);
      expect(testWrongCards.includes(res.game.nextCard)).toBe(true);
    });

    it('should only ask for 1 card when the wrong cards pool contains only 1 item', () => {
      const testWrongCards = ['1'];
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard: '',
          wrongCards: testWrongCards,
        },
      };

      const res = appReducer(appState, { type: AppActionType.PLAY_WRONG_CARDS });

      expect(res.game.wrongCards).toEqual([]);
      expect(res.game.remainingCards.length).toEqual(testWrongCards.length - 1);
      expect(testWrongCards.includes(res.game.currentCard)).toBe(true);
      expect(testWrongCards.includes(res.game.nextCard)).toBe(false);
    });

    it('should do nothing when there are no wrong cards left', () => {
      const testWrongCards = [];
      const appState: AppState = {
        ...initialState,
        game: {
          ...initialState.game,
          currentCard: '',
          wrongCards: testWrongCards,
        },
      };

      const res = appReducer(appState, { type: AppActionType.PLAY_WRONG_CARDS });

      expect(res.game.wrongCards).toEqual([]);
      expect(res.game.remainingCards.length).toEqual(0);
      expect(res.game.currentCard).toEqual('');
    });
  });
});
