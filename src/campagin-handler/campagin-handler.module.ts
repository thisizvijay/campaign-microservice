import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { S3ConfigService } from 'src/config/s3.service';
import { CampaignEmail } from 'src/entities/campaign-email.entity';
import { Campaign } from 'src/entities/campaign.entity';
import { Customer } from 'src/entities/customer.entity';
import { Discount } from 'src/entities/discount.entity';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { Product } from 'src/entities/product.entity';
import { CampaignHandlerService } from './campagin-handler.service';
import { EmailService } from '../config/email.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Product,
      ProductRecommendation,
      Customer,
      Campaign,
      CampaignEmail,
      Discount,
    ]),
  ],
  providers: [CampaignHandlerService, S3ConfigService, EmailService],
  exports: [CampaignHandlerService],
})
export class CampaginHandlerModule {}
