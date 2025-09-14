// src/types/retry.ts

export type RetryOptions = {
	maxRetries?: number;
	sleepTime?: number;
	raisesOnException?: boolean;
	nonRetryExceptions?: Array<new (...args: unknown[]) => Error>;
};
