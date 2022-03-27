import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { CardMode, GameLevel, GameMode, useApp, UserState } from '../AppState';
import { CARD_MODE_LABELS, GAME_MODE_LABELS } from '../strings';
import { Settings } from './Settings';

jest.mock('../AppState');

describe('Settings', () => {
  let component: ReturnType<typeof render>;

  it('should render the Settings component', () => {
    (useApp as jest.Mock).mockImplementation(() => ({}));

    const component = render(<Settings />);

    expect(component.getByTestId('Settings')).toBeVisible();
  });

  describe('Guest user', () => {
    const gameModeMock: GameMode = 'guest';
    const cardModeMock: CardMode = 'en';
    let useAppMock: Partial<ReturnType<typeof useApp>>;

    beforeEach(() => {
      useAppMock = {
        gameMode: gameModeMock,
        cardMode: cardModeMock,
        setCardMode: jest.fn().mockImplementation((value: CardMode) => {
          useAppMock.cardMode = value;
        }),
      };
      (useApp as jest.Mock).mockImplementation(() => useAppMock);
      component = render(<Settings />);
    });

    it('should render the Settings component', () => {
      expect(component.getByTestId('Settings')).toBeVisible();
    });

    it('should render the card Level selector', () => {
      expect(component.getByTestId('game-level')).toHaveTextContent('Level');
      expect(component.getByTestId('game-level-buttons-group')).toBeVisible();
    });

    it('should render the card mode selector', () => {
      expect(component.getByTestId('card-mode-settings')).toBeVisible();
    });

    it('should default the card mode to English', () => {
      expect(component.getByTestId('card-mode-settings')).toHaveTextContent(CARD_MODE_LABELS.EN);
    });

    it('should change the card mode to Hiragana', () => {
      const hiraganaSelector = component.getByTestId('card-mode-settings-hiragana');
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const expectedCardMode: CardMode = 'hiragana';

      expect(cardModeSettings).toHaveTextContent(CARD_MODE_LABELS.EN);

      fireEvent.click(hiraganaSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toBeCalledWith(expectedCardMode);
      expect(component.getByTestId('card-mode-settings')).toHaveTextContent(CARD_MODE_LABELS.HIRAGANA);
    });

    it('should change the card mode to Kana', () => {
      const kanaSelector = component.getByTestId('card-mode-settings-kana');
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const expectedCardMode: CardMode = 'kana';

      expect(cardModeSettings).toHaveTextContent(CARD_MODE_LABELS.EN);

      fireEvent.click(kanaSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toBeCalledWith(expectedCardMode);
      expect(component.getByTestId('card-mode-settings')).toHaveTextContent(CARD_MODE_LABELS.KANA);
    });

    it('should change the card mode to Kanji', () => {
      const kanjiSelector = component.getByTestId('card-mode-settings-kanji');
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const expectedCardMode: CardMode = 'kanji';

      fireEvent.click(kanjiSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toBeCalledWith(expectedCardMode);
      expect(cardModeSettings).toHaveTextContent(CARD_MODE_LABELS.KANJI);
    });

    it('should change the card mode back to English after selecting a different one', () => {
      const cardModeHiragana: CardMode = 'hiragana';
      const cardModeEnglish: CardMode = 'en';
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const englishSelector = component.getByTestId('card-mode-settings-en');
      const hiraganaSelector = component.getByTestId('card-mode-settings-hiragana');

      expect(cardModeSettings).toHaveTextContent(CARD_MODE_LABELS.EN);
      fireEvent.click(hiraganaSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toHaveBeenCalledWith(cardModeHiragana);
      expect(cardModeSettings).toHaveTextContent(CARD_MODE_LABELS.HIRAGANA);

      fireEvent.click(englishSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toHaveBeenCalledWith(cardModeEnglish);
      expect(cardModeSettings).toHaveTextContent(CARD_MODE_LABELS.EN);
    });
  });

  describe('Game level', () => {
    const gameModeMock: GameMode = 'guest';
    const cardModeMock: CardMode = 'en';
    const gameLevelMock: GameLevel = '1';
    let useAppMock: Partial<ReturnType<typeof useApp>>;

    beforeEach(() => {
      useAppMock = {
        gameMode: gameModeMock,
        cardMode: cardModeMock,
        gameLevel: gameLevelMock,
        setLevel: jest.fn().mockImplementation((value: GameLevel) => {
          useAppMock.gameLevel = value;
        }),
      };
      (useApp as jest.Mock).mockImplementation(() => useAppMock);
      component = render(<Settings />);
    });

    it('should display a card level component', () => {
      const gameLevel = component.getByTestId('game-level');
      expect(gameLevel).toBeVisible();
      expect(gameLevel).toHaveTextContent('Level');
    });

    it('should get the card level from the app context', () => {
      const gameLevelGroup = component.getByTestId('game-level-buttons-group');

      expect(gameLevelGroup).toHaveTextContent(gameLevelMock);
    });

    it('should change the game level', () => {
      const gameLevel5 = component.getByTestId('game-level-5');
      fireEvent.click(gameLevel5);
      component.rerender(<Settings />);

      expect(useAppMock.setLevel).toBeCalledWith('5');
    });
  });

  describe('Authenticated user', () => {
    const gameModeMock: GameMode = 'train';
    const cardModeMock: CardMode = 'en';
    let useAppMock: Partial<ReturnType<typeof useApp>>;
    let mockUser: UserState = {
      userHash: 'userHash',
      level: 1,
      learnedCards: 1,
      weakCards: 1,
    };

    beforeEach(() => {
      useAppMock = {
        gameMode: gameModeMock,
        cardMode: cardModeMock,
        userLoggedIn: true,
        user: mockUser,
        setCardMode: jest.fn().mockImplementation((value: CardMode) => {
          useAppMock.cardMode = value;
        }),
        setGameMode: jest.fn().mockImplementation((value: GameMode) => {
          useAppMock.gameMode = value;
        }),
      };
      (useApp as jest.Mock).mockImplementation(() => useAppMock);
      component = render(<Settings />);
    });

    it('should render the Settings component', () => {
      expect(component.getByTestId('Settings')).toBeVisible();
    });

    it('should render the game mode selector', () => {
      expect(component.getByTestId('game-mode-settings')).toBeVisible();
    });

    it('should set the game mode to Train', () => {
      expect(component.getByTestId('game-mode-settings')).toHaveTextContent(GAME_MODE_LABELS.TRAIN);
    });

    it('should change the game mode to Practice', () => {
      const gameModeSettings = component.getByTestId('game-mode-settings');
      const practiceSelector = component.getByTestId('game-mode-settings-practice');
      const expectedGameMode: GameMode = 'practice';

      fireEvent.click(practiceSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setGameMode).toBeCalledWith(expectedGameMode);
      expect(gameModeSettings).toHaveTextContent(GAME_MODE_LABELS.PRACTICE);
    });

    it('should change the game mode to Weak cards', () => {
      const gameModeSettings = component.getByTestId('game-mode-settings');
      const weakSelector = component.getByTestId('game-mode-settings-weak');
      const expectedGameMode: GameMode = 'weak';

      fireEvent.click(weakSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setGameMode).toBeCalledWith(expectedGameMode);
      expect(gameModeSettings).toHaveTextContent(GAME_MODE_LABELS.WEAK);
    });

    it('should change the game mode to guest', () => {
      const gameModeSettings = component.getByTestId('game-mode-settings');
      const guestSelector = component.getByTestId('game-mode-settings-guest');
      const expectedGameMode: GameMode = 'guest';

      fireEvent.click(guestSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setGameMode).toBeCalledWith(expectedGameMode);
      expect(gameModeSettings).toHaveTextContent(GAME_MODE_LABELS.GUEST);
    });

    it('should not change the game mode to train when already selected', () => {
      const gameModeSettings = component.getByTestId('game-mode-settings');
      const trainSelector = component.getByTestId('game-mode-settings-train');

      fireEvent.click(trainSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setGameMode).not.toBeCalled();
      expect(gameModeSettings).toHaveTextContent(GAME_MODE_LABELS.TRAIN);
    });

    it('should hide weak cards mode when the user does not have cards to improve', () => {
      const gameModeSettings = component.getByTestId('game-mode-settings');
      const weakSelector = component.getByTestId('game-mode-settings-weak');

      useAppMock.user.weakCards = 0;
      component.rerender(<Settings />);
      fireEvent.click(weakSelector);

      expect(useAppMock.setGameMode).not.toBeCalled();
      expect(gameModeSettings).toHaveTextContent(GAME_MODE_LABELS.TRAIN);
    });
  });
});
