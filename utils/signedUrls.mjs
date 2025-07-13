import { s3 } from './doSpacesClient.mjs';

export const generateSignedUrl = (key, expiresInSeconds = 300) => {
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: key,
    Expires: expiresInSeconds,
    ResponseContentDisposition: 'inline', // for view
  };

  return s3.getSignedUrl('getObject', params);
};

export const generateDownloadUrl = (key, filename, expiresInSeconds = 300) => {
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: key,
    Expires: expiresInSeconds,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  };

  return s3.getSignedUrl('getObject', params);
};
