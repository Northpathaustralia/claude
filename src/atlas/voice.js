// ---------------------------------------------------------------------------
// Voice foundation (Beta): push-to-talk speech-to-text and text-to-speech via
// the browser's Web Speech API. Real in Chrome/Edge/Safari; feature-detected
// everywhere. Wake word and always-listening modes are Planned (they need
// local wake-word detection we won't fake with an always-open microphone).
// A visible indicator is required whenever the mic is live — the UI enforces
// this by only listening while the mic button is engaged.
// ---------------------------------------------------------------------------

export function voiceSupport() {
  if (typeof window === 'undefined') return { stt: false, tts: false };
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return { stt: !!SR, tts: 'speechSynthesis' in window };
}

/**
 * Start push-to-talk recognition. Returns a controller with stop().
 * @param {object} opts {onResult(text, isFinal), onEnd(), onError(message)}
 */
export function startListening({ onResult, onEnd, onError, lang = 'en-AU' } = {}) {
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!SR) {
    if (onError) onError('Voice input is not supported in this browser. Chrome or Edge work best.');
    return { stop() {} };
  }
  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = true;

  let finalText = '';
  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i += 1) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    if (onResult) onResult((finalText + ' ' + interim).trim(), false);
  };
  rec.onerror = (e) => {
    if (onError) onError(e.error === 'not-allowed' ? 'Microphone access was blocked. Allow the microphone for this site and try again.' : `Voice error: ${e.error}`);
  };
  rec.onend = () => {
    if (onResult && finalText) onResult(finalText.trim(), true);
    if (onEnd) onEnd(finalText.trim());
  };
  rec.start();
  return {
    stop() {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}

/** Speak text aloud. Returns a controller with stop(). Strips markdown noise. */
export function speak(text, { rate = 1, onEnd } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return { stop() {} };
  const clean = String(text || '')
    .replace(/```[\s\S]*?```/g, ' Code block omitted. ')
    .replace(/[*#_`>|]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .slice(0, 4000);
  const utter = new SpeechSynthesisUtterance(clean);
  utter.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => /en-AU/i.test(v.lang)) || voices.find((v) => /en-GB|en-US/i.test(v.lang));
  if (preferred) utter.voice = preferred;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  return {
    stop() {
      window.speechSynthesis.cancel();
    },
  };
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}
