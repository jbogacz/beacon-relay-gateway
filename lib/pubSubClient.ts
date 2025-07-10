import { z } from 'zod';
import { BeaconEventSchema } from '@/schemas/beacon';
import { PubSub } from '@google-cloud/pubsub';

// Define types from schemas
type BeaconEvent = z.infer<typeof BeaconEventSchema>;

/**
 * PubSubService - A service for publishing beacon events to external systems
 *
 * This service is responsible for broadcasting beacon events to configured
 * destinations such as Google Cloud Pub/Sub, AWS SNS/SQS, or a custom webhook.
 */
export class PubSubService {
  private static instance: PubSubService;
  private isInitialized: boolean = false;

  // Configuration
  private projectId?: string;
  private topicName?: string;
  private client?: PubSub;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance of PubSubService
   */
  public static getInstance(): PubSubService {
    if (!PubSubService.instance) {
      PubSubService.instance = new PubSubService();
    }
    return PubSubService.instance;
  }

  /**
   * Initialize the PubSub service with configuration
   *
   * @param config Configuration options for the service
   */
  public initialize(config: { projectId: string; topicName: string; disablePublishing?: boolean }): void {
    if (this.isInitialized) {
      console.warn('PubSubService is already initialized');
      return;
    }

    this.projectId = config.projectId;
    this.topicName = config.topicName;

    if (!this.isInitialized) {
      this.client = new PubSub({
        projectId: this.projectId,
      });
    }

    const mode = config.disablePublishing ? '(DISABLED MODE)' : '(ACTIVE MODE)';
    console.log(`PubSubService initialized ${mode} with project ${this.projectId} and topic ${this.topicName}`);
    this.isInitialized = true;
  }

  /**
   * Publish a beacon event to the configured topic
   *
   * @param event The beacon event to publish
   * @returns Promise resolving to the message ID if successful
   */
  public async publishEvent(event: BeaconEvent): Promise<string> {
    this.ensureInitialized();

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

  /**
   * Publish multiple beacon events in batch
   *
   * @param events Array of beacon events to publish
   * @returns Promise resolving to an array of message IDs
   */
  public async publishEventBatch(events: BeaconEvent[]): Promise<string[]> {
    this.ensureInitialized();

    try {
      console.log(`Publishing batch of ${events.length} events`);

      // Process each event individually for now
      // In a real implementation, this might use a batch API
      const messageIds = await Promise.all(events.map((event) => this.publishEvent(event)));

      return messageIds;
    } catch (error) {
      console.error('Failed to publish event batch:', error);
      throw new Error('Failed to publish event batch to pub/sub service');
    }
  }

  /**
   * Check if the service is ready to publish
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Ensure the service is initialized before use
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('PubSubService must be initialized before use');
    }
  }
}

// Export a singleton instance
export const pubSubService = PubSubService.getInstance();
