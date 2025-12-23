# Verification Airdrop dApp 🚀

A decentralized application for airdrop verification and token distribution, built with modern Web3 technologies.

## ✨ Features

- 🔐 **Wallet Integration** - Connect with MetaMask, WalletConnect, and more via RainbowKit
- ✅ **Eligibility Verification** - Check if users are eligible for airdrops
- 🎁 **Token Distribution** - Claim and distribute tokens on-chain
- 📊 **Transaction Tracking** - Monitor transaction status in real-time
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS v4
- ⚡ **High Performance** - Built with Vite and optimized for speed

## 🎬 Demo

### Screenshots

> **Note**: Add your project screenshots here to showcase the application

- Main interface with wallet connection
- Airdrop eligibility check flow
- Token claiming process
- Transaction status tracking

### Live Demo

> **Coming Soon**: Link to live demo will be added here

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
│       │   ├── services/    # Business logic services
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
# Required - WalletConnect Project ID
# Get yours at https://cloud.walletconnect.com/
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional - Network Configuration
VITE_CHAIN_ID=4689
VITE_RPC_URL=https://babel-api.mainnet.iotex.io

# Optional - Contract Addresses (if using custom contracts)
VITE_AIRDROP_CONTRACT_ADDRESS=0x...
VITE_TOKEN_CONTRACT_ADDRESS=0x...

# Optional - Application Configuration
VITE_APP_NAME="Verification Airdrop dApp"
VITE_APP_DESCRIPTION="Claim your tokens"
```

**How to get WalletConnect Project ID:**
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID

### Supported Networks

- **HP Test Network** (Chain ID: 4689)
- **IoTeX Mainnet** (Chain ID: 4689)
- Easily add more networks by configuring in `apps/web/src/config/wagmi.ts`

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/verification-airdrop-dapp)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/)
3. Configure environment variables (see Configuration section)
4. Deploy!

Vercel will automatically detect the Vite configuration and set up the build process.

### Netlify

```bash
# Build the project
bun run build

# The dist folder will be in apps/web/dist
# Deploy this folder to Netlify
```

In Netlify dashboard:
1. Set build command: `bun run build`
2. Set publish directory: `apps/web/dist`
3. Add environment variables

### Docker (Self-Hosting)

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t verification-airdrop-dapp .
docker run -p 80:80 verification-airdrop-dapp
```

### Static Hosting

After building (`bun run build`), you can deploy the `apps/web/dist` folder to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static file server

## ❓ FAQ

### General Questions

**Q: What wallets are supported?**  
A: We support all wallets compatible with WalletConnect v2, including:
- MetaMask
- Trust Wallet
- Coinbase Wallet
- Rainbow Wallet
- And many more through WalletConnect

**Q: Which blockchain networks are supported?**  
A: Currently supporting IoTeX Mainnet (Chain ID: 4689). More networks can be easily added through configuration.

**Q: How do I add a custom token to the airdrop?**  
A: You need to deploy your own airdrop contract and update the contract address in the environment variables. See the contracts configuration in `apps/web/src/config/wagmi.ts`.

**Q: What are the gas fees for claiming?**  
A: Gas fees vary by network and current network congestion. Estimated fees are shown before transaction confirmation in your wallet.

**Q: Is this project production-ready?**  
A: This is a development template. Please conduct thorough testing and security audits before deploying to production with real assets.

### Technical Questions

**Q: Can I use this with other EVM-compatible chains?**  
A: Yes! Simply add your chain configuration in `apps/web/src/config/wagmi.ts` and update the environment variables.

**Q: How do I customize the UI theme?**  
A: The project uses Tailwind CSS v4. Customize colors and themes in `apps/web/src/index.css` using the `@theme` directive.

**Q: Can I add more state management stores?**  
A: Yes, create new Zustand stores in `apps/web/src/stores/` following the pattern in existing store files.

### Troubleshooting

**Issue: Wallet won't connect**
- Ensure you're on the correct network
- Check if your wallet extension is updated to the latest version
- Try refreshing the page
- Clear browser cache and try again

**Issue: Transaction failed**
- Verify you have enough native tokens for gas fees
- Check if you're eligible for the airdrop
- Ensure you're on the correct network
- Try increasing the gas limit in your wallet

**Issue: Build fails**
- Run `bun install` to ensure all dependencies are installed
- Clear build cache with `bun run clean`
- Check Node/Bun version compatibility
- Ensure all TypeScript errors are resolved with `bun run type-check`

**Issue: Environment variables not working**
- Ensure your `.env` file is in the `apps/web/` directory
- Restart the dev server after changing environment variables
- Remember to prefix variables with `VITE_` for them to be available in the client

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

We welcome contributions from the community! Please follow these guidelines:

### Development Process

1. **Fork the repository** and clone it locally
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our code standards (see [CLAUDE.md](./CLAUDE.md))
4. **Write or update tests** if applicable
5. **Run quality checks**:
   ```bash
   bun run lint          # Check code style
   bun run type-check    # Check TypeScript types
   bun run build         # Ensure project builds
   bun run test          # Run tests (if available)
   ```
6. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Build process or tooling changes
   
   Example: `git commit -m 'feat: add batch claiming feature'`

7. **Push to your fork**: `git push origin feature/amazing-feature`
8. **Open a Pull Request** with a clear description of your changes

### Code Standards

- **TypeScript**: Use strict mode, avoid `any` types
- **React**: Functional components only, keep components under 200 lines
- **State Management**: Use Zustand for app state, never React Context
- **Web3**: Always handle transaction errors and provide user feedback
- **Styling**: Use Tailwind CSS v4, follow the design system
- **Code Style**: Enforced by ESLint and Prettier

### Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues
- Include screenshots for UI changes
- Ensure all checks pass
- Keep PRs focused and atomic

### Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, wallet, network)
- Console errors (if any)

### Questions?

Feel free to open an issue for questions or join our community discussions.

## 📄 License

MIT

## 🙏 Acknowledgments

Built with ❤️ using modern Web3 technologies and best practices.
