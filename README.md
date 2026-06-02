# devtinder_be

## Environment Variables

Required environment variables for deployment:

- `MONGO_URI` : MongoDB connection string
- `PORT` : optional, Render will provide this automatically
- `CLIENT_URL` : optional, frontend origin for CORS (defaults to `http://localhost:5173`)

On Render, set `MONGO_URI` in the service environment and let Render provide `PORT` automatically.

If Render still tries to run `node index.js`, this repository now includes a root `index.js` entrypoint that loads `src/app.js`.
For best results, set the Render service start command to `npm start` or `node src/app.js`.
