const crypto = require('crypto');

async function cleanData(currentCase) {
  // Normalize strings
  if (currentCase.structured_data.location.raw) {
    currentCase.structured_data.location.raw = currentCase.structured_data.location.raw.trim().toUpperCase();
  }

  // Lightweight Duplicate Hint (PS1 Level)
  // Create a basic hash of location and primary need to detect obvious duplicates
  const hashStr = `${currentCase.structured_data.location.raw}_${currentCase.structured_data.need.primary_need}`.toLowerCase();
  const duplicateHash = crypto.createHash('md5').update(hashStr).digest('hex');

  currentCase.metadata.duplicate_hash = duplicateHash;
  // This is a hint. Downstream modules or caching mechanisms could turn this flag to true.
  currentCase.flags.possible_duplicate = false; 

  return currentCase;
}

module.exports = cleanData;
