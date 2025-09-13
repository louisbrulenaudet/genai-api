#  Coding Agent Instructions for genai-api

## Project Overview

This repository implements a schema-driven TypeScript API for generative AI inference and completion, using Hono (web framework), Zod (validation), and OpenAI/Google GenAI as backends. It is designed for deployment as a Cloudflare Worker, exposing endpoints for model inference, completion, and health checks. All business logic is delegated to external services; the API is strictly a validation and routing layer.

## Architecture & Structure

- **src/index.ts**: API entry point, sets up Hono app and routes.
- **src/routes/**: Route handlers (e.g., `completion.ts`, `health.ts`). No business logic here—only request validation and delegation to services.
- **src/dtos/**: Data transfer objects for request/response schemas. Use Zod for all validation.
- **src/services/**: Service logic (e.g., `inferenceService.ts`), including provider abstractions for OpenAI and Google GenAI.
- **src/services/providers/**: Provider implementations (e.g., `googleGenAIProvider.ts`). Each provider extends `baseInferenceProvider.ts` and encapsulates API-specific logic.
- **src/middlewares/**: Middleware (e.g., `apiKeyProvider.ts`).
- **src/enums/**, **src/types/**: Centralized enums and type definitions.
- **src/utils/**: Utility functions (e.g., `retry.ts`, `imageUtils.ts`).

## Key Patterns & Conventions

- **Strict TypeScript**: All code is type-safe and uses strict mode. No business logic in routes or DTOs.
- **Validation**: All input/output is validated with Zod schemas in `src/dtos/`.
- **Provider Abstraction**: Add new AI providers by extending `baseInferenceProvider.ts` and registering in `inferenceService.ts`.
- **Environment Config**: Use `.dev.vars` and `.prod.vars` for secrets/configuration. Never hardcode secrets.
- **Formatting/Linting**: Use Biome (spaces, double quotes). Run `make format` and `make lint` before committing.
- **Automation**: Use the Makefile for all workflows (dev, deploy, format, lint, types, cloc). Example: `make dev` to start the dev server.
- **No Business Logic in API**: The API is a thin layer; all business logic must be implemented in external consumers.

## Developer Workflows

- **Install dependencies**: `make init`
- **Start dev server**: `make dev`
- **Format/lint**: `make format` / `make lint`
- **Deploy**: `make deploy`
- **Generate types**: `make types`
- **Count lines**: `make cloc`

## Integration Points

- **OpenAI/Google GenAI**: Providers in `src/services/providers/` handle API integration. See `googleGenAIProvider.ts` for request/response mapping.
- **Cloudflare Worker**: Configured via `wrangler.jsonc`.
- **Environment**: Managed via dotenv files and Makefile.

## Examples

- To add a new provider, create a class in `src/services/providers/` extending `baseInferenceProvider.ts`, then register it in `inferenceService.ts`.
- To add a new endpoint, create a route in `src/routes/`, validate with Zod DTOs, and delegate to a service.

---

For further details, see `README.md` and `AGENTS.md`. All changes must pass lint, format, and tests before merging.
