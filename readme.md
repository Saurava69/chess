# Chess

A chess analysis and learning platform built around the Stockfish engine. Play through games, run engine analysis, manage a personal archive, and follow chess news — all in a single self-hostable Node.js application.

Live site: [chess.sauravx.com](https://chess.sauravx.com)

## Overview

This is a full-stack TypeScript application organized as an npm workspace:

- **`client/`** — React frontend, bundled with Webpack
- **`server/`** — Express backend with server-side rendering
- **`shared/`** — Types and utilities shared between client and server

## Features

**Available**

- Stockfish-powered game analysis with move classification and blunder detection
- Personal game archive with import/export support
- Chess news section
- Help center and tutorials
- Server-side rendering with structured data for SEO
- Progressive Web App (offline support, installable)
- Email-based authentication and Google OAuth sign-in

**Planned**

- Interactive courses and structured lessons
- Tactical puzzle training
- Opening repertoire builder
- Deeper post-game review tools

## Requirements

- Node.js 22 or later
- MongoDB (local instance or Atlas)
- Git

## Quick Start

```bash
git clone https://github.com/Saurava69/chess.git
cd chess
npm install
cp environment-template.txt .env   # then edit .env
npm run build
npm start
```

The server listens on `http://localhost:8080` by default.

## Configuration

All configuration is supplied through environment variables. A complete template lives in [`environment-template.txt`](environment-template.txt).

### Required

| Variable | Description |
|---|---|
| `NODE_ENV` | `production` or `development` |
| `ORIGIN` | Public URL of the deployment (e.g. `http://localhost:8080`) |
| `AUTH_SECRET` | Random 32+ byte hex string. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DATABASE_URI` | MongoDB connection string |

### Optional

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | HTTP listen port |
| `ANALYSIS_SESSION_ACTIONS` | `80` | Per-session analysis quota |
| `MAXIMUM_ARCHIVE_SIZE` | `50` | Max games per user archive |
| `INTERNAL_PASSWORD` | — | Admin panel password |
| `EMAIL_ACCOUNT` | — | Public contact address shown on the site |
| `AUTOMATED_EMAIL_ADDRESS` | — | Sender address for verification and password-reset mail |
| `AUTOMATED_EMAIL_KEY` | — | App password for the automated mail account |
| `GOOGLE_OAUTH_CLIENT_ID` | — | Enables "Sign in with Google" |
| `GOOGLE_OAUTH_CLIENT_SECRET` | — | Paired with the above |
| `ADS_PUBLISHER_ID` | — | AdSense publisher ID |

Email signup and password reset flows require all three `*EMAIL*` variables to be set. Google sign-in requires both `GOOGLE_OAUTH_*` variables.

## Scripts

| Command | Description |
|---|---|
| `npm run build` | Build all workspaces (client, server, shared) |
| `npm run bbuild` | Build only `shared` and `server` (faster iteration when frontend is unchanged) |
| `npm start` | Start the production server from `server/dist` |
| `npm run dev` | Build everything and start |
| `npm run lint` | Run ESLint across the repo |

Typical backend-development loop:

```bash
npm run bbuild && npm start
```

## Project Structure

```
.
├── client/                React frontend
│   ├── src/               Components, hooks, pages
│   └── public/            Static assets, HTML templates, locales
├── server/                Express backend
│   └── src/
│       ├── routes/        HTTP and SSR routes
│       ├── lib/           Auth, email, SEO, utilities
│       └── database/      Mongoose models
├── shared/                Cross-cutting types and helpers
├── docs/                  Hosting and contributing guides
├── Dockerfile
└── compose.yaml
```

## Deployment

The application runs on any Node.js host. Detailed instructions for specific platforms (Railway, Render, Vercel) are in [`docs/hosting.md`](docs/hosting.md).

A `Dockerfile` and `compose.yaml` are included for container-based deployment. At minimum, set `NODE_ENV=production`, `ORIGIN`, `AUTH_SECRET`, and `DATABASE_URI` in the target environment, then build and start the image.

## Technology

- **Frontend** — React, TypeScript, Webpack, CSS Modules
- **Backend** — Node.js, Express, Mongoose, Better-Auth
- **Engine** — Stockfish 17 compiled to WebAssembly
- **Storage** — MongoDB

## Security

- Hostname whitelist to mitigate host-header attacks
- Rate-limited analysis sessions
- Session-based authentication via Better-Auth
- Server-side input validation and CORS controls

Report security issues privately by email rather than through public GitHub issues.

## Contributing

Contributions are welcome. See [`docs/contributing.md`](docs/contributing.md) for the full guide. In brief:

1. Fork the repository and create a feature branch.
2. Make changes with accompanying tests where appropriate.
3. Run `npm run lint` and `npm run build` locally.
4. Open a pull request describing the change and its motivation.

## License

Released under the MIT License. See [`LICENSE`](LICENSE) for the full text.
