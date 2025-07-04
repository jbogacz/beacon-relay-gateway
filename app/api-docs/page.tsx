'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

// Define our own SwaggerUI props type
type SwaggerUIProps = {
  url?: string;
  spec?: any;
  docExpansion?: 'list' | 'full' | 'none';
  defaultModelsExpandDepth?: number;
  supportedSubmitMethods?: Array<'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'>;
  tryItOutEnabled?: boolean;
  [key: string]: any;
};

// Workaround for Swagger UI's use of deprecated React lifecycle methods
// This wrapper suppresses the console warnings
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('Suppressing error:', error);
  }

  render() {
    return this.props.children;
  }
}

// Dynamic import with a custom component to suppress the warnings
const SwaggerUI = dynamic<SwaggerUIProps>(() => import('swagger-ui-react').then(mod => mod.default), { ssr: false });

export default function ApiDocsPage() {
  const [isClient, setIsClient] = useState(false);
  const [originalConsoleError, setOriginalConsoleError] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);

    // Suppress specific React lifecycle warnings
    const originalError = console.error;
    setOriginalConsoleError(originalError);

    console.error = (...args: any[]) => {
      // Filter out the specific warning about UNSAFE lifecycle methods
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') || args[0].includes('componentWillReceiveProps'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    // Add Swagger UI CSS via CDN
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/swagger-ui-react@5.26.0/swagger-ui.css';
    document.head.appendChild(linkElement);

    return () => {
      // Restore original console.error
      if (originalConsoleError) {
        console.error = originalConsoleError;
      }

      if (document.head.contains(linkElement)) {
        document.head.removeChild(linkElement);
      }
    };
  }, []);

  if (!isClient) {
    return <div>Loading API documentation...</div>;
  }

  return (
    <div className="swagger-container">
      <SwaggerUI
        url="/api/swagger.json"
        docExpansion="list"
        defaultModelsExpandDepth={-1} // Hide schemas section by default
        supportedSubmitMethods={
          ['get', 'post', 'put', 'delete', 'patch'] as Array<'get' | 'put' | 'post' | 'delete' | 'patch'>
        }
        tryItOutEnabled={true}
      />
    </div>
  );
}
