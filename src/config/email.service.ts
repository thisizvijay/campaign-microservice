import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host:"smtp.gmail.com",
      port: 465,  
      secure: true,
      auth: {
        user: process.env.EMAIL_FROM_USER_MAIL,
        pass: process.env.EMAIL_FROM_USER_APP_PASSWORD
      }
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM_USER_MAIL,
      to,
      subject,
      html
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}