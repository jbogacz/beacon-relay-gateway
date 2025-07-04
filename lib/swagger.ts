import { apiDocs } from '@/docs';

// Define the basic OpenAPI configuration
const apiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Beacon Relay Gateway API',
    version: '1.0.0',
    description: 'API for the Beacon Relay Gateway service',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : 'http://localhost:3000',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  tags: [
    {
      name: 'Hello',
      description: 'Hello World endpoints',
    },
    {
      name: 'Beacon',
      description: 'Beacon event endpoints',
    },
  ],
};

export const getApiDocs = () => {
  // Create the basic spec without using createSwaggerSpec
  const spec = {
    ...apiConfig,
    paths: apiDocs,
  };

  return spec;
};
