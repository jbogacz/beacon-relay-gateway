interface AppConfig {
  environment: 'development' | 'production' | any;
  apiBaseUrl: string;

  features: {
    enableLogging: boolean;
    enableMetrics: boolean;
  };
}

interface PubSubConfig {
  projectId: string;
  topicName: string;
  disablePublishing?: boolean; // Optional flag to disable publishing for local development
}
