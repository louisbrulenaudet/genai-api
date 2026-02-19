install: ## Initialize the project
	@echo "🔧 Initializing the project..."
	pnpm install

update: ## Update dependencies to their latest versions
	@echo "🔄 Updating dependencies..."
	pnpm update

check: ## Check the codebase for issues
	@echo "🔍 Checking codebase..."
	pnpm run check

dev: ## Run development server with hot reloading and local database
	@echo "💻 Starting development server..."
	pnpm run dev

login: ## Login to Cloudflare
	@echo "🔑 Logging in to Cloudflare..."
	pnpm wrangler login
	@echo "✅ Cloudflare logged in"
	
deploy: ## Deploy the application globally
	@echo "🚀 Deploying to global network..."
	pnpm run deploy

format: ## Format the codebase using Biome
	@echo "📝 Formatting code..."
	pnpm run format

lint: ## Lint the codebase using Biome
	@echo "🔍 Running code analysis..."
	pnpm run lint

types: ## Creating worker-configuration.d.ts file for TypeScript types
	@echo "📄 Generating TypeScript types..."
	pnpm wrangler types

cloc: ## Count lines of code in the source directory
	@echo "📊 Counting lines of code..."
	pnpm cloc src
