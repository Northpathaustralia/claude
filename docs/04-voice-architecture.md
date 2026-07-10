# ATLAS ONE — Voice Architecture

## Today (Beta, shipped)

Built on the browser Web Speech API — real, key-free, nothing uploaded to our own servers (Chromium may use its speech service; noted in the security report).

- **Push-to-talk input:** mic button in chat; live interim transcript fills the composer; visible red pulsing indicator whenever the microphone is open; click again to stop. James reviews the text before sending — nothing auto-sends.
- **Read-aloud:** per-message Speak buttons, an opt-in "read replies aloud" toggle, and a spoken morning briefing (en-AU voice preferred). Markdown noise is stripped before synthesis; code blocks are skipped aloud.
- **Emergency stop:** the chat Stop button aborts generation *and* cancels speech; stopping the mic is one click. Feature-detection hides voice controls on unsupported browsers instead of pretending.

## Design rules (already enforced)

1. A visible indicator whenever listening is active — the mic only listens while the button is engaged; there is no background listening path in the codebase.
2. Never secretly record: no audio is stored; only the transcript enters the composer, under the user's eyes.
3. Voice replies are opt-in per setting, not default.

## Roadmap

| Phase | Capability | Approach |
|---|---|---|
| V1.1 | Auto-send on end-of-speech + "quiet mode" (speak → text-only reply) | Web Speech `onend` + setting |
| V1.2 | Wake word "Hey Atlas" | Local wake-word engine (e.g. Porcupine WASM) so audio never leaves the device; explicit enable + persistent on-screen indicator |
| V1.2 | Premium natural voices with tone presets (Calm/Professional/Executive…) | Provider TTS (e.g. OpenAI/ElevenLabs) behind the same adapter pattern as chat providers; requires a key; clearly labelled |
| V2 | Continuous conversation with interruption (barge-in) | Streaming STT + TTS with echo cancellation; Atlas stops speaking on voice activity and re-plans from the interruption |
| V2 | Car/headphone/lock-screen modes | Cloud/native apps phase |
| Optional | Voice cloning | Disabled by default; explicit consent + ownership confirmation + deletion path + synthetic-voice labelling, exactly per directive |

Interruption contract (V2): user speech during synthesis → cancel TTS within 150 ms → transcribe → append as steering to the in-flight turn (abort + rerun with updated instruction).
