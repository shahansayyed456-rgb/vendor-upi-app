/**
 * VendorUPI Sound Engine
 * Uses Web Audio API (chime) + Web Speech API (Hindi TTS voice announcement)
 * No external audio file needed — 100% browser-native.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// ─── Hindi Voice Announcer (Web Speech API) ─────────────────────────────────

const PAYMENT_PHRASES = [
  'Paisa aa gaya bhai! Seedha bank mein!',
  'Payment received! Ek dum mast!',
  'Transaction successful! Bhai ka UPI kaam aaya!',
  'Paisa mil gaya! Direct account mein!',
  'Payment ho gaya boss! No commission, no cut!',
];

/**
 * Speak a Hindi payment announcement using browser TTS.
 * Tries to use a Hindi voice; falls back to default voice with Hindi text.
 */
export const speakHindiPayment = (vendorName?: string): void => {
  if (!('speechSynthesis' in window)) {
    console.warn('VendorUPI: Speech Synthesis not supported in this browser.');
    return;
  }

  // Cancel any currently speaking utterance
  window.speechSynthesis.cancel();

  const randomPhrase = PAYMENT_PHRASES[Math.floor(Math.random() * PAYMENT_PHRASES.length)];
  const text = vendorName
    ? `${vendorName}! ${randomPhrase}`
    : randomPhrase;

  const speak = (voiceList: SpeechSynthesisVoice[]) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a Hindi voice first
    const hindiVoice = voiceList.find(
      (v) => v.lang.startsWith('hi') || v.lang.startsWith('HI')
    );
    // Fallback to English with male preference for deeper voice
    const englishMaleVoice = voiceList.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
    );

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    } else if (englishMaleVoice) {
      utterance.voice = englishMaleVoice;
    }

    utterance.lang = hindiVoice ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.15;   // Slightly fast — Salman style confident!
    utterance.pitch = 0.82;  // Deeper, more masculine bass voice
    utterance.volume = 1.0;  // Full volume

    window.speechSynthesis.speak(utterance);
  };

  // Voices may not be loaded immediately — wait if needed
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    speak(voices);
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      speak(window.speechSynthesis.getVoices());
    };
  }
};

// ─── Chime Tone (Web Audio API) ──────────────────────────────────────────────

/** Play a 3-tone "Payment Received" chime (UPI soundbox style) */
export const playChime = (): void => {
  try {
    const ctx = getAudioContext();

    const notes = [523.25, 659.25, 783.99];
    const noteDuration = 0.16;
    const gapBetween = 0.10;

    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * (noteDuration + gapBetween);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.1);
    });

    // Final triumphant high note
    const finalTime = ctx.currentTime + notes.length * (noteDuration + gapBetween) + 0.04;
    const finalOsc = ctx.createOscillator();
    finalOsc.type = 'sine';
    finalOsc.frequency.setValueAtTime(1046.5, finalTime);
    const finalGain = ctx.createGain();
    finalGain.gain.setValueAtTime(0, finalTime);
    finalGain.gain.linearRampToValueAtTime(0.45, finalTime + 0.04);
    finalGain.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.5);
    finalOsc.connect(finalGain);
    finalGain.connect(ctx.destination);
    finalOsc.start(finalTime);
    finalOsc.stop(finalTime + 0.55);

  } catch (err) {
    console.warn('VendorUPI Chime: Web Audio API not supported', err);
  }
};

// ─── Combined Payment Sound (Chime + Voice) ──────────────────────────────────

/**
 * Main function: plays chime first, then speaks Hindi announcement.
 * Call this when QR is generated or payment simulation is triggered.
 */
export const playPaymentSound = (vendorName?: string): void => {
  playChime();
  // Slight delay so chime finishes before voice speaks
  setTimeout(() => {
    speakHindiPayment(vendorName);
  }, 800);
};

// ─── Utility Sounds ──────────────────────────────────────────────────────────

/** Short single-beep for UI confirmations */
export const playConfirmSound = (): void => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
  } catch (err) {
    console.warn('VendorUPI Sound: error', err);
  }
};

/** Error beep */
export const playErrorSound = (): void => {
  try {
    const ctx = getAudioContext();
    const notes = [300, 250];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.18;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  } catch (err) {
    console.warn('VendorUPI Sound: error', err);
  }
};
