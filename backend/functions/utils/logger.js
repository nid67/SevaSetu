const functions = require('firebase-functions/v2');

const logger = {
  info: (message, data = {}) => {
    functions.logger.info(message, { structuredData: true, ...data });
  },
  error: (message, error = {}, data = {}) => {
    functions.logger.error(message, { 
      structuredData: true, 
      error: error.message || error, 
      stack: error.stack,
      ...data 
    });
  },
  warn: (message, data = {}) => {
    functions.logger.warn(message, { structuredData: true, ...data });
  }
};

module.exports = { logger };
