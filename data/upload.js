const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const TableName = process.env.AWS_USERS_TABLE;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  params: { TableName },
});

(async () => {
  const files = fs.readdirSync(path.resolve(__dirname, 'db'));

  for (const file of files) {
    const tableData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db', file), 'utf8'));
    console.log(`Uploading ${file}...`);

    for (const [dataId, data] of tableData.entries()) {
      const cardId = 10000 + Number(dataId);
      const params = {
        TableName,
        Item: {
          id: String(cardId),
          type: 'card',
          ...data,
        },
      };

      try {
        await dynamoDb.put(params).promise();
      } catch (error) {
        console.error('failed to put', data.en);
        console.error(error);
        process.exit(1);
      }
    }
  }
})();
