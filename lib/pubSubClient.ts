import { z } from 'zod';
import { BeaconEventSchema } from '@/schemas/beacon';
import { PubSub } from '@google-cloud/pubsub';
import { pubSubConfig } from './config';

type BeaconEvent = z.infer<typeof BeaconEventSchema>;

export class PubSubClient {
  private static instance: PubSubClient;

  private projectId?: string;
  private topicName?: string;
  private client?: any;

  private constructor(pubSubConfig: PubSubConfig) {
    this.projectId = pubSubConfig.projectId;
    this.topicName = pubSubConfig.topicName;
    this.client = new PubSub({
      projectId: this.projectId,
    });
  }

  public static getInstance(): PubSubClient {
    if (!PubSubClient.instance) {
      PubSubClient.instance = new PubSubClient(pubSubConfig);
    }
    return PubSubClient.instance;
  }

  public async publishEvent(event: BeaconEvent): Promise<string> {
    try {
      console.log(`Publishing ${event.type} event for subject ${event.subjectId} with beacon ${event.beacon.uuid}`);

      const dataBuffer = Buffer.from(JSON.stringify(event));
      const messageId = await this.client!.topic(this.topicName!).publish(dataBuffer);
      console.log(`Event published successfully with message ID: ${messageId}`);

      return messageId;
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw new Error('Failed to publish event to pub/sub service');
    }
  }
}

export const pubSubClient = PubSubClient.getInstance();
