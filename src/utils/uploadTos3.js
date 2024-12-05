// import AWS from "aws-sdk";

// // Configure AWS S3
// AWS.config.update({
//   accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//   secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
//   region: import.meta.env.VITE_AWS_REGION,
//   signatureVersion: "v4",
// });
// const s3 = new AWS.S3();

// export const uploadImage = async (key, file) => {
//   const bucketName = import.meta.env.VITE_BUCKET_NAME;
//   const awsRegion = import.meta.env.VITE_AWS_REGION;

//   if (!bucketName || !awsRegion) {
//     throw new Error("AWS S3 configuration is incomplete.");
//   }

//   const params = {
//     Bucket: bucketName,
//     Key: key,
//     Body: file,
//     ContentType: file.type,
//   };

//   const response = await s3.putObject(params).promise();
//   console.log("S3 upload response:", response);

//   return {
//     key,
//     url: `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`,
//   };
// };

// export const getKeyForS3DesignerPage = (fileName) => {
//   return `templates/${fileName}`;
// };

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
  },
});

export const uploadImage = async (key, file) => {
  const bucketName = import.meta.env.VITE_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS S3 configuration is incomplete.");
  }

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    console.log("S3 upload response:", response);

    return {
      key,
      url: `https://${bucketName}.s3.${
        import.meta.env.VITE_AWS_REGION
      }.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
};

export const getKeyForS3DesignerPage = (fileName) => {
  return `templates/${fileName}`;
};
