// src/components/HandsFreeVoiceSOS.js

import { useEffect, useRef } from "react";

/**
 * A non-visual component that listens for "help" or "sos" and triggers a callback.
 * It automatically stops listening after the first successful detection.
 * @param {object} props - The component props.
 * @param {Function} props.onSOS - The function to call when a keyword is detected.
 */
export default function HandsFreeVoiceSOS({ onSOS }) {
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.trim().toLowerCase();
      
      console.log("Heard:", transcript);

      if (transcript.includes("sos") || transcript.includes("help")) {
        console.log("SOS keyword detected! Triggering action and stopping listener.");
        
        // Key change: Stop recognition after a successful command
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        // Trigger the SOS function from the parent
        onSOS();
      }
    };

    // Key change: Do NOT restart onend, so it stops permanently after being told to.
    recognition.onend = () => {
      console.log("Speech recognition service has stopped.");
    };

    recognition.onerror = (event) => {
      // Ignore 'no-speech' error which happens if the user is silent.
      if (event.error !== 'no-speech') {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSOS]);

  return null; // This component does not render any UI
}