import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { CardMode, GameMode, useApp } from '../AppState';
import { Settings } from './Settings';

jest.mock('../AppState');

describe('Settings', () => {
  it('should render the Settings component', async () => {
    (useApp as jest.Mock).mockImplementation(() => ({}));

    const component = render(<Settings />);

    expect(component.getByTestId('Settings')).toBeVisible();
  });

  describe('Guest user', () => {
    const gameModeMock: GameMode = 'guest';
    const cardModeMock: CardMode = 'en';
    let useAppMock: Partial<ReturnType<typeof useApp>>;
    let component;

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

    it('should render the Settings component', async () => {
      expect(component.getByTestId('Settings')).toBeVisible();
    });

    it('should render the card Level selector', async () => {
      expect(component.getByTestId('game-level')).toHaveTextContent('Level');
      expect(component.getByTestId('game-level-buttons-group')).toBeVisible();
    });

    it('should render the card mode selector', async () => {
      expect(component.getByTestId('card-mode-settings')).toBeVisible();
    });

    it('should default the card mode to English', async () => {
      expect(component.getByTestId('card-mode-settings')).toHaveTextContent('Show cards in English');
    });

    it('should change the card mode to Hiragana', async () => {
      const hiraganaSelector = component.getByTestId('card-mode-settings-hiragana');
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const expectedCardMode: CardMode = 'hiragana';

      expect(cardModeSettings).toHaveTextContent('Show cards in English');

      fireEvent.click(hiraganaSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toBeCalledWith(expectedCardMode);
      expect(component.getByTestId('card-mode-settings')).toHaveTextContent('Show cards in Hiragana');
    });

    it('should change the card mode to Kana', async () => {
      const kanaSelector = component.getByTestId('card-mode-settings-kana');
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const expectedCardMode: CardMode = 'kana';

      expect(cardModeSettings).toHaveTextContent('Show cards in English');

      fireEvent.click(kanaSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toBeCalledWith(expectedCardMode);
      expect(component.getByTestId('card-mode-settings')).toHaveTextContent('Show cards in any Kana');
    });

    it('should change the card mode to Kanji', async () => {
      const kanjiSelector = component.getByTestId('card-mode-settings-kanji');
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const expectedCardMode: CardMode = 'kanji';

      fireEvent.click(kanjiSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toBeCalledWith(expectedCardMode);
      expect(cardModeSettings).toHaveTextContent('Show cards in Kanji');
    });

    it('should change the card mode back to English after selecting a different one', async () => {
      const cardModeHiragana: CardMode = 'hiragana';
      const cardModeEnglish: CardMode = 'en';
      const cardModeSettings = component.getByTestId('card-mode-settings');
      const englishSelector = component.getByTestId('card-mode-settings-en');
      const hiraganaSelector = component.getByTestId('card-mode-settings-hiragana');

      expect(cardModeSettings).toHaveTextContent('Show cards in English');
      fireEvent.click(hiraganaSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toHaveBeenCalledWith(cardModeHiragana);
      expect(cardModeSettings).toHaveTextContent('Show cards in Hiragana');

      fireEvent.click(englishSelector);
      component.rerender(<Settings />);

      expect(useAppMock.setCardMode).toHaveBeenCalledWith(cardModeEnglish);
      expect(cardModeSettings).toHaveTextContent('Show cards in English');
    });
  });
});
