/**
 * VendorUPI Soundbox Engine
 * Real UPI Soundbox style — instant chime + fast loud Hindi voice announcement.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// ─── Quick UPI Chime (short & punchy) ────────────────────────────────────────

const playChime = (): void => {
  try {
    const ctx = getAudioContext();
    const notes = [659.25, 783.99, 1046.5];  // E5 → G5 → C6 — ascending bright
    const dur = 0.13;
    const gap = 0.09;

    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * (dur + gap);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.7, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.06);
    });
  } catch (e) {
    console.warn('Chime error:', e);
  }
};

// ─── Soundbox Voice Announcer ─────────────────────────────────────────────────

/**
 * Speaks instantly like a real UPI soundbox.
 * Fast rate (1.6), full volume, deep pitch.
 * Tries Hindi voice first, falls back to any available voice.
 */
const speakInstant = (text: string): void => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // Stop any previous speech immediately

  const say = (voices: SpeechSynthesisVoice[]) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Priority: Hindi → English India → English male → any
    const hindiVoice   = voices.find(v => v.lang.startsWith('hi'));
    const enInVoice    = voices.find(v => v.lang === 'en-IN');
    const enMaleVoice  = voices.find(v => v.lang.startsWith('en') && /male/i.test(v.name));
    const anyVoice     = voices[0];

    utterance.voice  = hindiVoice ?? enInVoice ?? enMaleVoice ?? anyVoice ?? null;
    utterance.lang   = hindiVoice ? 'hi-IN' : 'en-IN';
    utterance.rate   = 1.55;   // Fast — real soundbox speed
    utterance.pitch  = 0.75;   // Deep bass — authoritative
    utterance.volume = 1.0;    // Maximum volume

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    say(voices);
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      say(window.speechSynthesis.getVoices());
    }, { once: true });
  }
};

// ─── Main Export: playPaymentSound ───────────────────────────────────────────

/**
 * Plays chime IMMEDIATELY, then speaks announcement right after (300ms).
 * Pass vendorName and optional amount for full soundbox-style announcement.
 */
export const playPaymentSound = (vendorName?: string, amount?: number | null): void => {
  playChime();

  // Build announcement text — short and punchy like real soundbox
  let announcement: string;
  if (amount && amount > 0) {
    announcement = `Payment received! ${amount} rupaye! ${vendorName ?? ''}`;
  } else {
    announcement = `Payment received! ${vendorName ?? 'Transaction'} ka paisa aa gaya!`;
  }

  // Speak almost immediately after chime starts (300ms delay)
  setTimeout(() => speakInstant(announcement), 300);
};

// ─── Utility sounds ──────────────────────────────────────────────────────────

export const playConfirmSound = (): void => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
  } catch (e) { /* silent */ }
};

export const playErrorSound = (): void => {
  try {
    const ctx = getAudioContext();
    [300, 250].forEach((freq, i) => {
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
  } catch (e) { /* silent */ }
};

export const speakHindiPayment = playPaymentSound;
