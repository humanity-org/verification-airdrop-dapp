# Verification Airdrop dApp 🚀

A decentralized application for airdrop verification and token distribution, built with modern Web3 technologies.

## ✨ Features

- 🔐 **Wallet Integration** - Connect with MetaMask, WalletConnect, and more via RainbowKit
- ✅ **Eligibility Verification** - Check if users are eligible for airdrops
- 🎁 **Token Distribution** - Claim and distribute tokens on-chain
- 📊 **Transaction Tracking** - Monitor transaction status in real-time
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS v4
- ⚡ **High Performance** - Built with Vite and optimized for speed

## 📁 Project Structure

```
verification-airdrop-dapp/
├── packages/                  # Shared packages
│   ├── types/                # Shared TypeScript types
│   └── core/                 # Core business logic
├── apps/                     # Applications
│   └── web/                  # Web application (Vite + React + Web3)
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── contracts/   # Smart contract interfaces
│       │   ├── abis/        # Contract ABIs
│       │   ├── stores/      # Zustand state management
│       │   └── config/      # Web3 configuration
├── docs/                     # Documentation
└── package.json              # Root package.json with workspaces
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- A Web3 wallet (MetaMask, WalletConnect, etc.)
- Access to a supported blockchain network

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start the web app in development mode (http://localhost:3000)
bun run dev
```

The app will automatically open in your browser. Connect your wallet to start interacting with the dApp.

### Build

```bash
# Build all packages and apps for production
bun run build
```

### Testing

```bash
# Run tests
bun run test
```

### Code Quality

```bash
# Lint code
bun run lint

# Format code
bun run format

# Type check
bun run type-check

# Clean build artifacts
bun run clean
```

## 📦 Packages

### @hp/types

Shared TypeScript type definitions used across the monorepo, including blockchain-related types and interfaces.

### @hp/core

Core business logic, utilities, and shared functionality for airdrop operations.

## 🏗️ Apps

### web

Main web application built with Vite, React, and Web3 technologies. Features wallet integration, smart contract interactions, and a modern UI for airdrop management.

## 🛠️ Tech Stack

### Frontend Core
- **Runtime**: Bun
- **Build Tool**: Vite 5
- **Framework**: React 18
- **Language**: TypeScript 5.3+ (strict mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build System**: Turborepo

### Web3 Stack
- **Wallet Integration**: RainbowKit v2
- **React Hooks**: Wagmi v3
- **Ethereum Interface**: Viem v2
- **Query Management**: TanStack Query v5

### State Management
- **App State**: Zustand
- **Blockchain State**: TanStack Query (via Wagmi)

### Code Quality
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **Monorepo**: Bun Workspaces + Turborepo

## 📝 Development Guidelines

### General
- Follow TypeScript strict mode
- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Write tests for critical business logic
- Keep components small and focused (<200 lines)
- Use semantic HTML and ensure accessibility
- See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines

### Web3 Specific
- **Always handle transaction failures** - Users might reject transactions
- **Provide clear feedback** - Show loading states and transaction status
- **Handle network switching** - Users might be on the wrong network
- **Gas estimation** - Always estimate gas before transactions
- **Type safety** - Use `Address` type from Viem for addresses
- **BigInt handling** - Use `bigint` for all token amounts and wei values
- **Wallet state** - Handle disconnection gracefully

### State Management
- **Use Zustand** for app-level state (UI, user preferences)
- **Use TanStack Query** (via Wagmi) for blockchain state
- **Never use React.useState** for global or shared state
- **Never use React.useContext** for state management

## 🔧 Configuration

### Environment Variables

Create a `.env` file in `apps/web/`:

```env
# Required
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id

# Optional
VITE_CHAIN_ID=1  # Mainnet by default
```

### Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- (Add more as needed)

## 🔗 Useful Links

### Framework & Tools
- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Tailwind CSS v4](https://tailwindcss.com/)

### Web3
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [TanStack Query](https://tanstack.com/query)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

Built with ❤️ using modern Web3 technologies and best practices.
