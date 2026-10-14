/**
 * Procedural Web Audio API sound synthesizer for authentic Bengali Durga Puja Dhaak beats & Kanshi.
 * Simulates:
 * - Deep resonant double-headed Dhaak drum stroke (Dhaa / Dhum)
 * - Sharp wooden stick rim strike (Tak)
 * - Kanshi / Kanshor metallic high brass bell strike (Ting)
 * - Auspicious Shankha (conch shell) tone
 */

class DhakAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentStep = 0;
  private masterGain: GainNode | null = null;
  private onStateChange?: (playing: boolean) => void;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setListener(cb: (playing: boolean) => void) {
    this.onStateChange = cb;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.playShankha(0.1); // Auspicious beginning conch tone
    this.scheduleLoop();
    this.onStateChange?.(true);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.onStateChange?.(false);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Classic festive Bengali Dhaak Rhythm Pattern (16 steps cycle at ~132 BPM):
   * Step: 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
   * Dhak: D  -  T  D  -  D  -  T  D  -  T  D  G  G  T  -
   * Kans: K  -  -  K  -  -  K  -  K  -  -  K  -  K  -  K
   */
  private scheduleLoop() {
    const stepDurationMs = 115; // ~130 BPM subdivision

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const step = this.currentStep % 16;

      // Authentic Bengali Dhaak Rhythm
      switch (step) {
        case 0:
          this.playDhaakBass(now, 1.0, 95);
          this.playKanshi(now, 0.7);
          break;
        case 2:
          this.playDhaakRim(now, 0.85);
          break;
        case 3:
          this.playDhaakBass(now, 0.8, 105);
          this.playKanshi(now, 0.65);
          break;
        case 5:
          this.playDhaakBass(now, 0.9, 90);
          break;
        case 6:
          this.playKanshi(now, 0.8);
          break;
        case 7:
          this.playDhaakRim(now, 0.9);
          break;
        case 8:
          this.playDhaakBass(now, 1.0, 95);
          this.playKanshi(now, 0.75);
          break;
        case 10:
          this.playDhaakRim(now, 0.8);
          break;
        case 11:
          this.playDhaakBass(now, 0.75, 110);
          this.playKanshi(now, 0.7);
          break;
        case 12:
          // Rolling feather double hit ("Gur-gur")
          this.playDhaakRoll(now, 0.6);
          break;
        case 13:
          this.playDhaakRoll(now, 0.75);
          this.playKanshi(now, 0.85);
          break;
        case 14:
          this.playDhaakRim(now, 0.95);
          break;
        case 15:
          this.playKanshi(now, 0.6);
          break;
      }

      // Shankha drone every 64 steps (approx every 8 seconds)
      if (this.currentStep > 0 && this.currentStep % 64 === 0) {
        this.playShankha(0.2);
      }

      this.currentStep++;
    }, stepDurationMs);
  }

  // Deep booming Dhaak drumhead sound
  private playDhaakBass(time: number, velocity: number, pitch = 95) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Natural drum membrane pitch drop
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch * 1.6, time);
    osc.frequency.exponentialRampToValueAtTime(pitch, time + 0.08);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.35);

    // Warm gain envelope
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(velocity * 0.9, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    // Sub-harmonic body
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(pitch * 0.75, time);
    subOsc.frequency.exponentialRampToValueAtTime(30, time + 0.28);
    subGain.gain.setValueAtTime(velocity * 0.45, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    subOsc.connect(subGain);
    gain.connect(this.masterGain);
    subGain.connect(this.masterGain);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + 0.38);
    subOsc.stop(time + 0.3);
  }

  // Sharp wooden stick rim strike (Tak)
  private playDhaakRim(time: number, velocity: number) {
    if (!this.ctx || !this.masterGain) return;

    // Filtered noise click + high pitch tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.05);

    gain.gain.setValueAtTime(velocity * 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.07);
  }

  // Double roll rapid hit
  private playDhaakRoll(time: number, velocity: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.08);

    gain.gain.setValueAtTime(velocity * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.09);
  }

  // Metallic brass Kanshi strike (Ting)
  private playKanshi(time: number, velocity: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Inharmonic bell ratios for bronze plate
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1480, time);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2340, time);

    gain.gain.setValueAtTime(velocity * 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.5);
    osc2.stop(time + 0.5);
  }

  // Auspicious conch shell (Shankha) tone
  private playShankha(volume = 0.2) {
    if (!this.ctx || !this.masterGain) return;

    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc2.type = 'triangle';
    // Shankha pitch swell
    osc.frequency.setValueAtTime(420, time);
    osc.frequency.linearRampToValueAtTime(460, time + 0.6);
    osc.frequency.linearRampToValueAtTime(435, time + 1.8);

    osc2.frequency.setValueAtTime(840, time);
    osc2.frequency.linearRampToValueAtTime(920, time + 0.6);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(volume * 0.4, time + 0.4);
    gain.gain.linearRampToValueAtTime(volume * 0.35, time + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 2.0);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + 2.1);
    osc2.stop(time + 2.1);
  }
}

export const dhakAudio = new DhakAudioEngine();
