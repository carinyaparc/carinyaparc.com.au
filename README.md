# Carinya Parc Website

This repository contains the website for Carinya Parc, a regenerative farm committed to sustainable practices and community engagement.

## Technology Stack

- Next.js App Router v15 with TypeScript
- React v19 with React DOM v19
- Tailwind CSS
- MDX
- Vercel

## Development Workflow

### Branch Structure

- `dev` - Development branch where active work happens
- `staging` - Pre-production branch for testing and validation
- `main` - Production branch, deployed to live site

### Local Development

```bash
# Install and build the site
pnpm install && pnpm build

# Start development server
pnpm dev
```

### Deployment Pipeline

We use an automated CI/CD pipeline:

1. Push to `dev` branch → CI checks run → auto-promote to `staging`
2. Test on `staging` → Manually trigger promotion to `main` when ready
3. `main` branch is automatically deployed to production

## Contributing

Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is available under the MIT license. It is freely available for any agricultural business to copy, modify, and deploy for their own farm website.

## For Non-Technical Users

This project is designed to be easy to customize and deploy, even for users with minimal technical experience. Simply fork the repository and follow the setup instructions to create your own farm website.
