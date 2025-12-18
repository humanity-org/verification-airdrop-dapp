# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Verification Airdrop dApp** - A decentralized application for airdrop verification and distribution built on Web3 technologies. This is a modern TypeScript monorepo using Bun workspaces, featuring a React web application with Vite, Web3 wallet integration via RainbowKit/Wagmi, and shared packages for types and core utilities. The project uses Zustand for state management and follows strict TypeScript practices.

### Core Business

- **Airdrop Verification**: Verify user eligibility for token airdrops
- **Token Distribution**: Facilitate on-chain token distribution
- **Wallet Integration**: Connect with various Web3 wallets (MetaMask, WalletConnect, etc.)
- **Transaction Management**: Handle blockchain transactions and status tracking

## Architecture

### Monorepo Structure

```
verification-airdrop-dapp/
├── packages/                  # Shared packages
│   ├── types/                # @hp/types - Shared TypeScript type definitions
│   └── core/                 # @hp/core - Core business logic and utilities
├── apps/                     # Applications
│   └── web/                  # @hp/web - Web application
│       ├── src/
│       │   ├── components/  # React components (Toast, StatusRow, AIAssistant)
│       │   ├── contracts/   # Smart contract interfaces (Airdrop, ERC20)
│       │   ├── abis/        # Contract ABIs
│       │   ├── stores/      # Zustand stores (airdropStore)
│       │   ├── config/      # Web3 configuration (Wagmi, RainbowKit)
│       │   ├── types/       # App-specific TypeScript types
│       │   ├── hooks/       # Custom React hooks
│       │   └── utils/       # Utility functions
│       └── vite.config.ts   # Vite configuration
└── docs/                     # Documentation
```

### Build System

This project uses **Turborepo** for high-performance build orchestration:

- **Intelligent Caching**: Turborepo caches build outputs and skips rebuilding unchanged packages
- **Parallel Execution**: Tasks run in parallel when possible, respecting dependency order
- **Task Pipeline**: Configured in `turbo.json` with proper dependency chains
- **Remote Caching**: Can be enabled for team-wide cache sharing (optional)

### Package Dependencies

- **@hp/web** depends on **@hp/core** and **@hp/types**
- **@hp/core** depends on **@hp/types**
- All packages use TypeScript project references for fast, incremental builds
- Turborepo automatically handles the build order: `types → core → web`

### Technology Stack

#### Frontend Core
- **React 18** - UI framework
- **TypeScript 5.3+** - Type safety with strict mode
- **Vite 5** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library

#### Web3 Stack
- **Wagmi v3** - React hooks for Ethereum
- **Viem v2** - TypeScript interface for Ethereum
- **RainbowKit v2** - Wallet connection UI
- **TanStack Query v5** - Async state management for blockchain data

#### State Management
- **Zustand** - Primary state management solution
- **TanStack Query** - Server/blockchain state management

### State Management Architecture

**CRITICAL:** All state management MUST be implemented using Zustand:

- **Never use React.useState** for global or shared state
- **Never use React.useContext** for state management
- **Always use Zustand stores** located in `apps/web/src/stores/`
- **Blockchain state**: Use TanStack Query hooks from Wagmi
- Store pattern examples:
  - `apps/web/src/stores/counterStore.ts` - Basic store
  - `apps/web/src/stores/airdropStore.ts` - Airdrop business logic

Zustand store template:
```typescript
import { create } from 'zustand';

interface MyState {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

### Web3 Configuration

#### Wallet Integration (RainbowKit)
- Configuration file: `apps/web/src/config/wagmi.ts`
- Theme customization: `apps/web/src/config/rainbowkit-theme.ts`
- Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more

#### Smart Contract Integration
- **Contract abstractions**: Located in `apps/web/src/contracts/`
- **ABIs**: Located in `apps/web/src/abis/`
- **Base contract class**: `BaseContract.ts` - Common contract interaction patterns
- **Contract types**:
  - `AirdropContract.ts` - Airdrop distribution logic
  - `ERC20Contract.ts` - Token operations
  - `mock/MockAirdropContract.ts` - Testing and development

#### Contract Interaction Pattern
```typescript
// Example: Using AirdropContract
import { useAirdropContract } from '@/contracts/factory';
import { useAccount } from 'wagmi';

const { address } = useAccount();
const contract = useAirdropContract(address);

// Check eligibility
const isEligible = await contract.isEligible(userAddress);

// Claim airdrop
const tx = await contract.claim();
```

### Path Aliases

The web app uses the following path aliases (configured in `vite.config.ts`):
- `@/` → `apps/web/src/`
- `@hp/types` → `packages/types/src`
- `@hp/core` → `packages/core/src`

Use these aliases consistently in import statements.

### TypeScript Configuration

- **Strict mode enabled** with aggressive type checking
- **Project references** for efficient incremental builds
- Key strict options:
  - `strict: true`
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
  - `noImplicitReturns: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`

## Development Commands

### Essential Commands

All commands are orchestrated by Turborepo for optimal performance:

```bash
# Install dependencies
bun install

# Development (starts web app on port 3000)
# Turborepo runs dev tasks in parallel where possible
bun run dev

# Build all packages and apps
# Turborepo builds in dependency order: types → core → web
# Cached builds are skipped automatically
bun run build

# Run tests (with caching)
bun run test

# Type checking (with caching)
bun run type-check

# Linting (with caching)
bun run lint

# Code formatting (with caching)
bun run format

# Clean all build outputs
bun run clean
```

### Working with Specific Packages

Turborepo automatically handles dependencies when filtering:

```bash
# Build specific package (and its dependencies)
turbo run build --filter=@hp/web

# Run dev for specific package
turbo run dev --filter=@hp/web

# Build package without dependencies
turbo run build --filter=@hp/core --no-deps
```

### Turborepo Performance Tips

- **First build**: Will take normal time as cache is being built
- **Subsequent builds**: Unchanged packages are skipped (instant)
- **Parallel execution**: Multiple packages build simultaneously
- **Cache location**: `.turbo/cache/` (add to `.gitignore`)
- **Force rebuild**: Use `--force` flag to bypass cache

## Code Quality Rules

### TypeScript

1. **Never use `any`** - ESLint will error on `@typescript-eslint/no-explicit-any`
2. **Prefer `unknown` over `any`** when type is truly unknown
3. **Use type-safe patterns** like discriminated unions for API responses
4. **Unused variables** should be prefixed with `_` to avoid warnings
5. **Blockchain addresses**: Always use Viem's `Address` type (`0x${string}`)
6. **BigInt for token amounts**: Use `bigint` type for all token amounts and wei values

### Web3 Development

1. **Error Handling**: Always handle transaction rejections and network errors
2. **Gas Estimation**: Use Wagmi's built-in gas estimation before transactions
3. **Transaction Status**: Track transaction status (pending, success, failure)
4. **User Feedback**: Show clear loading states and transaction confirmations
5. **Wallet State**: Handle wallet disconnection and network switching gracefully
6. **Contract Types**: Use strongly typed contracts with ABIs

### React

1. **Keep components under 200 lines** - extract subcomponents if needed
2. **Use functional components only** - no class components
3. **Custom hooks** should start with `use` prefix
4. **Component file structure**:
   - Import statements (external → internal)
   - Type definitions
   - Component logic
   - Helper functions
   - Export statement

### Zustand State Management

1. **All global state MUST use Zustand stores**
2. **Store files** located in `apps/web/src/stores/`
3. **Never mix state management approaches** (no Context API, no React.useState for shared state)
4. **State updates** should be immutable
5. **Complex state logic** should be encapsulated in store actions

### Component Organization

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── stores/          # Zustand stores (state management)
├── types/           # App-specific type definitions
└── utils/           # Utility functions
```

## Verification Requirements

### After Implementing Features or Bug Fixes

**MANDATORY:** All feature implementations and bug fixes MUST be verified using Chrome DevTools:

1. **Manual Testing**:
   - Open Chrome DevTools (F12)
   - Test the implemented feature thoroughly
   - Check Console for errors
   - Verify Network requests if applicable
   - Test responsive behavior

2. **Acceptance Criteria**:
   - No console errors or warnings
   - Feature works as specified
   - UI is visually correct and beautiful
   - Performance is acceptable (check Performance tab if needed)

3. **State Management Verification**:
   - Use React DevTools to inspect Zustand store state
   - Verify state updates correctly
   - Check for unnecessary re-renders

### Build Verification

Before considering work complete:

```bash
# Type check must pass
bun run type-check

# Linting must pass
bun run lint

# Production build must succeed
bun run build
```

## UI/UX Standards

### Design Principles

1. **Visual Excellence**: All UI implementations must be beautiful and polished
2. **Consistent Spacing**: Use consistent padding and margins
3. **Color Harmony**: Use a cohesive color palette
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Ensure semantic HTML and keyboard navigation

### Component Standards

- Use semantic HTML elements
- Provide meaningful `aria-label` attributes where needed
- Ensure proper contrast ratios
- Support keyboard navigation
- Use loading states and error handling

### Error Messages and User Interaction

**MANDATORY:** All error messages and user interactions must be clear, friendly, and intuitive:

1. **Error Messages**:
   - **Clear and Specific**: Describe what went wrong in plain language
   - **Actionable**: Always provide guidance on how to fix the issue
   - **Friendly Tone**: Avoid technical jargon and blame language
   - **Examples**:
     - ✅ Good: "We couldn't connect to the server. Please check your internet connection and try again."
     - ❌ Bad: "Error: Network request failed with status 500"
     - ✅ Good: "Please enter a valid email address (example: user@example.com)"
     - ❌ Bad: "Invalid input format"

2. **User Feedback**:
   - **Immediate Response**: Show loading states for async operations
   - **Success Confirmation**: Clearly indicate when actions succeed
   - **Visual Indicators**: Use appropriate colors (green for success, red for errors, yellow for warnings)
   - **Non-blocking**: Use toasts for non-critical messages, modals only for critical confirmations

3. **Interaction Design**:
   - **Intuitive Controls**: Buttons and inputs should be self-explanatory
   - **Clear Labels**: All form fields must have descriptive labels
   - **Helpful Placeholders**: Provide examples in input placeholders
   - **Confirmation Dialogs**: Ask for confirmation before destructive actions
   - **Progress Indicators**: Show progress for multi-step processes

4. **Error Recovery**:
   - **Graceful Degradation**: App should remain functional even when features fail
   - **Retry Mechanisms**: Provide easy retry options for failed operations
   - **Preserve User Input**: Don't lose user data on errors
   - **Clear Next Steps**: Guide users on alternative actions when operations fail

## Package Development Guidelines

### Adding New Shared Types (@hp/types)

1. Define interfaces/types in `packages/types/src/index.ts`
2. Export with JSDoc comments
3. Rebuild the types package: `bun run --filter ./packages/types build`

### Adding Core Utilities (@hp/core)

1. Implement functions in `packages/core/src/index.ts`
2. Use types from `@hp/types`
3. Write JSDoc documentation
4. Consider error handling and edge cases
5. Export the function

## Common Patterns

### Web3 Wallet Connection

```typescript
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function WalletButton() {
  const { address, isConnected } = useAccount();

  return (
    <ConnectButton
      chainStatus="icon"
      accountStatus="address"
      showBalance={false}
    />
  );
}
```

### Smart Contract Read Operations

```typescript
import { useReadContract } from 'wagmi';
import { AIRDROP_ABI } from '@/abis/Airdrop';

function AirdropStatus() {
  const { data: isEligible, isLoading, error } = useReadContract({
    address: '0x...',
    abi: AIRDROP_ABI,
    functionName: 'isEligible',
    args: [userAddress],
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{isEligible ? 'Eligible' : 'Not Eligible'}</div>;
}
```

### Smart Contract Write Operations

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AIRDROP_ABI } from '@/abis/Airdrop';

function ClaimAirdrop() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaim = async () => {
    try {
      await writeContract({
        address: '0x...',
        abi: AIRDROP_ABI,
        functionName: 'claim',
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <button onClick={handleClaim} disabled={isPending || isConfirming}>
      {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Claim Airdrop'}
    </button>
  );
}
```

### API Response Handling

Use the discriminated union pattern from `@hp/types`:

```typescript
import { type ApiResponse } from '@hp/types';
import { fetchData } from '@hp/core';

const response = await fetchData<User>('/users/1');

if (response.success) {
  // TypeScript knows response.data exists
  console.log(response.data);
} else {
  // TypeScript knows response.error exists
  console.error(response.error);
}
```

### Async Operations with Loading States

Use Zustand stores for loading states:

```typescript
// In store
interface DataState {
  data: Data | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchData<Data>('/api/data');
      if (response.success) {
        set({ data: response.data, loading: false });
      } else {
        set({ error: response.error, loading: false });
      }
    } catch (err) {
      set({ error: 'Unknown error', loading: false });
    }
  },
}));
```

## Testing Strategy

### What to Test

- **Core utilities** in `@hp/core` - unit tests for business logic
- **Complex components** - integration tests for user interactions
- **API integrations** - mock API responses
- **Zustand stores** - test state updates and actions

### Test File Location

- Place test files adjacent to source files
- Use `.test.ts` or `.test.tsx` extension
- Example: `counterStore.test.ts` next to `counterStore.ts`

## Performance Considerations

### Build Optimization

- Vite is configured with code splitting for React and Zustand
- Source maps enabled for debugging
- ESBuild for fast minification

### Development Performance

- HMR (Hot Module Replacement) enabled
- TypeScript project references for incremental builds
- Optimized dependency pre-bundling

## Troubleshooting

### Type Check Failures

1. Ensure all packages are built: `bun run build`
2. Check TypeScript project references in `tsconfig.json`
3. Verify imports use correct path aliases

### Build Failures

1. Clear build artifacts: `rm -rf dist */dist */*/dist`
2. Clean install: `rm -rf node_modules && bun install`
3. Check for circular dependencies

### State Management Issues

1. Verify Zustand store is properly created with `create()`
2. Check store hook is exported and imported correctly
3. Use React DevTools to inspect store state
4. Ensure state updates are immutable

## Git Workflow

- Use conventional commits (e.g., `feat:`, `fix:`, `refactor:`)
- Keep commits atomic and focused
- Run `bun run lint` and `bun run type-check` before committing

## Additional Notes

- **Package Manager**: This project uses Bun (v1.0.0+) exclusively
- **Node Version**: Target ES2022 runtime
- **Browser Support**: Modern browsers with ES2022+ support
- **Component Patterns**: Prefer composition over inheritance
- **Code Style**: Enforced by ESLint and Prettier - run formatters before committing
