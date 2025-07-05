/**
 * Custom error types for the API
 */

/**
 * Thrown when a requested resource is not found
 */
export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Thrown when the user doesn't have permission for an action
 */
export class ForbiddenError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Thrown when an action cannot be completed due to a conflict
 */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Thrown when a request exceeds rate limits
 */
export class RateLimitError extends Error {
  constructor(message = 'Too many requests, please try again later') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Thrown when there's a problem with the external service
 */
export class ServiceUnavailableError extends Error {
  constructor(service: string) {
    super(`${service} service is currently unavailable`);
    this.name = 'ServiceUnavailableError';
  }
}
