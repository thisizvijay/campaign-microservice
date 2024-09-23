import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';

import { Campaign } from '../entities/campaign.entity';
import { Repository } from 'typeorm';
import { CampaignEmail } from '../entities/campaign-email.entity';
import { Discount } from '../entities/discount.entity';
import { ProductRecommendation } from '../entities/product-recommendation.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { compileMjml } from '../utils/html.util';
import { EmailService } from '../config/email.service';
import { S3ConfigService } from '../config/s3.service';

@Injectable()
export class CampaignHandlerService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(CampaignEmail)
    private readonly campaignEmailRepository: Repository<CampaignEmail>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(ProductRecommendation)
    private readonly productRecommendationRepository: Repository<ProductRecommendation>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    private readonly emailService: EmailService,
    private readonly s3ConfigService: S3ConfigService,
  ) {}

  async handleCampaignEmailFunctionality(
    campaignId: string,
    customerId: string,
  ): Promise<any> {
    console.log(`Processing campaign email for campaign ID ${campaignId} and customer ID ${customerId}`);
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
    });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const productRecommendations =
      await this.productRecommendationRepository.find({
        where: { customer: { id: customerId }, campaign: { id: campaignId } },
        relations: ['product'],
        order: { relevanceScore: 'DESC' },
        take: 3,
      });

    // Generate a unique discount code for the customer
    const discountCode = await this.generateAndHashDiscountCode(customerId);
    const discountData = {
      customer: customer,
      campaign: campaign,
      code: discountCode,
      usedDiscountAmount: 0,
      isUsed: false,
      startDate: new Date(),
      expireDate: this.getDiscountExpiryDate(10),
    };

    const discount = await this.discountRepository.save(discountData);

    // Fetch 10 random products from the database
    // Fetch 10 random products
    const products = await this.productRepository
      .createQueryBuilder('product')
      .orderBy('RANDOM()')
      .limit(10)
      .getMany();

    const recommedProducts = products.map((product) => {
      return this.productRecommendationRepository.create({
        customer,
        product,
        campaign,
        relevanceScore: Math.random() * 100, // Example relevance score
        category: product.category,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
    });

    await this.productRecommendationRepository.save(recommedProducts);

    // create email content and send email
    await this.getEmailContent(customer, campaign, discount);

    return {
      message: 'Campaign email sent successfully',
    };    

  }

  async getEmailContent(
    customer: Customer,
    campaign: Campaign,
    discount: Discount,
  ): Promise<any> {
    const products = await this.productRecommendationRepository.find({
      where: { customer: customer, campaign: campaign },
      relations: ['product'],
      order: { relevanceScore: 'DESC' },
      take: 3,
    });

    const subject = `${campaign.name} - Special Offer for You!`;

    const templatePath = path.resolve(
      __dirname,
      '../templates/birthday-campaign.html',
    );

    const orderLink = `http://www.r-ainbow.com/products/campaigns/${campaign.id}/customer/${customer.id}`;
    const templateData = {
      name: customer.firstName,
      year: new Date().getFullYear(),
      discountCode: discount.code,
      discountPercentage: campaign.discountPercentage,
      maxDiscountAmount: campaign.maxDiscountAmount,
      maxOrderAmount: campaign.minOrderAmount,
      orderLink: orderLink,
      recommendedProducts: products.map((prod: any) => {
        return {
          name: prod.name,
          description: prod.description,
          discountedPrice:
            prod.price - (prod.price * campaign.discountPercentage) / 100,
          price: prod.price,
          photoTemporaryUrl: prod.photoTemporaryUrl,
        };
      }),
    };
    const template = fs.readFileSync(templatePath, 'utf8');
    const emailContent = compileMjml(template, templateData);

    const campaignEmail = this.campaignEmailRepository.create({
      customer,
      campaign,
      discount,
      subject,
      emailContent,
    });
    await this.emailService.sendEmail(customer.email, subject, emailContent);

    campaignEmail.sentAt = new Date();
    campaignEmail.orderLink = orderLink;

    const savedCampaignEmail =
      await this.campaignEmailRepository.save(campaignEmail);
  }

  private async generateAndHashDiscountCode(customerId: string) {
    // Generate a unique discount code using cryto module in 12 charactors for the customer and hash it
    const randomBytes = crypto.randomBytes(6); // 6 bytes will give us 12 characters in hex
    const discountCode = randomBytes.toString('hex').toUpperCase();

    // Hash the discount code using bcrypt
    const saltRounds = process.env.BCRYPT_SALT;
    const hashedDiscountCode = await bcrypt.hash(
      discountCode + customerId,
      saltRounds,
    );

    // Return both the original discount code (for customer use) and the hash (for storage)
    return hashedDiscountCode;
  }

  private getDiscountExpiryDate(days: number): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }
}
