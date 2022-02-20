import aws from 'aws-sdk';
const isDev = Boolean(process.env.DEV);

if (!isDev) {
  aws.config.update({
    region: process.env.NEXT_AWS_REGION,
    accessKeyId: process.env.NEXT_DYNAMO_READ_KEY,
    secretAccessKey: process.env.NEXT_DYNAMO_READ_SECRET,
  });
}
