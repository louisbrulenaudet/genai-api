# genai-api

A TypeScript API for generative AI, built with [Hono](https://hono.dev/), [OpenAI](https://openai.com/), and deployed as a Cloudflare Worker.

## Features

- Fast, lightweight API using Hono
- OpenAI integration for inference/completion
- Zod-based validation
- Cloudflare Worker deployment via Wrangler
- Environment-based configuration
- Makefile-driven development workflow

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/)
- Node.js >= 18
- Cloudflare account (for deployment)

### Installation

```sh
make init
```

### Environment Variables

Copy and edit the example files:

```sh
cp .dev.vars.example .dev.vars
cp .prod.vars.example .prod.vars
```

Edit `.dev.vars` and `.prod.vars` to set your API keys and configuration.

### Development

Start the development server:

```sh
make dev
```

The API runs locally on port 8788.

### Deployment

Deploy to Cloudflare Workers:

```sh
make deploy
```

## Makefile Commands

| Command   | Description                                 |
|-----------|---------------------------------------------|
| init      | Initialize the project                      |
| update    | Update dependencies                         |
| dev       | Run development server                      |
| deploy    | Deploy the application                      |
| format    | Format codebase with Biome                  |
| lint      | Lint codebase with Biome                    |
| types     | Generate TypeScript worker types            |
| cloc      | Count lines of code in src/                 |

## License

See [LICENSE](LICENSE).

## Contributing

Pull requests and issues are welcome!
