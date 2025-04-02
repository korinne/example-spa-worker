# React + React Router 7 + Vite + Hyperdrive on Workers

This is a simple React SPA using React Router 7 for client-side navigation (using declarative routing), along with the @cloudflare/vite-plugin and Workers static assets. On the backend, this uses Hono to define API routes in a Worker, and the API can connect to a PostgreSQL database through Hyperdrive. Smart Placement is enabled.

## Deployment Options

This application can be deployed in two ways:

### Option 1: With Database (Full Experience)

1. Run `npm i`
2. Sign up for a PostgreSQL provider like [Neon](https://neon.tech) and create a database
3. Input the SQL script (/init.sql) into SQL editor
4. Create a Hyperdrive connection by running:
   ```
   npx wrangler hyperdrive create <YOUR_CONFIG_NAME> --connection-string="<postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name>"
   ```
5. Uncomment and update the Hyperdrive binding in `wrangler.jsonc` with the ID from step 4:
   ```json
   "hyperdrive": [
     {
       "binding": "HYPERDRIVE",
       "id": "YOUR_HYPERDRIVE_ID",
       "localConnectionString": "postgresql://myuser:mypassword@localhost:5432/mydatabase"
     }
   ]
   ```
6. Deploy with `npm run deploy`

### Option 2: Without Database (Demo Mode)

1. Run `npm i`
2. Keep the Hyperdrive binding commented out in `wrangler.jsonc` (this is the default)
3. Deploy with `npm run deploy`
4. The app will automatically use mock data instead of a real database

## Running Locally

To run locally, you can use the Docker container defined in the docker compose:

1. `docker-compose up -d`
   - Creates container with PostgreSQL and seeds it with the "init.sql" data
2. `npm run dev`

If you update the "init.sql" file, make sure to run `docker-compose down -v` to teardown.

## Resources

- https://neon.tech/docs/guides/cloudflare-workers
- https://www.npmjs.com/package/@cloudflare/vite-plugin
- https://developers.cloudflare.com/hyperdrive/get-started/
