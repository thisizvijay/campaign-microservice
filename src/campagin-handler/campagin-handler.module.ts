import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { S3ConfigService } from '../config/s3.service';
import { CampaignEmail } from '../entities/campaign-email.entity';
import { Campaign } from '../entities/campaign.entity';
import { Customer } from '../entities/customer.entity';
import { Discount } from '../entities/discount.entity';
import { ProductRecommendation } from '../entities/product-recommendation.entity';
import { Product } from '../entities/product.entity';
import { CampaignHandlerService } from './campagin-handler.service';
import { EmailService } from '../config/email.service';
import { ImagesLinksTracker } from '../entities/images-links-tracker.entity';

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
      ImagesLinksTracker,
    ]),
  ],
  providers: [CampaignHandlerService, S3ConfigService, EmailService],
  exports: [CampaignHandlerService],
})
export class CampaginHandlerModule {}
