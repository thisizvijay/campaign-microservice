import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3ConfigService {
  private static s3Client: S3Client;

  constructor(private configService: ConfigService) {
    if (!S3ConfigService.s3Client) {
      S3ConfigService.s3Client = new S3Client({
        region: process.env.AWS_S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        },
      });
    }
  }

  // getS3Config() {
  //   return new S3Client({
  //     region: process.env.AWS_S3_REGION ,
  //     credentials: {
  //       accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  //       secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  //     },
  //   });
  // }

  getS3Config() {
    return S3ConfigService.s3Client;
  }
  async uploadFile(
    bucketName: string,
    key: string,
    body: string | Buffer,
    contentType: string,
  ) {
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    try {
      const response = await S3ConfigService.s3Client.send(putObjectCommand);
      return response;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}
