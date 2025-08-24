// src/utils/retry.ts

type RetryOptions = {
	maxRetries?: number;
	sleepTime?: number;
	raisesOnException?: boolean;
	nonRetryExceptions?: Array<new (...args: unknown[]) => Error>;
};

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retryAsync<T, A extends unknown[] = unknown[]>(
	options: RetryOptions = {},
) {
	const {
		maxRetries = 3,
		sleepTime = 0,
		raisesOnException = true,
		nonRetryExceptions = [],
	} = options;

	return (fn: (...args: A) => Promise<T>) =>
		async (...args: A): Promise<T | undefined> => {
			for (let i = 0; i < maxRetries; i++) {
				try {
					return await fn(...args);
				} catch (e) {
					const isNonRetry =
						nonRetryExceptions.length > 0 &&
						nonRetryExceptions.some((ErrType) => e instanceof ErrType);

					if (i === maxRetries - 1 || isNonRetry) {
						if (raisesOnException) {
							throw e;
						} else {
							return undefined;
						}
					}
					if (sleepTime > 0) {
						await sleep(sleepTime * 1000);
					}
				}
			}
			// Should not reach here
			throw new Error("Retry logic failed unexpectedly.");
		};
}
