class PipelineError extends Error {
  constructor(stage, message, originalError = null) {
    super(message);
    this.name = 'PipelineError';
    this.stage = stage;
    this.originalError = originalError;
  }
}

module.exports = { PipelineError };
