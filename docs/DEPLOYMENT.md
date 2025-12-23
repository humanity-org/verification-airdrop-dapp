# Deployment Guide

This guide explains how to deploy the Verification Airdrop dApp to Vercel.

## Prerequisites

- [Bun](https://bun.sh) installed (v1.0.0+)
- [Vercel CLI](https://vercel.com/cli) installed (optional, for CLI deployment)
- A [Vercel account](https://vercel.com/signup)

## Environment Variables

Before deploying, ensure you have the following environment variables configured in your Vercel project:

```env
# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Contract Addresses (Hashkey Chain Testnet)
VITE_TOKEN_ADDRESS=0xBa3B7d3CC18cEaA52eb487fc6A2c70e798da35FF
VITE_AIRDROP_ADDRESS=0x6c1f1ab8615c495c5D92AB055d7E53c4D60F30dc
```

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project in Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your repository

3. **Configure build settings**
   - Vercel will automatically detect the `vercel.json` configuration
   - Framework Preset: **Vite**
   - Root Directory: `./` (monorepo root)
   - Build Command: Will use the one from `vercel.json`
   - Output Directory: Will use the one from `vercel.json`
   - Install Command: `bun install`

4. **Add environment variables**
   - Go to Project Settings → Environment Variables
   - Add the variables listed above
   - Apply to Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link your project** (first time only)
   ```bash
   vercel link
   ```

4. **Set environment variables** (first time only)
   ```bash
   vercel env add VITE_WALLETCONNECT_PROJECT_ID
   vercel env add VITE_TOKEN_ADDRESS
   vercel env add VITE_AIRDROP_ADDRESS
   ```

5. **Deploy to preview**
   ```bash
   vercel
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Pre-deployment Checklist

Before deploying, run the pre-deployment checks:

```bash
bun run predeploy
```

This command will run in sequence (with Turborepo caching):
- ✅ TypeScript type checking (`turbo run type-check`)
- ✅ ESLint code quality checks (`turbo run lint`)
- ✅ Production build (`turbo run build`)

**Benefits of using Turbo:**
- 🚀 Cached tasks are skipped (instant validation)
- ⚡ Parallel execution where possible
- 🔄 Only rebuilds changed packages

## Local Preview

To preview the production build locally:

```bash
bun run preview
```

This will:
1. Build the application for production
2. Start a local preview server at `http://localhost:4173`

## Vercel Configuration

The project includes a `vercel.json` configuration file with the following settings:

### Build Configuration
- **Build Command**: `cd apps/web && bun run build`
- **Output Directory**: `apps/web/dist`
- **Install Command**: `bun install`
- **Framework**: Vite

### Security Headers
The following security headers are automatically applied:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Caching Strategy
- Static assets in `/assets/` are cached for 1 year (immutable)
- `Cache-Control: public, max-age=31536000, immutable`

### SPA Routing
All routes are rewritten to `/index.html` for client-side routing support.

## Post-deployment Verification

After deployment, verify the following:

1. **Application loads correctly**
   - Visit your deployment URL
   - Check browser console for errors

2. **Wallet connection works**
   - Test connecting with MetaMask or other wallets
   - Verify WalletConnect integration

3. **Contract interactions**
   - Test eligibility checking
   - Test airdrop claiming (if eligible)

4. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals

## Continuous Deployment

Once set up, Vercel automatically deploys:
- **Production**: On push to `main` branch
- **Preview**: On pull requests and other branches

## Troubleshooting

### Build Failures

If the build fails:

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Run local build** to reproduce:
   ```bash
   bun run build
   ```

### Type Errors

If you encounter type errors during build:

```bash
bun run type-check
```

Fix all type errors before deploying.

### Lint Errors

If linting fails:

```bash
bun run lint
```

### Missing Environment Variables

Ensure all required environment variables are set in Vercel:
- Go to Project Settings → Environment Variables
- Add missing variables
- Redeploy

## Rollback

If you need to rollback to a previous deployment:

1. Go to Vercel Dashboard → Deployments
2. Find the previous successful deployment
3. Click "Promote to Production"

## Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS settings as instructed by Vercel
4. Wait for DNS propagation (can take up to 48 hours)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vite.dev/guide/static-deploy)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

## Support

For deployment issues:
- Check [Vercel Status](https://vercel-status.com)
- Visit [Vercel Community](https://github.com/vercel/vercel/discussions)
- Contact your team's DevOps support
