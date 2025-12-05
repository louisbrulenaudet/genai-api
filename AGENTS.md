# Worker API Agent Instructions

## Project Overview

This repository is a Cloudflare Worker that provides a REST API layer for generative AI inference and completion. It serves as a schema-driven HTTP API gateway, integrating with OpenAI and Google GenAI backends to provide a unified interface for AI model inference. The worker manages completion requests, supports multimodal input (text and images), and handles provider abstraction for multiple AI services. Built with Hono framework, it provides type-safe endpoints with comprehensive validation and error handling.

## Tech Stack

- **Language:** TypeScript (strict mode, ESNext)
- **Framework:** Hono (for Cloudflare Workers)
- **Authentication:** Bearer token authentication
- **Validation:** Zod schemas for request/response validation
- **Middleware:** CORS, compression, body limits, secure headers, pretty JSON
- **AI Providers:** OpenAI, Google GenAI (via @google/genai and openai packages)
- **Runtime:** Cloudflare Workers
- **Formatting/Linting:** Biome (spaces, double quotes, recommended rules)
- **Build Tools:** tsx, Wrangler
- **Automation:** Makefile, pnpm scripts
- **Environment:** dotenv (.dev.vars, .prod.vars)
- **Package Manager:** pnpm

## Project Structure

```
.
├── src/
│   ├── clients/              # Client implementations for AI providers
│   │   ├── baseClient.ts     # Base client interface
│   │   └── googleGenAIClient.ts
│   ├── dtos/                 # Data transfer objects and Zod schemas
│   │   ├── request.ts        # Request validation schemas
│   │   ├── response.ts       # Response validation schemas
│   │   └── internal.ts       # Internal DTOs
│   ├── routes/               # Route handlers
│   │   ├── health.ts         # Health check endpoint
│   │   └── completion.ts     # AI completion endpoint
│   ├── services/             # Business logic services
│   │   ├── inferenceService.ts  # Main inference orchestration
│   │   └── providers/        # AI provider implementations
│   │       ├── baseInferenceProvider.ts  # Abstract base class
│   │       └── googleGenAIProvider.ts    # Google GenAI implementation
│   ├── middlewares/          # Custom middleware
│   │   └── apiKeyProvider.ts  # API key resolution middleware
│   ├── enums/                # Type-safe enumerations
│   │   ├── provider.ts       # AI provider types
│   │   ├── model.ts          # Supported model names
│   │   ├── role.ts           # Message role types
│   │   └── ...
│   ├── types/                # TypeScript type definitions
│   │   ├── inference.ts      # Inference-related types
│   │   └── completionContext.ts
│   ├── utils/                # Utility functions
│   │   ├── retry.ts          # Retry logic for API calls
│   │   └── imageUtils.ts     # Image validation utilities
│   └── index.ts              # Main application entry point
├── biome.json                # Biome formatting/linting config
├── tsconfig.json             # TypeScript config (strict, path aliases)
├── wrangler.jsonc            # Cloudflare Workers configuration
├── Makefile                  # CLI shortcuts for common tasks
├── package.json              # Scripts, dependencies
├── .dev.vars/.prod.vars      # Environment variables
└── README.md                 # Usage and deployment instructions
```

## Environment Configuration

- **Development:** Runs on port 8788 (configurable in `wrangler.jsonc`)
- **Production:** Deployed as Cloudflare Worker

### Setup Instructions

1. **Install dependencies:**

   `make init`

2. **Configure environment:**

   Create `.dev.vars` file with required variables:

   ```
   BEARER_TOKEN=your_bearer_token_for_api_security
   GOOGLE_AI_STUDIO_API_KEY=your_google_ai_studio_api_key
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_AI_GATEWAY_ID=your_gateway_id
   CLOUDFLARE_AI_GATEWAY_BASE_URL=https://gateway.ai.cloudflare.com/v1
   ```

   For production, set secrets via Wrangler:

   ```bash
   wrangler secret put BEARER_TOKEN
   wrangler secret put GOOGLE_AI_STUDIO_API_KEY
   ```

3. **Development:**

   `make dev` - Runs development server on port 8788

4. **Deploy:**

   `make deploy` - Deploys to Cloudflare Workers

## Common Commands

The following Makefile commands are available for development, formatting, testing, and deployment:

| Command                | Description                                 |
|------------------------|---------------------------------------------|
| `make init`            | Initialize the project (install dependencies) |
| `make update`          | Update dependencies to latest versions      |
| `make dev`             | Run development server with hot reloading   |
| `make format`          | Format the codebase using Biome             |
| `make lint`            | Lint the codebase using Biome               |
| `make check`           | Check codebase for issues without fixing    |
| `make types`           | Generate worker-configuration.d.ts file for TypeScript types |
| `make cloc`            | Count lines of code in src/                 |
| `make deploy`          | Deploy to Cloudflare Workers                |

## Middleware Stack

The application uses a comprehensive middleware stack for security, performance, and functionality:

### Security Middleware

- **Bearer Authentication:** Token-based authentication for protected routes (`/api/v1/*`)
- **Secure Headers:** Security headers for production (via `hono/secure-headers`)
- **CORS:** Manual CORS configuration allowing origin-based access with credentials

### Custom Middleware

- **API Key Provider:** Resolves API keys from multiple sources (environment variables, headers, request body) and injects provider configuration into context

## Error Handling

The worker implements structured error handling using Hono's `HTTPException` for consistent error responses:

- **HTTPException:** Structured error responses with appropriate status codes
- **Global Error Handler:** Centralized error handling with logging in `src/index.ts`
- **Validation Errors:** Detailed validation error responses from Zod schemas
- **Provider Errors:** Errors from AI providers are caught and returned as appropriate HTTP status codes

## Request Validation with Zod

The API uses `@hono/zod-validator` middleware for type-safe request validation. This approach provides automatic validation, type inference, and error handling.

### Implementation Pattern

```typescript
import { zValidator } from "@hono/zod-validator";
import { InferenceRequest } from "../dtos";

// Apply validation middleware
completion.post(
  "/",
  zValidator("json", InferenceRequest),
  apiKeyProvider,
  async (c) => {
    // Access validated data with full type safety
    const request = c.req.valid('json');
    // TypeScript knows the exact shape of request
  }
);
```

### Validation Types

- **JSON Body:** `zValidator('json', schema)` for POST request bodies
- **Path Parameters:** `zValidator('param', schema)` for URL path parameters (if needed)
- **Query Parameters:** `zValidator('query', schema)` for query string parameters (if needed)

### Request Schema Features

The `InferenceRequest` schema in `src/dtos/request.ts` includes:

- Message validation with role and content (text or multimodal)
- Automatic system message injection if missing
- Temperature validation (0-2 range)
- Provider and model enum validation
- Image data URL validation for multimodal content
- Content length limits (200,000 characters)

## Provider Abstraction Pattern

The API uses a provider abstraction pattern to support multiple AI backends. This allows easy addition of new providers without changing route handlers.

### Base Provider Interface

All providers extend `InferenceProvider` from `src/services/providers/baseInferenceProvider.ts`:

```typescript
export abstract class InferenceProvider {
  constructor(protected inferenceConfig: InferenceParams) {}
  abstract runInference(request: InferenceRequestType): Promise<InferenceResponseType>;
}
```

### Provider Registry

Providers are registered in `src/services/inferenceService.ts`:

```typescript
const ProviderRegistry: Record<Provider, new (config: InferenceParams) => InferenceProvider> = {
  [Provider.GoogleAIStudio]: GoogleGenAIProvider,
};
```

### Adding a New Provider

1. Create a new provider class in `src/services/providers/` extending `InferenceProvider`
2. Implement the `runInference` method with provider-specific logic
3. Register the provider in `ProviderRegistry` in `inferenceService.ts`
4. Add the provider enum value to `src/enums/provider.ts`
5. Add supported models to `src/enums/model.ts`

## Coding Conventions

- Use **strict TypeScript** everywhere with proper type annotations
- **Variables:** Use `camelCase` for all variables and functions (e.g., `apiKey`, `runInference()`)
- **Enums:** Enum names in `PascalCase`, enum members in `CONSTANT_CASE` (e.g., `enum Provider { GoogleAIStudio = "google-ai-studio" }`)
- All API endpoints must use **`zValidator` middleware** for request validation
- Use **HTTPException** for structured error handling with appropriate status codes
- **Bearer authentication** required on all protected routes (`/api/v1/*`)
- **CORS middleware** must be configured first to handle preflight requests
- **Error handling:** Return appropriate HTTP status codes and structured error messages
- **Formatting:** Enforced by Biome (spaces, double quotes)
- **Route organization:** Keep route handlers modular and focused on single responsibilities
- **Service integration:** Use provider abstraction for AI service communication
- **No business logic in routes:** Routes should only validate and delegate to services

## Best Practices

- Always validate request data using Zod schemas before processing
- Always use DTO objects for data propagation during runtime
- Use proper HTTP status codes for different error scenarios
- Implement comprehensive error handling with meaningful error messages
- Keep route handlers focused and delegate business logic to services
- Use environment variables for configuration and secrets (never hardcode)
- Always run lint and format before committing (`make lint && make format`)
- Use Makefile for common tasks to ensure consistency
- Follow RESTful API design principles
- Implement proper CORS configuration for production
- Use compression middleware for better performance
- Set appropriate request body size limits
- Implement proper authentication flow with Bearer tokens
- Use retry logic for external API calls (see `src/utils/retry.ts`)
- Validate image data URLs before processing multimodal requests

## Authentication Flow

The API uses Bearer token authentication with the following flow:

1. **Token Configuration:** Bearer token is set via environment variable `BEARER_TOKEN` or Wrangler secret
2. **API Requests:** Clients include Bearer token in `Authorization: Bearer <token>` header
3. **Token Validation:** `hono/bearer-auth` middleware validates tokens on protected routes (`/api/v1/*`)
4. **API Key Resolution:** For AI provider API keys, the `apiKeyProvider` middleware resolves keys from:

   - Request body `apiKey` field (highest priority)
   - `X-API-Key` header
   - Environment variables (e.g., `GOOGLE_AI_STUDIO_API_KEY`)

## API Key Management

The `apiKeyProvider` middleware provides flexible API key resolution:

1. **Priority Order:**

   - Request body `apiKey` field
   - `X-API-Key` header
   - Environment variable (provider-specific, e.g., `GOOGLE_AI_STUDIO_API_KEY`)

2. **Environment Variable Naming:**

   - Format: `{PROVIDER}_API_KEY` (uppercase, underscores)
   - Example: `GOOGLE_AI_STUDIO_API_KEY`

3. **Configuration Injection:**

   - Resolved API key and configuration are injected into context via `c.set("AIProviderConfig", fullConfig)`
   - Routes can access via `c.get("AIProviderConfig")`

## Contribution

- Follow all coding conventions and rules
- Ensure all changes pass lint, format, and tests
- Update this documentation when adding new endpoints or functionality
- Use proper error handling and status codes
- Validate all request/response data with Zod schemas
- Follow RESTful API design principles
- Implement proper CORS configuration for new endpoints
- Add new providers by extending `InferenceProvider` base class
- Update provider registry when adding new providers
- Test multimodal requests with image data URLs
- Use retry logic for external API calls
