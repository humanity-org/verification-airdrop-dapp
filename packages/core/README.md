# @my-org/core

Core business logic and utilities for the monorepo.

## Installation

```bash
bun add @my-org/core
```

## Usage

```typescript
import { fetchData, delay, retryWithBackoff, defaultConfig } from '@my-org/core';
import type { User } from '@my-org/types';

// Fetch data from an API
const response = await fetchData<User>('/users/1');

if (response.success) {
  console.log('User:', response.data);
} else {
  console.error('Error:', response.error);
}

// Delay execution
await delay(1000);

// Retry with exponential backoff
const result = await retryWithBackoff(async () => {
  return await fetchData<User>('/users/1');
}, 3, 1000);
```

## API

### `fetchData<T>(endpoint, config?)`

Fetches data from an API endpoint with configurable timeout and retries.

### `delay(ms)`

Delays execution for a specified time in milliseconds.

### `retryWithBackoff<T>(fn, maxRetries?, baseDelay?)`

Retries an async function with exponential backoff strategy.

### `defaultConfig`

Default configuration object for API calls.

## Building

```bash
bun run build
```

## Testing

```bash
bun test
```
