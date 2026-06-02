# devtinder_be

## Environment Variables

Required environment variables for deployment:

- `MONGO_URI` : MongoDB connection string
- `PORT` : optional, Render will provide this automatically
- `CLIENT_URL` : optional, frontend origin for CORS (defaults to `http://localhost:5173`)

On Render, set `MONGO_URI` in the service environment and let Render provide `PORT` automatically.
