# @my-org/types

Shared TypeScript type definitions for the monorepo.

## Installation

```bash
bun add @my-org/types
```

## Usage

```typescript
import type { User, ApiResponse, Status } from '@my-org/types';

const user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const response: ApiResponse<User> = {
  success: true,
  data: user,
};
```

## Available Types

- `User` - User entity interface
- `ApiResponse<T>` - Generic API response wrapper
- `Status` - Common status literals
- `Config` - Configuration options interface

## Building

```bash
bun run build
```
