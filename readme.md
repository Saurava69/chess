# ♟️ SyntaxEngineer Chess

A comprehensive chess analysis and learning platform powered by Stockfish engine. Play, analyze, and improve your chess game with professional-quality tools - completely free.

![Chess Analysis Platform](https://img.shields.io/badge/Chess-Analysis-blue) ![Stockfish](https://img.shields.io/badge/Engine-Stockfish-green) ![Free](https://img.shields.io/badge/Price-Free-brightgreen) ![React](https://img.shields.io/badge/Frontend-React-blue) ![Node.js](https://img.shields.io/badge/Backend-Node.js-green)

## 🌟 Features

### ✅ **Currently Available**
- **🔍 Advanced Chess Analysis** - Stockfish-powered game analysis with blunder detection
- **🗄️ Personal Game Archive** - Store, organize, and manage your chess games
- **📰 Chess News** - Latest chess news and tournament coverage
- **🆘 Help Center** - Comprehensive support and tutorials

### 🔄 **Coming Soon**
- **📚 Complete Chess Education** - Interactive learning system with structured courses
- **🎯 Tactical Training** - Daily puzzles and pattern recognition exercises
- **📊 Strategic Understanding** - Positional chess courses and evaluation training
- **🔬 Advanced Analysis Tools** - Enhanced game review and improvement tracking

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22 or later
- **MongoDB** (local or cloud instance)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saurava69/chess.git
   cd chess
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # Required
   AUTH_SECRET="your-random-secret-string-here"
   ORIGIN="http://localhost:8080"
   
   # Optional
   NODE_ENV="development"
   PORT=8080
   DATABASE_URI="mongodb://localhost:27017/syntaxengineer"
   ANALYSIS_SESSION_ACTIONS=80
   MAXIMUM_ARCHIVE_SIZE=50
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
chess1/
├── client/                 # Frontend React application
│   ├── src/               # React components and logic
│   ├── public/            # Static assets and HTML templates
│   └── dist/              # Built frontend files
├── server/                # Backend Node.js application
│   ├── src/               # Server source code
│   │   ├── routes/        # API and page routes
│   │   ├── lib/           # Utilities and helpers
│   │   └── database/      # Database models and connection
│   └── dist/              # Built server files
├── shared/                # Shared types and utilities
├── docs/                  # Documentation
└── package.json           # Root package configuration
```

## 🔧 Development

### Build Commands

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build -w client
npm run build -w server
npm run build -w shared

# Quick build (backend only)
npm run bbuild
```

### Development Workflow

1. **Start development server**
   ```bash
   npm run bbuild && npm start
   ```

2. **Make your changes** in the appropriate workspace (`client/`, `server/`, or `shared/`)

3. **Rebuild and test**
   ```bash
   npm run bbuild && npm start
   ```

## 🌐 Deployment

### Environment Variables for Production

```bash
NODE_ENV="production"
ORIGIN="https://yourdomain.com"
AUTH_SECRET="secure-random-string"
DATABASE_URI="mongodb://your-mongodb-uri"
PORT=8080
```

### Deployment Platforms

The application can be deployed to any Node.js hosting platform:

- **Railway** - Recommended for full-stack apps
- **Render** - Great free tier with MongoDB support  
- **Vercel** - Excellent for frontend with serverless functions
- **Heroku** - Classic choice for Node.js applications

See [docs/hosting.md](docs/hosting.md) for detailed hosting instructions.

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Webpack** - Module bundling and optimization
- **CSS Modules** - Scoped styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Better-Auth** - Authentication system
- **TypeScript** - Server-side type safety

### Chess Engine
- **Stockfish 17** - World's strongest chess engine
- **WebAssembly** - High-performance chess analysis
- **PGN Support** - Standard chess game notation

## 📊 SEO & Performance

- **Server-Side Rendering** - Content visible to search engines
- **Structured Data** - Rich snippets with JSON-LD
- **Meta Tags** - Optimized for social sharing
- **Sitemap Generation** - Dynamic XML sitemap
- **PWA Features** - Service worker and app manifest
- **Mobile Responsive** - Works on all device sizes

## 🔒 Security Features

- **Hostname Whitelist** - Prevents host header attacks
- **CAPTCHA Integration** - Rate limiting for analysis
- **Secure Authentication** - JWT-based user sessions
- **Input Validation** - Sanitized user inputs
- **CORS Protection** - Cross-origin request security

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Test your changes locally before submitting
- Update documentation when adding features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: GitHub Issues
- **Help Center**: Available in the application at `/help`

## 🎯 Roadmap

- [ ] Complete Chess Education system
- [ ] Tactical puzzle database
- [ ] Opening repertoire builder
- [ ] Tournament tools and pairing
- [ ] Chess.com/Lichess integration
- [ ] Mobile app development
- [ ] Multiplayer chess games
- [ ] Advanced statistics and insights

## ⭐ Acknowledgments

- **Stockfish Team** - For the incredible chess engine
- **Chess Community** - For feedback and suggestions
- **Open Source Contributors** - For various libraries and tools

---

**🔗 Links**
- [Live Demo](https://syntaxengineer.com)
- [Documentation](docs/)
- [Chess Analysis](http://localhost:8080/analysis)
- [Game Archive](http://localhost:8080/archive)
