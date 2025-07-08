# Services

This directory contains service classes that handle business logic and external integrations for the Beacon Relay Gateway application.

## PubSubService

The `PubSubService` is responsible for publishing beacon events to external messaging systems. It follows the Singleton pattern to ensure a single instance is used throughout the application.

### Usage

```typescript
import { pubSubService } from '@/services/PubSubService';
import { pubSubConfig } from '@/lib/config';

// Initialize the service
pubSubService.initialize(pubSubConfig);

// Publish an event
const messageId = await pubSubService.publishEvent(beaconEvent);

// Publish multiple events
const messageIds = await pubSubService.publishEventBatch(beaconEvents);
```

### Configuration

Configure the service using environment variables:

- `PUBSUB_PROJECT_ID`: The cloud project ID (defaults to 'beacon-relay-project')
- `PUBSUB_TOPIC_NAME`: The topic name to publish to (defaults to 'beacon-events')
- `DISABLE_PUBSUB`: Set to 'true' to disable actual publishing (for development/testing)

## Implementation Notes

The current implementation is a placeholder that logs events instead of sending them to an actual messaging service. To implement a specific provider:

### For Google Cloud Pub/Sub:

1. Install the client library:

   ```
   npm install @google-cloud/pubsub
   ```

2. Update `PubSubService.ts` to use the client:

   ```typescript
   import { PubSub } from '@google-cloud/pubsub';

   // In the PubSubService class:
   private client: PubSub;

   public initialize(config): void {
     this.client = new PubSub({ projectId: config.projectId });
     // ...
   }

   public async publishEvent(event): Promise<string> {
     const dataBuffer = Buffer.from(JSON.stringify(event));
     const messageId = await this.client.topic(this.topicName).publish(dataBuffer);
     return messageId;
   }
   ```

### For AWS SNS:

1. Install the client library:

   ```
   npm install @aws-sdk/client-sns
   ```

2. Update the service implementation accordingly.
