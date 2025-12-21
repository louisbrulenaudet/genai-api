// src/routes/health.ts

import { Hono } from "hono";
import { HealthResponseSchema } from "../dtos";

const health = new Hono();

health.get("/", (c) => {
  const response = { status: "API successfully started ☁️" };
  const parseResponse = HealthResponseSchema.safeParse(response);
  return c.json(parseResponse);
});

export default health;
export type HealthRoute = typeof health;
