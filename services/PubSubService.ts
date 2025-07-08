import { z } from 'zod';
import { BeaconEventSchema } from '@/schemas/beacon';

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

    // In a real implementation, this would set up the client
    // e.g., this.client = new PubSubClient(config)

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

      // In a real implementation, this would publish to the actual service
      // e.g., return await this.client.publish(this.topicName, event)

      // For now, just log and return a mock message ID
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Log beacon details
      console.log({
        messageId,
        eventType: event.type,
        subjectId: event.subjectId,
        beaconId: {
          uuid: event.beacon.uuid,
          major: event.beacon.major,
          minor: event.beacon.minor,
        },
        signalStrength: event.beacon.signalStrength,
        timestamp: event.timestamp,
      });

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
