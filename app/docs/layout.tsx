'use client';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-layout">
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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

        .docs-header {
          background-color: #1f2937;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #374151;
        }

        .docs-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
      `}</style>

      <div className="docs-header">
        <h1>Beacon Relay Gateway API</h1>
        <span>API Documentation</span>
      </div>

      {children}
    </div>
  );
}
