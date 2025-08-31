# GenAI API Agent Instructions

## Project Overview

This repository provides a schema-driven TypeScript API for generative AI inference and completion, built with Hono and OpenAI, and deployed as a Cloudflare Worker. It exposes endpoints for model inference, completion, and health checks, with strict validation and environment-based configuration. All business logic should be implemented in external services that consume this API.

## Tech Stack

- **Language:** TypeScript (strict mode, ES2021/ES2022)
- **Framework:** Hono
- **AI Integration:** OpenAI API
- **Validation:** Zod
- **Deployment:** Cloudflare Workers (Wrangler)
- **Formatting/Linting:** Biome (spaces, double quotes, recommended rules)
- **Build Tools:** pnpm, Wrangler
- **Testing:** Vitest
- **Automation:** Makefile, pnpm scripts
- **Environment:** dotenv (.dev.vars, .prod.vars)

## Project Structure

```
.
├── src/
│   ├── index.ts                # API entry point
│   ├── routes/                 # API route handlers (completion, health)
│   ├── dtos/                   # Data transfer objects (inference, health)
│   ├── services/               # Service logic (inferenceService)
│   ├── middlewares/            # Middleware (inferenceProvider)
│   ├── enums/                  # Enums for types
│   ├── types/                  # Type definitions (hono.d.ts)
│   └── utils/                  # Utility functions (retry.ts)
├── Makefile                    # CLI automation for dev, deploy, format, lint, etc.
├── package.json                # Scripts, dependencies
├── tsconfig.json               # TypeScript config (strict, ES2021/ES2022)
├── wrangler.jsonc              # Cloudflare Worker config
├── .dev.vars/.prod.vars        # Environment variables
├── README.md                   # Usage and setup instructions
└── AGENTS.md                   # Agent instructions (this file)
```

## Development Workflow

1. **Install dependencies:**
   `make init`
2. **Configure environment:**
   Copy `.dev.vars.example` to `.dev.vars` and `.prod.vars.example` to `.prod.vars`, then edit as needed.
3. **Start development server:**
   `make dev`
4. **Format and lint:**
   `make format` and `make lint`
5. **Deploy:**
   `make deploy`
6. **Generate types:**
   `make types`
7. **Count lines of code:**
   `make cloc`

## Common Commands

| Command   | Description                                 |
|-----------|---------------------------------------------|
| `make init`      | Initialize the project                      |
| `make update`    | Update dependencies                         |
| `make dev`       | Run development server                      |
| `make deploy`    | Deploy the application                      |
| `make format`    | Format codebase with Biome                  |
| `make lint`      | Lint codebase with Biome                    |
| `make types`     | Generate TypeScript worker types            |
| `make cloc`      | Count lines of code in src/                 |

## Coding Conventions

- Use **strict TypeScript** everywhere.
- Use **Biome** for formatting and linting (spaces, double quotes).
- Use **Zod** for all validation.
- Use **dotenv** for environment configuration.
- No business logic in API endpoints or DTOs.
- Use Makefile for automation and consistency.

## Best Practices

- Keep code modular and type-safe.
- Store secrets and configuration in environment variables.
- Always run lint and format before committing.
- Use Makefile for common tasks.
- Update documentation and examples when API changes.
- Follow semantic versioning for releases.

## Contribution

- Follow all coding conventions and rules.
- Do not add business logic to API endpoints or DTOs.
- Ensure all changes pass lint, format, and tests.
- Document any API changes.
