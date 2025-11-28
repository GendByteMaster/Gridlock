class SoundManager {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;

    constructor() {
        try {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.3; // Default volume
        } catch (e) {
            console.error('Web Audio API not supported');
        }
    }

    private createOscillator(type: OscillatorType, frequency: number, duration: number, volume: number = 1) {
        if (!this.context || !this.masterGain) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.context.currentTime);

        gain.gain.setValueAtTime(volume, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.context.currentTime + duration);
    }

    public playHover() {
        if (this.isMuted) return;
        // High pitch, short, sine wave
        this.createOscillator('sine', 400, 0.1, 0.1);
    }

    public playClick() {
        if (this.isMuted) return;
        // Crisp click
        this.createOscillator('triangle', 600, 0.1, 0.2);
    }

    public playMove() {
        if (this.isMuted) return;
        // Soft thud
        this.createOscillator('sine', 200, 0.2, 0.3);
    }

    public playSkillSelect() {
        if (this.isMuted) return;
        // Techy chirp
        this.createOscillator('square', 800, 0.15, 0.1);
    }

    public playSkillExecute() {
        if (this.isMuted) return;
        // Power up sound (simulated with slide)
        if (!this.context || !this.masterGain) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.linearRampToValueAtTime(600, this.context.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.context.currentTime + 0.3);
    }

    public playUnlock() {
        if (this.isMuted) return;
        // Success sound
        this.createOscillator('sine', 600, 0.1, 0.2);
        setTimeout(() => this.createOscillator('sine', 800, 0.2, 0.2), 100);
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
    }
}

export const soundManager = new SoundManager();
