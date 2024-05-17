// VoiceToText.js

// Check if webkitSpeechRecognition is supported by the browser
const recognition = window.webkitSpeechRecognition || null;

let recognitionInstance = null;

if (recognition) {
  // Initialize the speech recognition object
  recognitionInstance = new recognition();
  recognitionInstance.continuous = true;
  recognitionInstance.interimResults = true;
  recognitionInstance.lang = "hi-IN";
} else {
  console.error("Speech recognition not supported by this browser.");
}

// Export the initialized recognition instance or null if not supported
export default recognitionInstance;
