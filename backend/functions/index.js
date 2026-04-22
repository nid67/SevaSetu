const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/routes');
const { logger } = require('./utils/logger');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// API Routes
app.use('/api/v1', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled API Error', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stage: err.stage || 'api_routing'
  });
});

// For local testing without emulators
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}/api/v1`);
  });
}

exports.api = onRequest({ cors: true, maxInstances: 10 }, app);
