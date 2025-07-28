# Woosa - Cryptocurrency Wallet & Trading Platform

## Overview

Woosa is a modern cryptocurrency wallet and trading platform built with React, Node.js/Express, and PostgreSQL. The application provides portfolio management, cryptocurrency trading, staking, automation features, and advanced security. It features a sleek dark theme UI and supports multi-chain cryptocurrency operations.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a full-stack architecture with:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom crypto-themed design tokens

### Database Integration (Added January 22, 2025)
- Replaced in-memory storage with PostgreSQL database using Neon serverless
- Implemented comprehensive DatabaseStorage class with full CRUD operations
- Added automatic database seeding with cryptocurrency data and demo user portfolio
- Database includes: users, cryptocurrencies, portfolio holdings, automation rules, transactions, and portfolio history

## Key Components

### Frontend Architecture
- **Component Structure**: Organized into pages, components (layout, UI, modals, portfolio)
- **UI System**: shadcn/ui component library with customized styling
- **Theme**: Dark theme optimized for crypto trading with custom color variables
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Type Safety**: Full TypeScript integration throughout

### Backend Architecture
- **API Design**: RESTful endpoints organized by feature (portfolio, automation, transactions)
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Interface**: Abstract storage layer for database operations
- **Middleware**: Express middleware for logging, error handling, and request processing

### Database Schema
The application uses the following core entities:
- **Users**: User accounts with authentication
- **Cryptocurrencies**: Crypto asset data with pricing information
- **Portfolio Holdings**: User's crypto asset balances and investment tracking
- **Automation Rules**: Smart trading rules by crypto type (major, altcoin, meme)
- **Transactions**: Trading and transaction history
- **Portfolio History**: Historical portfolio value tracking

### Security Features
- **Passkey Authentication**: Biometric and hardware security keys
- **Quantum Encryption**: Post-quantum cryptography protection
- **Multi-Signature Wallet**: Multiple approval requirements for transactions
- **Hardware Wallet Integration**: Support for Ledger, Trezor devices

## Data Flow

1. **User Interaction**: Users interact through React components
2. **State Management**: TanStack Query manages server state and caching
3. **API Communication**: HTTP requests to Express.js backend
4. **Database Operations**: Drizzle ORM handles PostgreSQL queries
5. **Real-time Updates**: Automatic data refresh and state synchronization

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18 with hooks, React Query for state management
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Forms**: React Hook Form with Zod validation
- **Charts**: Custom canvas-based charts for trading data
- **Routing**: Wouter for lightweight client-side routing

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Validation**: Zod schema validation
- **Session Management**: PostgreSQL-based session storage
- **Development**: TypeScript, ESBuild for production builds

### Development Tools
- **Build System**: Vite for frontend, ESBuild for backend
- **Type Checking**: TypeScript across full stack
- **Database Migrations**: Drizzle Kit for schema management
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Neon serverless PostgreSQL connection
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild compiles server code to `dist/index.js`
- **Deployment**: Single Node.js process serving API and static files
- **Database**: Production PostgreSQL instance via connection string

### Recent Changes (January 28, 2025)
- **Multi-Chain Network Selector**: Replaced static "Multi-Chain" text with interactive dropdown
- **Supported Networks**: Bitcoin, Ethereum, Solana, Polygon, BSC, Avalanche, Arbitrum, Optimism
- **Mobile Integration**: Added chain selector to mobile sidebar navigation
- **Text Visibility**: Updated CSS to ensure all text is white for better visibility

### Key Architectural Decisions

1. **Monorepo Structure**: Frontend, backend, and shared code in single repository
2. **Type Safety**: Shared schema definitions between frontend and backend
3. **Modern Stack**: Latest React patterns with TypeScript throughout
4. **Database-First Design**: Strong schema definitions driving API design
5. **Component-Driven UI**: Reusable components with consistent styling
6. **Real-time Data**: Automatic refresh and caching for cryptocurrency data
7. **Security Focus**: Multiple layers of security for crypto asset protection
8. **Multi-Chain Support**: Interactive network selector supporting 8+ blockchain networks