// src/enums/inference.ts

export enum Provider {
	GoogleAIStudio = "google-ai-studio",
}

export enum Model {
	Gemini25Flash = "gemini-2.5-flash",
	Gemini2Flash = "gemini-2.0-flash",
}

export enum ReasoningEffort {
	None = "none",
	Low = "low",
	Medium = "medium",
	High = "high",
}

export enum Timeout {
	Short = 10000,
	Medium = 50000,
	Long = 120000,
}
