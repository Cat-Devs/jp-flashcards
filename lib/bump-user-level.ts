import { dynamoDb } from './dynamo-db';

export const bumpUserLevel = async (userHash: string) => {
  const data = await dynamoDb.get({
    Key: {
      id: userHash,
    },
  });

  if (!data?.Item?.current_level) {
    throw new Error('Cannot get current user level');
  }

  const newLevel = `${Number(data.Item.current_level) + 1}`;

  await dynamoDb.update({
    Key: {
      id: userHash,
    },
    UpdateExpression: 'set level = :l',
    ExpressionAttributeValues: {
      ':l': `${newLevel}`,
    },
  });
};
