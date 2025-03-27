import { Hono } from "hono";
import postgres from "postgres";
import booksRouter from "./routes/books";
import bookRelatedRouter from "./routes/book-related";

const app = new Hono();

// Setup SQL client middleware
app.use("*", async (c, next) => {
  // Create SQL client
  const sql = postgres(c.env.HYPERDRIVE.connectionString, {
    max: 5,
    fetch_types: false,
  });

  c.env.SQL = sql;

  // Process the request
  await next();

  // Close the SQL connection after the response is sent
  c.executionCtx.waitUntil(sql.end());
});

app.route("/api/books", booksRouter);
app.route("/api/books/:id/related", bookRelatedRouter);

// Catch-all route for static assets
app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
};