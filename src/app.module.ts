import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { AppMessageHandler } from './app.handler';
import 'dotenv/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaginHandlerModule } from './campagin-handler/campagin-handler.module';
import { CampaignHandlerService } from './campagin-handler/campagin-handler.service';

const sqs = new SQSClient({
  apiVersion: '2012-11-05',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_SQS_ENDPOINT,
  region: 'eu-west-2',
});

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: 'EmailGeneratorQueue',
          queueUrl: process.env.SQS_QUEUE_URL,
          sqs: sqs,
        },
      ],
      producers: [],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: 5432,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    CampaginHandlerModule,
  ],
  controllers: [],
  providers: [AppMessageHandler],
})
export class AppModule {}
