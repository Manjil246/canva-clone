import AWS from "aws-sdk";

// Configure AWS S3
AWS.config.update({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
  region: import.meta.env.VITE_AWS_REGION,
  signatureVersion: "v4",
});

const s3 = new AWS.S3();

export const uploadImage = async (key, file) => {
  const bucketName = import.meta.env.VITE_BUCKET_NAME;
  const awsRegion = import.meta.env.VITE_AWS_REGION;

  if (!bucketName || !awsRegion) {
    throw new Error("AWS S3 configuration is incomplete.");
  }

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: file.type,
  };

  await s3.putObject(params).promise();

  return {
    key,
    url: `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`,
  };
};

export const getKeyForS3DesignerPage = (fileName) => {
  return `templates/${fileName}`;
};
