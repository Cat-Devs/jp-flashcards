import { AppAction, AppActionType, AppState, CardMode } from './types';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionType.LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          loadingData: Boolean(action.payload),
          loading: Boolean(action.payload || state.loading.loadingSound),
        },
      };
    }

    case AppActionType.LOADING_SOUND: {
      return {
        ...state,
        loading: {
          ...state.loading,
          loadingSound: Boolean(action.payload),
          loading: Boolean(action.payload || state.loading.loadingData),
        },
      };
    }

    case AppActionType.LOADING_USER: {
      return {
        ...state,
        loading: {
          ...state.loading,
          loadingUser: Boolean(action.payload),
        },
      };
    }

    case AppActionType.LOADING_USER_STATS: {
      return {
        ...state,
        loading: {
          ...state.loading,
          loadingUserStats: Boolean(action.payload),
        },
      };
    }

    case AppActionType.LOAD_DATA: {
      const remainingCards = action.payload.cards
        .filter((card) => card.id !== action.payload.nextCard)
        .map((card) => card.id);
      const random = Math.floor(Math.random() * remainingCards.length);
      const nextCard = remainingCards.length ? remainingCards[random] : '';

      return {
        ...state,
        game: {
          ...state.game,
          cards: action.payload.cards,
          remainingCards,
          nextCard: `${nextCard}`,
          currentCard: `${action.payload.nextCard}`,
          usedCards: [],
          wrongCards: [],
          correctCards: [],
        },
      };
    }

    case AppActionType.NEXT_CARD: {
      const newCurrentCard = state.game.nextCard;
      const newRemainingCards = state.game.remainingCards.filter((card) => card !== newCurrentCard);
      const random = Math.floor(Math.random() * newRemainingCards.length);
      const nextCard = newRemainingCards.length ? newRemainingCards[random] : '';
      const newUsedCards = [...state.game.usedCards, state.game.currentCard];
      const newCorrectCards = [
        ...state.game.correctCards,
        ...(action.payload === 'correct' ? [state.game.currentCard] : []),
      ];
      const newWrongCards = [...state.game.wrongCards, ...(action.payload === 'wrong' ? [state.game.currentCard] : [])];

      return {
        ...state,
        game: {
          ...state.game,
          currentCard: `${newCurrentCard}`,
          nextCard: `${nextCard}`,
          remainingCards: newRemainingCards,
          usedCards: newUsedCards,
          correctCards: newCorrectCards,
          wrongCards: newWrongCards,
        },
      };
    }

    case AppActionType.SET_CARDS: {
      return {
        ...state,
        game: {
          ...state.game,
          cardMode: action.payload,
        },
      };
    }

    case AppActionType.SET_LEVEL: {
      return {
        ...state,
        game: {
          ...state.game,
          gameLevel: action.payload,
        },
      };
    }

    case AppActionType.SET_GAME_MODE: {
      const cardMode: CardMode = action.payload === 'train' ? 'en' : state.game.cardMode;

      return {
        ...state,
        game: {
          ...state.game,
          cardMode,
          gameMode: action.payload,
        },
      };
    }

    case AppActionType.PLAY_WRONG_CARDS: {
      if (!state.game.wrongCards.length) {
        return state;
      }

      const random = Math.floor(Math.random() * state.game.wrongCards.length);
      const currentCard: string = state.game.wrongCards[random];
      const remainingCards: string[] = state.game.wrongCards.filter((card) => card !== currentCard);
      const nextCardRandom = Math.floor(Math.random() * remainingCards.length);
      const nextCard: string = remainingCards.length ? remainingCards[nextCardRandom] : '';

      return {
        ...state,
        game: {
          ...state.game,
          currentCard,
          nextCard,
          remainingCards,
          correctCards: [],
          usedCards: [],
          wrongCards: [],
        },
      };
    }

    case AppActionType.SET_USER_STATS: {
      return {
        ...state,
        userStats: action.payload,
      };
    }

    default:
      return state;
  }
}
