import aws from 'aws-sdk';
import { isProd } from './constants';

if (isProd) {
  aws.config.update({
    region: process.env.NEXT_AWS_REGION,
    accessKeyId: process.env.NEXT_DYNAMO_READ_KEY,
    secretAccessKey: process.env.NEXT_DYNAMO_READ_SECRET,
  });
}
