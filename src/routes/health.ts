// src/routes/health.ts

import { Hono } from "hono";
import { HealthResponse } from "../dtos";

const health = new Hono();

health.get("/", (c) => {
	const response = { status: "API successfully started ☁️" };
	const parseResponse = HealthResponse.safeParse(response);
	return c.json(parseResponse);
});

export default health;
export type HealthRoute = typeof health;
