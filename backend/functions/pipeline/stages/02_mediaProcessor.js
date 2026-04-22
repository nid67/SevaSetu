async function processMedia(currentCase) {
  // In a full implementation, we would integrate Google Cloud Speech-to-Text for 'voice'
  // and Google Cloud Vision API for 'image' (OCR).
  
  let formattedInput = currentCase.raw_input;

  if (currentCase.input_type === 'voice') {
    formattedInput = `[Transcribed Voice] ${currentCase.raw_input}`;
  } else if (currentCase.input_type === 'image') {
    formattedInput = `[OCR Extracted Text] ${currentCase.raw_input}`;
  }

  return {
    ...currentCase,
    formatted_input: formattedInput
  };
}
module.exports = processMedia;
