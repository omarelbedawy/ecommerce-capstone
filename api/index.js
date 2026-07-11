// Vercel treats this file as a serverless function. Since our Express app
// (backend/src/app.js) already exports a plain app instance without calling
// .listen(), we can hand it straight to Vercel - it knows how to invoke an
// Express app per-request instead of running it as a long-lived server.
module.exports = require('../backend/src/app');
