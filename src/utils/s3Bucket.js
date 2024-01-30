import S3 from 'aws-sdk/clients/s3.js';
import "dotenv/config";
import { StatusCodes } from 'http-status-codes';

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

const uploadFile = (key) => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('uploadImage', {
      Bucket: bucketName,
      ContentType: 'image/jpeg',
      Key: key
    }, (err, url) => {
      if (err) {
        console.error('Error generating pre-signed URL:', err);
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

export default uploadFile;