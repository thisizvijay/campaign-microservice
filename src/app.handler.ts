import { Message } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { CampaignHandlerService } from './campagin-handler/campagin-handler.service';

@Injectable()
export class AppMessageHandler {
  constructor(
    private readonly campaignHandlerService: CampaignHandlerService,
  ) {}

  @SqsMessageHandler(/** name: */ 'EmailGeneratorQueue', /** batch: */ false)
  public async handleMessage(message: Message) {
    //Get the message body and process it and send campaign handler service
    const messageBody = message.Body;
    if (!messageBody) {
      console.error('Message body is empty');
      return;
    }

    try {
      // Process the message body (e.g., parse JSON)
      const data = JSON.parse(messageBody);

      // Send the processed data to the campaign handler service
      await this.campaignHandlerService.handleCampaignEmailFunctionality(
        data.campaignId,
        data.customerId,
      );
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  @SqsConsumerEventHandler(
    /** name: */ 'EmailGeneratorQueue',
    /** eventName: */ 'processing_error',
  )
  public onProcessingError(error: Error, message: Message) {
    // report errors here
    console.error(error);
    console.log(message);
  }
}
