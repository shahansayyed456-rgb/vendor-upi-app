/**
 * VendorUPI Sound Engine
 * Uses Web Audio API to generate a real-time "Payment Received" soundbox tone.
 * No external audio file needed — pure synthesized sound.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

/** Play a pleasant 3-tone "Payment Received" chime (like a UPI soundbox) */
export const playPaymentSound = (): void => {
  try {
    const ctx = getAudioContext();

    // 3-note ascending chime: C5 → E5 → G5
    const notes = [523.25, 659.25, 783.99];
    const noteDuration = 0.18;
    const gapBetween = 0.12;

    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * (noteDuration + gapBetween);

      // Oscillator (tone generator)
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime);

      // Volume envelope (fade in → sustain → fade out)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.45, startTime + 0.03);
      gainNode.gain.linearRampToValueAtTime(0.35, startTime + noteDuration * 0.6);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration + 0.05);

      // Add a slight reverb/warmth via a second detuned oscillator
      const oscillator2 = ctx.createOscillator();
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(freq * 2, startTime); // octave up
      const gainNode2 = ctx.createGain();
      gainNode2.gain.setValueAtTime(0, startTime);
      gainNode2.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration + 0.1);

      oscillator2.start(startTime);
      oscillator2.stop(startTime + noteDuration + 0.1);
    });

    // Final long triumphant note
    const finalTime = ctx.currentTime + notes.length * (noteDuration + gapBetween) + 0.05;
    const finalOsc = ctx.createOscillator();
    finalOsc.type = 'sine';
    finalOsc.frequency.setValueAtTime(1046.5, finalTime); // C6
    const finalGain = ctx.createGain();
    finalGain.gain.setValueAtTime(0, finalTime);
    finalGain.gain.linearRampToValueAtTime(0.4, finalTime + 0.04);
    finalGain.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.55);
    finalOsc.connect(finalGain);
    finalGain.connect(ctx.destination);
    finalOsc.start(finalTime);
    finalOsc.stop(finalTime + 0.6);

  } catch (err) {
    // Fail silently if Web Audio API is not supported
    console.warn('VendorUPI Sound: Web Audio API not supported', err);
  }
};

/** Short single-beep for UI confirmations (save, delete, etc.) */
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
