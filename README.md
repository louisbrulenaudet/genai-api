<p align="center">
  <img src="assets/thumbnail.png" alt="Bodyboard Thumbnail" height="150" />
</p>

# Supercharge Apple's Shortcuts using Cloudflare Worker and Gemini in a minute ☁️✨

[![Biome](https://img.shields.io/badge/lint-biome-blue?logo=biome)](https://biomejs.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/louisbrulenaudet/genai-api/badge.svg)](https://snyk.io/test/github/louisbrulenaudet/genai-api)
[![Zod](https://img.shields.io/badge/validation-zod-blueviolet?logo=zod)](https://github.com/colinhacks/zod)

This TypeScript API built with [Hono](https://hono.dev/), [OpenAI](https://openai.com/), and deployed as a Cloudflare Worker aims to boost the performance of Apple's Shortcuts by providing a seamless integration with generative AI capabilities, allowing users to create more powerful and intelligent shortcuts and leveraging the full potential of information extraction provided by the Apple ecosystem.

The objective of this repo is to provide a very simple and easy-to-use API for developers to integrate generative AI capabilities into their shortcuts in a minute. You just have to download this repository, slightly edit the configuration files, notably the `wrangler.jsonc` file, and run `make init` (eventually `make update`), then:

```bash
wrangler secret put GOOGLE_AI_STUDIO_API_KEY
````

Wrangler will prompt you to enter your API key, which will be securely stored as a secret environment variable in your Cloudflare Worker.

Then, you need to put a bearer token for security reasons:

```bash
wrangler secret put BEARER_TOKEN
```

Once you have set up the secrets, you can deploy the API to Cloudflare Workers using:

```bash
make deploy
```

Here you go! Your API is now deployed and ready to use. You can test it by sending requests to the Cloudflare Workers URL provided in the output.

## API Usage

Send a POST request to `/completion` with a JSON body:

```http
POST /completion
Content-Type: application/json

{
  "input": "What is the capital of France?",
  "system": "You are a helpful assistant.",
  "temperature": 0.7,
  "model": "gemini-2.0-flash"
}
```

- `input` (string, required): The user prompt.
- `system` (string, optional): System prompt for context.
- `temperature` (number, optional): Sampling temperature (default 0.2).
- `model` (string, optional): Model name (e.g., "gemini-2.0-flash").

The response will be plain text with the model's completion.

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

## Feedback
If you have any feedback, please reach out at [louisbrulenaudet@icloud.com](mailto:louisbrulenaudet@icloud.com).
