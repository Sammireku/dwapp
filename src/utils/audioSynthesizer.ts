/**
 * Web Audio API ambient sound generator and Gemini 24kHz PCM Audio player
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentMode: 'off' | 'rain' | 'lullaby' | 'crickets' = 'off';
  private gainNode: GainNode | null = null;
  private intervalId: any = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playMode(mode: 'off' | 'rain' | 'lullaby' | 'crickets') {
    this.stop();
    if (mode === 'off') return;

    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentMode = mode;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (mode === 'rain') {
      this.startRain();
    } else if (mode === 'lullaby') {
      this.startLullaby();
    } else if (mode === 'crickets') {
      this.startCrickets();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentMode = 'off';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private startRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();
  }

  private startLullaby() {
    if (!this.ctx || !this.gainNode) return;
    // Simple calming pentatonic chime sequence
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
    let step = 0;

    this.intervalId = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const freq = notes[step % notes.length];
      step++;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.0);
    }, 1800);
  }

  private startCrickets() {
    if (!this.ctx || !this.gainNode) return;
    this.intervalId = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(4500, this.ctx.currentTime);

      cGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      cGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(cGain);
      cGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }, 600);
  }
}

export const ambientSound = new AmbientSoundEngine();

/**
 * Play PCM 24kHz Base64 audio returned by Gemini TTS
 */
export async function playPcmBase64(base64Audio: string): Promise<AudioBufferSourceNode> {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioCtx({ sampleRate: 24000 });

  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert 16-bit PCM little-endian to Float32
  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 32768.0;
  }

  const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
  audioBuffer.getChannelData(0).set(float32);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();

  return source;
}
