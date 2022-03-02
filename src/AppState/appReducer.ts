import { AppAction, AppActionType, AppState } from './types';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionType.LOADING: {
      return {
        ...state,
        loadingData: Boolean(action.payload),
        loading: Boolean(action.payload || state.loadingSound),
      };
    }

    case AppActionType.LOADING_SOUND: {
      return {
        ...state,
        loadingSound: Boolean(action.payload),
        loading: Boolean(action.payload || state.loadingData),
      };
    }

    case AppActionType.LOADING_USER: {
      return {
        ...state,
        loadingUser: Boolean(action.payload),
      };
    }

    case AppActionType.LOADING_USER_STATS: {
      return {
        ...state,
        loadingUserStats: Boolean(action.payload),
      };
    }

    case AppActionType.LOAD_DATA: {
      const remainingCards = action.payload.cardIds.filter((cardId) => cardId !== action.payload.nextCard);
      const random = Math.floor(Math.random() * remainingCards.length);
      const nextCard = remainingCards.length ? remainingCards[random] : '';

      return {
        ...state,
        remainingCards,
        nextCard: `${nextCard}`,
        currentCard: `${action.payload.nextCard}`,
        cardsStats: action.payload.cardsStats,
        usedCards: [],
        wrongCards: [],
        correctCards: [],
      };
    }

    case AppActionType.NEXT_CARD: {
      const newCurrentCard = state.nextCard;
      const newRemainingCards = state.remainingCards.filter((card) => card !== newCurrentCard);
      const random = Math.floor(Math.random() * newRemainingCards.length);
      const nextCard = newRemainingCards.length ? newRemainingCards[random] : '';
      const newUsedCards = [...state.usedCards, state.currentCard];
      const newCorrectCards = [...state.correctCards, ...(action.payload === 'correct' ? [state.currentCard] : [])];
      const newWrongCards = [...state.wrongCards, ...(action.payload === 'wrong' ? [state.currentCard] : [])];

      return {
        ...state,
        currentCard: `${newCurrentCard}`,
        nextCard: `${nextCard}`,
        remainingCards: newRemainingCards,
        usedCards: newUsedCards,
        correctCards: newCorrectCards,
        wrongCards: newWrongCards,
      };
    }

    case AppActionType.SET_CARDS: {
      return {
        ...state,
        cardMode: action.payload,
      };
    }

    case AppActionType.SET_LEVEL: {
      return {
        ...state,
        gameLevel: action.payload,
      };
    }

    case AppActionType.SET_GAME_MODE: {
      return {
        ...state,
        gameMode: action.payload,
      };
    }

    case AppActionType.PLAY_WRONG_CARDS: {
      if (!state.wrongCards.length) {
        return state;
      }

      const random = Math.floor(Math.random() * state.wrongCards.length);
      const currentCard: string = state.wrongCards[random];
      const remainingCards: string[] = state.wrongCards.filter((card) => card !== currentCard);
      const nextCardRandom = Math.floor(Math.random() * remainingCards.length);
      const nextCard: string = remainingCards.length ? remainingCards[nextCardRandom] : '';

      return {
        ...state,
        currentCard,
        nextCard,
        remainingCards,
        correctCards: [],
        usedCards: [],
        wrongCards: [],
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
