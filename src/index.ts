// src/index.ts

import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";
import completionRoute from "./routes/completion";
import healthRoute from "./routes/health";

const api = new Hono()
	.route("/health", healthRoute)
	.route("/completion", completionRoute);

api
	.use("*", async (c, next) => {
		const origin = c.req.header("origin");
		// TODO: Replace this with a whitelist for production
		if (origin) {
			c.res.headers.set("Access-Control-Allow-Origin", origin);
		}
		c.res.headers.set("Access-Control-Allow-Credentials", "true");
		c.res.headers.set("Access-Control-Allow-Methods", "GET, POST");
		c.res.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		);
		if (c.req.method === "OPTIONS") {
			return c.body(null, 204);
		}
		c.env = {
			...(c.env || {}),
			...process.env,
		};
		await next();
	})
	.use(prettyJSON())
	.use(compress());

const app = new Hono<{ Bindings: Env }>().route("/api/v1", api);

app.use(
	bodyLimit({
		maxSize: 10000 * 1024, // 10mb
		onError: (c) => {
			return c.text("overflow :(", 413);
		},
	}),
);

app.onError((error, c) => {
	console.error(error);
	if (error instanceof HTTPException) {
		return c.json(
			{
				message: error.message,
			},
			error.status,
		);
	}

	return c.json(
		{
			message: "Something went wrong",
		},
		500,
	);
});

export default app;
