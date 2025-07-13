import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const spacesEndpoint = new AWS.Endpoint('blr1.digitaloceanspaces.com'); // change region if needed

export const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  region : process.env.DO_SPACES_REGION,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET
});
