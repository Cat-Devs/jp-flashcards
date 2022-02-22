const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const TableName = process.env.AWS_USERS_TABLE;

function padLeft(input, outputLength) {
  return Array(outputLength - String(input).length + 1).join('0') + input;
}

(async () => {
  const argv = yargs
    .option('category', {
      year: {
        description: 'Upload a single category file',
        alias: 'y',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    params: { TableName },
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const files = fs.readdirSync(path.resolve(__dirname, 'db'));

  for (const [fileId, file] of files.entries()) {
    const tableData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db', file), 'utf8'));

    if (argv.category && `${argv.category}.json` === file) {
      console.log(`Uploading ${file}...`);
      for (const data of tableData) {
        const cardId = `1${padLeft(String(fileId + 1), 2)}${padLeft(String(data.id), 3)}`;
        const params = {
          TableName,
          Item: {
            ...data,
            id: String(cardId),
            type: 'card',
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
  }
})();
