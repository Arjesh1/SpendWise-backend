import S3 from 'aws-sdk/clients/s3.js';
import "dotenv/config";

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;
const endpoint = process.env.AWS_ENDPOINT;

const s3 = new S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: region,
  endpoint: endpoint

});

const uploadFile = async (image, folderName, key) => {

  const uploadParams = {
    Bucket: bucketName,
    Key: `${folderName}/${key}`,
    Body: image.buffer,
    ContentType: image.mimetype,
  };

  const s3Data = await s3.upload(uploadParams).promise();
   return s3Data.Location
};

export default uploadFile;