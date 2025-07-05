'use client';

import SwaggerUIWrapper from '@/components/SwaggerUIWrapper';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect } from 'react';

export default function ApiDocsPage() {
  // Add CSS directly in the component to ensure it's loaded when needed
  useEffect(() => {
    // Add any additional CSS or setup here
  }, []);

  return <SwaggerUIWrapper url="/api/docs" />;
}
