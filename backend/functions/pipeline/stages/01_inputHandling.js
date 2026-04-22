async function handleInput(currentCase, rawData) {
  return {
    ...currentCase,
    raw_input: rawData.content,
    input_type: rawData.input_type || 'text', // 'text', 'voice', 'image'
    flags: {
      needs_human_review: false,
      possible_duplicate: false
    }
  };
}
module.exports = handleInput;
