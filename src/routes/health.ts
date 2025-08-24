// src/routes/health.ts

import { Hono } from "hono";
import { HealthResponse } from "../dtos/health";

const health = new Hono();

health.get("/", (c) => {
	const response = { status: "ok" };
	HealthResponse.parse(response);
	return c.json(response);
});

export default health;
export type HealthRoute = typeof health;
