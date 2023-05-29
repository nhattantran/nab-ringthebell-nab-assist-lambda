import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

export async function getObject<T>(bucket: string, key: string): Promise<T> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return (await s3Client.send(command)) as T;
}