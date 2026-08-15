import { createMiddleware } from "@mswjs/http-middleware";
import cors from "cors";
import express from "express";
import { HttpResponse, http } from "msw";

import { handlers } from "./handlers.mock";
import {
  MOCK_SESSION_TOKEN,
  SESSION_COOKIE,
  SIGNED_OUT_COOKIE,
} from "./session.mock";

const PORT = Number(process.env.MOCK_API_PORT ?? 4000);
const FRONTEND_ORIGIN =
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  const cookies = req.headers.cookie ?? "";
  const signedOut = cookies.includes(`${SIGNED_OUT_COOKIE}=1`);
  const hasSession = cookies.includes(`${SESSION_COOKIE}=`);

  if (!signedOut && !hasSession) {
    res.append(
      "Set-Cookie",
      `${SESSION_COOKIE}=${MOCK_SESSION_TOKEN}; Path=/; Max-Age=31536000; SameSite=Lax`
    );
  }
  next();
});

const unhandled = http.all(/.*/, ({ request }) => {
  const { pathname } = new URL(request.url);
  console.warn(`[mock-api] UNHANDLED  ${request.method} ${pathname}`);
  console.warn("           → add a handler in src/mocks/handlers.mock.ts");

  return HttpResponse.json(
    {
      error: `No mock handler for ${request.method} ${pathname}. Add one in src/mocks/handlers.mock.ts — contributions welcome.`,
      statusCode: 501,
      timestamp: new Date().toISOString(),
    },
    { status: 501 }
  );
});

app.use(createMiddleware(...handlers, unhandled));

app.use((req, res) => {
  console.warn(`[mock-api] UNHANDLED  ${req.method} ${req.originalUrl}`);
  console.warn("           → add a handler in src/mocks/handlers.mock.ts");

  res.status(501).json({
    error: `No mock handler for ${req.method} ${req.path}. Add one in src/mocks/handlers.mock.ts — contributions welcome.`,
    statusCode: 501,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.info(`[mock-api] listening on http://localhost:${PORT}`);
  console.info(
    `[mock-api] ${handlers.length} handlers from src/mocks/handlers.mock.ts`
  );
  console.info("[mock-api] unhandled routes are logged here and return 501");
});
