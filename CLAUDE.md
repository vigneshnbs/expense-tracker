# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Expense Tracker** monorepo containing two main applications:

1. **admin/** - Spring Boot backend API (Java 21, MySQL)
2. **ui/** - React frontend (TypeScript, Vite, Material-UI)

The applications work together via a REST API. The backend provides CRUD operations for accounts, categories, transactions, and budget allocations. The frontend consumes these APIs and presents a comprehensive personal finance management interface.

## Quick Start with Docker Compose

```bash
# Start all services (admin API, UI, MySQL, phpMyAdmin)
docker compose up

# Services:
# - UI: http://localhost:5173
# - Admin API: http://localhost:8080
# - phpMyAdmin: http://localhost:8081
```

## Development Commands

### Backend (admin/)
```bash
cd admin
./mvnw spring-boot:run        # Start dev server
./mvnw clean package          # Build JAR
./mvnw clean package -DskipTests  # Build without tests
```

### Frontend (ui/)
```bash
cd ui
pnpm install                  # Install dependencies
pnpm start                    # Start dev server (port 5173)
pnpm test                     # Run tests
pnpm test:watch               # Tests in watch mode
pnpm lint                     # Run ESLint
pnpm build                    # Production build
```

## Architecture

### Backend Structure (admin/)
Standard Spring Boot layered architecture:
- **Controllers** - REST endpoints under `/api/*`
- **Services** - Business logic layer
- **Repositories** - Spring Data JPA interfaces
- **Models** - JPA entities (Account, Category, Transaction, BudgetAllocation)
- **DTOs** - Data transfer objects (AccountSummaryDTO, BudgetComparisonDTO, etc.)
- **Enums** - AccountType, CategoryType, TransactionType

### Frontend Structure (ui/)
Feature-based modular architecture with React Router v7:
- **modules/** - Feature modules (dashboard, accounts, categories, transactions, budget)
- **api/** - Centralized API client with resource-specific files
- **types/** - TypeScript interfaces and enums
- **utils/** - Currency formatting (INR/₹), date utilities
- **testing-helpers/** - Test utilities, MSW mock server setup

### Key Technical Decisions

**Frontend Patterns:**
- React Query for server state management
- React Hook Form for form handling
- MSW (Mock Service Worker) for API mocking in tests
- 100% code coverage requirement enforced by Jest
- Path alias: `src/` prefix for imports

**Backend Patterns:**
- Lombok for boilerplate reduction
- Spring Data JPA with MySQL
- Spring Boot Actuator for monitoring

## Subdirectory Documentation

Each application has its own detailed CLAUDE.md:
- [admin/CLAUDE.md](admin/CLAUDE.md) - Backend-specific commands and patterns
- [ui/CLAUDE.md](ui/CLAUDE.md) - Frontend architecture, testing strategy, and implementation patterns

The UI documentation includes a complete reference implementation of the Accounts module that serves as a blueprint for implementing other modules.
