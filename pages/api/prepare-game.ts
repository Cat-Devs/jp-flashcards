import type { NextApiRequest, NextApiResponse } from 'next';
import { dynamoDb } from '../../lib/dynamo-db';
import { FlashCardData } from '../../src/types';

const prepareGame = async (req: NextApiRequest, res: NextApiResponse) => {
  const { config } = JSON.parse(req.body || '{}');
  const { Items: items } = await dynamoDb.scan({
    FilterExpression: 'attribute_exists(category)',
  });

  if (!config?.gameMode || !config?.gameLevel || !items?.length) {
    return res.json({ error: 'Error! Missing required information' });
  }

  const cardIds: string[] = items
    .filter((card: FlashCardData) => {
      if (config.gameMode === 'hiragana') {
        return card.hiragana;
      } else if (config.gameMode === 'kanji') {
        return card.kanji;
      }
      return true;
    })
    .filter((card: FlashCardData) => {
      const selectedLevel = Number(config.gameLevel);
      const cardLevel = Number(card.level);

      return selectedLevel >= cardLevel;
    })
    .map((card: FlashCardData) => card.id)
    .sort(() => Math.random() - 0.5)
    .splice(0, 20);

  return res.json({ cardIds });
};

export default prepareGame;
