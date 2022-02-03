import { appReducer } from "./appReducer";
import { AppState, AppActionType } from "./types";

describe(appReducer, () => {
  const initialState: AppState = {
    remainingCards: [],
    usedCards: [],
    wrongCards: [],
    correctCards: [],
    nextCard: "",
    gameMode: "en",
    currentCard: "",
  };

  describe("LOAD_DATA", () => {
    const cardIds = ["1", "2", "3", "4", "5"];

    it("should preserve the current state", () => {
      const currentCard = "1";
      const testState: AppState = {
        currentCard,
        remainingCards: ["2"],
        usedCards: ["3", "4", "5"],
        wrongCards: [],
        correctCards: [],
        nextCard: "6",
        gameMode: "en",
      };

      const res = appReducer(
        { ...testState },
        {
          type: AppActionType.LOAD_DATA,
          payload: {
            cardIds,
            randomCard: currentCard,
          },
        }
      );

      expect(res).toEqual(testState);
    });

    it("should correctly set the current card to be displayed", () => {
      const randomCard = "1";
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds,
          randomCard,
        },
      });

      expect(res.currentCard).toBe(randomCard);
    });

    it("should correctly set the next card to use", () => {
      const currentCard = "1";
      const testCardIds = ["1", "2"];
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds: testCardIds,
          randomCard: currentCard,
        },
      });
      const expectedNextCard = testCardIds.filter(
        (cardId) => cardId !== currentCard
      )[0];

      expect(res.nextCard).toBe(expectedNextCard);
    });

    it("should correctly set the remaining cards", () => {
      const currentCard = "1";
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds,
          randomCard: currentCard,
        },
      });
      const remainingCards = cardIds.filter((cardId) => cardId !== currentCard);

      expect(res.remainingCards).toEqual(remainingCards);
      expect(res.currentCard).toEqual(currentCard);
    });

    it("should correctly set the used cards", () => {
      const currentCard = "1";
      const res = appReducer(initialState, {
        type: AppActionType.LOAD_DATA,
        payload: {
          cardIds,
          randomCard: currentCard,
        },
      });

      expect(res.usedCards).toEqual([]);
    });
  });

  describe("NEXT_CARD", () => {
    const remainingCards = ["2", "3", "4", "5"];

    it("should correctly pick a new current card to use", () => {
      const nextCard = "2";
      const appState: AppState = {
        nextCard,
        remainingCards,
        currentCard: "1",
        usedCards: [],
        wrongCards: [],
        correctCards: [],
        gameMode: "en",
      };
      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
      });

      expect(res.currentCard).toBe(nextCard);
    });

    it("should correctly set a new next card to use", () => {
      const nextCard = "2";
      const appState: AppState = {
        nextCard,
        remainingCards,
        currentCard: "1",
        usedCards: [],
        wrongCards: [],
        correctCards: [],
        gameMode: "en",
      };
      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
      });

      expect(res.nextCard).not.toBe(nextCard);
      expect(remainingCards).toContain(res.nextCard);
    });

    it("should remove the new current card from the remaining ones", () => {
      const currentCard = "1";
      const nextCard = "2";

      const appState: AppState = {
        currentCard,
        nextCard,
        remainingCards,
        usedCards: [],
        wrongCards: [],
        correctCards: [],
        gameMode: "en",
      };

      expect(appState.remainingCards).toContain(nextCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
      });

      expect(res.remainingCards).not.toContain(nextCard);
    });

    it("should add the current card to the used ones", () => {
      const currentCard = "1";
      const nextCard = "2";

      const appState: AppState = {
        currentCard,
        nextCard,
        remainingCards,
        usedCards: [],
        wrongCards: [],
        correctCards: [],
        gameMode: "en",
      };

      expect(appState.usedCards).not.toContain(currentCard);

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
      });

      expect(res.usedCards).toContain(currentCard);
    });

    it("should pick the last card from the remaining and not create a new next card", () => {
      const currentCard = "1";
      const nextCard = "2";

      const appState: AppState = {
        currentCard,
        nextCard,
        remainingCards: [nextCard],
        usedCards: [],
        wrongCards: [],
        correctCards: [],
        gameMode: "en",
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
      });

      expect(res.nextCard).toBe("");
    });

    it("should not create a new current card when the next card is empty", () => {
      const currentCard = "1";
      const nextCard = "";

      const appState: AppState = {
        currentCard,
        nextCard,
        remainingCards: [],
        usedCards: [],
        wrongCards: [],
        correctCards: [],
        gameMode: "en",
      };

      const res = appReducer(appState, {
        type: AppActionType.NEXT_CARD,
      });

      expect(res.currentCard).toBe("");
      expect(res.nextCard).toBe("");
      expect(res.remainingCards).toEqual([]);
      expect(res.usedCards).toEqual([currentCard]);
    });
  });
});
