'use client';

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="api-docs-layout">
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .api-docs-header {
          background-color: #1f2937;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #374151;
        }

        .api-docs-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .swagger-ui .topbar {
          display: none !important;
        }

        .swagger-ui .info .title {
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .swagger-ui .opblock-tag {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-weight: 600;
        }

        .swagger-ui button.opblock-control-arrow {
          padding: 4px;
        }

        .swagger-container {
          margin-top: 1rem;
          padding: 0 2rem;
        }
      `}</style>

      <div className="api-docs-header">
        <h1>Beacon Relay Gateway API</h1>
        <span>API Documentation</span>
      </div>

      {children}
    </div>
  );
}
