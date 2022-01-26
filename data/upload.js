const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const startId = process.env.START_ID;

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  params: {
    TableName: process.env.AWS_USERS_TABLE,
  },
});

const put = (params) => dynamoDb.put(params).promise();

(async () => {
  const tableData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "table-data.json"), "utf8")
  );

  console.log("Creating data...");

  for (const [index, data] of tableData.entries()) {
    const itemId = `${Number(startId) + Number(index)}`;

    const params = {
      Item: { id: itemId, ...data },
    };

    try {
      put(params).catch(() => {
        throw new Error(`Unable to add ${data.title}`);
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
})();
