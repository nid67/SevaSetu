async function handleInput(currentCase, rawData) {
  return {
    ...currentCase,
    raw_input: rawData.content,
    input_type: rawData.input_type || 'text', // 'text', 'voice', 'image'
    media_base64: rawData.media_base64,
    mime_type: rawData.mime_type,
    flags: {
      needs_human_review: false,
      possible_duplicate: false
    }
  };
}
module.exports = handleInput;
