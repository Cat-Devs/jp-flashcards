import { getDbClient } from './dynamo-db';

export const bumpUserLevel = async (userHash: string) => {
  const accessKeyId = process.env.NEXT_DYNAMO_WRITE_KEY;
  const secretAccessKey = process.env.NEXT_DYNAMO_WRITE_SECRET;
  const client = getDbClient(accessKeyId, secretAccessKey);
  const data = await client.get({
    Key: {
      id: userHash,
    },
  });

  if (!data?.Item?.current_level) {
    throw new Error('Cannot get current user level');
  }

  const newLevel = `${Number(data.Item.current_level) + 1}`;

  try {
    await client.update({
      Key: {
        id: userHash,
      },
      UpdateExpression: 'set #l = :l',
      ExpressionAttributeNames: {
        '#l': 'current_level',
      },
      ExpressionAttributeValues: {
        ':l': `${newLevel}`,
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
