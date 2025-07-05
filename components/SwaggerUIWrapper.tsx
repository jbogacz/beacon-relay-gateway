'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Define a type for the props we'll pass to SwaggerUI
type SwaggerUIWrapperProps = {
  url: string;
  docExpansion?: 'list' | 'full' | 'none';
  defaultModelsExpandDepth?: number;
};

// Create a component that suppresses warnings
const SwaggerUIWrapper: React.FC<SwaggerUIWrapperProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  // Dynamically import the SwaggerUI component to prevent SSR issues
  const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
  });

  useEffect(() => {
    setIsClient(true);

    // Suppress warnings about unsafe lifecycle methods
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && (args[0].includes('UNSAFE_') || args[0].includes('componentWill'))) {
        // Ignore this specific warning
        return;
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  if (!isClient) {
    return <div>Loading API documentation...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <SwaggerUI
        {...props}
        docExpansion={props.docExpansion || 'list'}
        defaultModelsExpandDepth={props.defaultModelsExpandDepth || -1}
        supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch'] as any[]}
        tryItOutEnabled={true}
      />
    </div>
  );
};

export default SwaggerUIWrapper;
