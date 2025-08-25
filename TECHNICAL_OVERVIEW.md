# Library API - Technical Overview

## Project Summary
A library management API built with TypeScript, Express.js, and Prisma ORM, implementing Clean Architecture (Onion Architecture) principles. The system manages users, books, and loan transactions with strict architectural layer separation.

## Core Components

### 1. Domain Layer (`src/domain/`)
**Purpose**: Contains business entities and repository interfaces (dependency inversion)

**Key Components**:
- **Entities** (`entities/`):
  - `User`: User management with email uniqueness
  - `Book`: Book inventory with availability status (`available`/`loaned`)
  - `Loan`: Loan transactions linking users and books with timestamps

- **Repository Interfaces** (`repositories/`):
  - `IGenericRepository<T>`: Base CRUD operations (`findById`, `findAll`, `delete`)
  - `IUserRepository`: Extends generic with `findUserByEmail`, `create`, `update`
  - `IBookRepository`: Extends generic with `findBooksByAuthor`, `findAvailableBooks`, `create`, `update`
  - `ILoanRepository`: Extends generic with `findActiveLoansByUserId`, `markAsReturned`, `create`, `update`

**Design Patterns**: 
- Repository pattern for data access abstraction
- Generic repository pattern for common CRUD operations
- Interface segregation principle

### 2. Application Layer (`src/application/`)
**Purpose**: Business logic orchestration and use case implementation

**Key Components**:
- **BaseService**: Abstract generic service providing common operations (`getById`, `getAll`, `deleteById`) with abstract methods for `create` and `update`
- **UserService**: User management with email uniqueness validation
- **BookService**: Book management with author-title uniqueness validation
- **LoanService**: Complex loan orchestration managing book availability states and loan lifecycle

**Business Rules Enforced**:
- Email uniqueness for users
- Author-title combinations must be unique
- Books must be available before loaning
- Loan state management (active/returned)
- Automatic book status updates during loan operations

### 3. Infrastructure Layer (`src/infrastructure/`)
**Purpose**: External system integrations (database via Prisma)

**Key Components**:
- **PrismaGenericRepository**: Base implementation using Prisma client with dynamic model selection
- **PrismaUserRepository**: User-specific queries and Prisma type conversions
- **PrismaBookRepository**: Book-specific queries with case-insensitive author search
- **PrismaLoanRepository**: Complex loan queries with relation includes and foreign key management

**Technical Details**:
- Uses Prisma Client for type-safe database operations
- Implements DTO to Prisma type conversions
- Handles foreign key relationships through Prisma's `connect` syntax

### 4. Presentation Layer (`src/presentation/`)
**Purpose**: HTTP interface (minimal implementation)

**Current State**: Basic Express.js server with single health check endpoint
**Architecture Ready**: Structured to receive dependency-injected services

## Component Interactions

### Data Flow Architecture
```
HTTP Request → Presentation Layer → Application Services → Domain Interfaces → Infrastructure Repositories → Database
```

### Key Interaction Patterns

1. **Dependency Inversion**: 
   - Application services depend on domain interfaces, not concrete implementations
   - Infrastructure implements domain interfaces
   - Services receive repository dependencies through constructor injection

2. **Service Orchestration**:
   - `LoanService` coordinates multiple repositories (`ILoanRepository`, `IBookRepository`, `IUserRepository`)
   - Validates business rules across entity boundaries
   - Manages transactional state changes (book status updates during loans)

3. **Generic Pattern Usage**:
   - Base services and repositories reduce code duplication
   - Type-safe generics maintain strong typing throughout layers
   - Abstract methods ensure domain-specific logic implementation

## Deployment Architecture

### Build Configuration
- **TypeScript**: ES2022 target with NodeNext modules
- **Output**: Compiled to `dist/` directory
- **Entry Point**: `dist/presentation/server.js`

### Dependencies
- **Runtime**: Express.js, Prisma Client, bcrypt
- **Development**: TypeScript, ts-node, nodemon
- **Database**: PostgreSQL via Prisma ORM

### Database Schema
- **Users**: Email-based authentication with bcrypt hashing
- **Books**: Title/author with availability status enum
- **Loans**: Junction table with optional return timestamps
- **Relations**: Foreign keys with cascading constraints

### Environment Requirements
- Node.js with ES modules support
- PostgreSQL database
- Environment variables for database connection (`DATABASE_URL`)

### Scripts
- `npm run dev`: Development server with hot reload
- `npm run build`: TypeScript compilation
- `npm start`: Production server execution
- Database migrations via Prisma CLI

## Runtime Behavior

### Application Initialization
1. Express server starts on port 3001
2. Prisma Client connections established on-demand
3. Service dependency tree ready for injection (not yet implemented)

### Request Processing Pattern
**Current**: Basic HTTP handling
**Intended Architecture**:
1. HTTP requests routed to controllers
2. Controllers inject application services
3. Services execute business logic via domain interfaces
4. Infrastructure repositories handle data persistence
5. Response transformation and HTTP status management

### Business Workflow Examples

#### Loan Creation Workflow
1. Validate user and book existence
2. Check book availability status
3. Update book status to 'loaned'
4. Create loan record with current timestamp
5. Return loan confirmation

#### Book Return Workflow
1. Validate active loan exists
2. Update book status to 'available'
3. Set loan return timestamp
4. Return updated loan record

### Error Handling Strategy
- Domain validation throws descriptive business errors
- Repository layer handles database constraint violations
- Service layer aggregates validation across multiple entities
- Type safety prevents runtime type errors

### Data Consistency
- Business rules enforced at service layer
- Database constraints provide data integrity backup
- Transactional operations ensure state consistency
- Foreign key relationships maintain referential integrity

## Technical Strengths

1. **Clean Architecture Implementation**: Proper layer separation with dependency inversion
2. **Type Safety**: Full TypeScript coverage with Prisma-generated types
3. **Generic Patterns**: Reduced code duplication through base classes
4. **Business Logic Centralization**: Domain rules enforced in application services
5. **Database Abstraction**: Repository pattern enables data source flexibility

## Current Limitations

1. **Incomplete Presentation Layer**: No HTTP endpoints beyond health check
2. **No Dependency Injection Container**: Manual dependency management required
3. **Missing Error Handling**: No centralized error response formatting
4. **No Authentication/Authorization**: Security layer not implemented
5. **Limited Transaction Management**: No explicit database transaction handling

This architecture provides a solid foundation for a scalable library management system with clear separation of concerns and maintainable code organization.
