/**
 * Application configuration settings
 */

/**
 * PubSub service configuration
 */
export const pubSubConfig = {
  projectId: process.env.PUBSUB_PROJECT_ID || 'beacon-relay',
  topicName: process.env.PUBSUB_TOPIC_NAME || 'dev.beacons.presence.entered',

  // Set to true to disable publishing to PubSub (for local development)
  disablePublishing: process.env.DISABLE_PUBSUB === 'true',
};

/**
 * General application configuration
 */
export const appConfig = {
  environment: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',

  // Feature flags
  features: {
    enableLogging: process.env.ENABLE_LOGGING !== 'false',
    enableMetrics: process.env.ENABLE_METRICS === 'true',
  },
};
