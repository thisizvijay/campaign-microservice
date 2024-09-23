import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3ConfigService {
  constructor(private configService: ConfigService) {}

  getS3Config() {
    return new S3Client({
      region: process.env.AWS_S3_REGION ,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
  }
}
