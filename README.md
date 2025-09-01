<p align="center">
  <img src="assets/thumbnail.png" alt="Bodyboard Thumbnail" height="150" />
</p>

# Supercharge Apple's Shortcuts using Cloudflare Worker and Gemini within minutes ☁️✨

[![Biome](https://img.shields.io/badge/lint-biome-blue?logo=biome)](https://biomejs.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/louisbrulenaudet/genai-api/badge.svg)](https://snyk.io/test/github/louisbrulenaudet/genai-api)
[![Zod](https://img.shields.io/badge/validation-zod-blueviolet?logo=zod)](https://github.com/colinhacks/zod)

This TypeScript API built with [Hono](https://hono.dev/), [OpenAI](https://openai.com/), and deployed as a Cloudflare Worker aims to boost the performance of Apple's Shortcuts by providing a seamless integration with generative AI capabilities, allowing users to create more powerful and intelligent shortcuts and leveraging the full potential of information extraction provided by the Apple ecosystem.

The objective of this repo is to provide a very simple and easy-to-use API for developers to integrate generative AI capabilities into their shortcuts in a minute. You just have to download this repository, slightly edit the configuration files, notably the `wrangler.jsonc` file, and run `make init` (eventually `make update`), then:

```bash
wrangler secret put GOOGLE_AI_STUDIO_API_KEY
````

Wrangler will prompt you to enter your API key, which will be securely stored as a secret environment variable in your Cloudflare Worker. If you don't have an API key yet, you can get one from the [Google AI Studio](https://aistudio.google.com/apikey).

Then, you need to put a bearer token for security reasons:

```bash
wrangler secret put BEARER_TOKEN
```

Once you have set up the secrets, you can deploy the API to Cloudflare Workers using:

```bash
make deploy
```

Here you go! Your API is now deployed and ready to use. You can test it by sending requests to the Cloudflare Workers URL provided in the output. The `completion` endpoint must be accessible pinging something like `https://your-cloudflare-worker-url.com/api/v1/completion`.

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

Apple provide a helpful guide [here](https://support.apple.com/fr-fr/guide/shortcuts/apd58d46713f/ios) that you can follow to create your first shortcut using API calls. Don't forget to put the `Authorization` header with your Bearer token in the request, without it the request will fail.

### Development

If you want to contribute to the development of this API or simply run it locally, you can follow these steps:

1. Clone the repository:

```sh
git clone https://github.com/louisbrulenaudet/genai-api.git
cd genai-api
```

2. Install dependencies:

```sh
make init
```

3. Set up environment variables in `.dev.vars`:

```sh
GOOGLE_AI_STUDIO_API_KEY=your_api_key
BEARER_TOKEN=your_bearer_token
AI_GATEWAY_BASE_URL=your_ai_gateway_base_url
```

4. Start the development server:

```sh
make dev
```

The API runs locally on port 8788.

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
