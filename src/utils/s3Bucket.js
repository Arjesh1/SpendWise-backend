import S3 from 'aws-sdk/clients/s3.js';
import "dotenv/config";
import fs from "fs";

const uploadFile = (file) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY;
  const secretKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    endpoint: process.env.AWS_ENDPOINT,
    apiVersion: process.env.AWS_API_VERSION,
  });

  try {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };

    return s3.upload(uploadParams).promise();
  } catch (error) {
    console.log(error);
  }
};

export default uploadFile;