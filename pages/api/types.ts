import { GameLevel } from '../../src/AppState';

export interface UserData {
  id: string;
  type: 'user' | 'card';
  weak_cards: {
    [id: string]: string;
  };
  learned_cards: string[];
  current_level: GameLevel;
}
