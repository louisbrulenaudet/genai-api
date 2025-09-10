// src/routes/health.ts

import { Hono } from "hono";
import { HealthResponse } from "../dtos";

const health = new Hono();

health.get("/", (c) => {
	const response = { status: "ok" };
	HealthResponse.safeParse(response);
	return c.json(response);
});

export default health;
export type HealthRoute = typeof health;
