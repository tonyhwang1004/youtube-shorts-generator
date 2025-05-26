// 🎵 AI 음성 효과 개선 시스템
class VoiceEffects {
    constructor() {
        this.audioContext = null;
        this.effects = {
            reverb: false,
            echo: false,
            robotVoice: false,
            speedControl: 1.0
        };
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎵 오디오 컨텍스트 초기화 완료');
        } catch (error) {
            console.error('❌ 오디오 컨텍스트 오류:', error);
        }
    }

    // 🤖 로봇 음성 효과
    applyRobotVoice(audioBuffer) {
        const source = this.audioContext.createBufferSource();
        const distortion = this.audioContext.createWaveShaper();
        
        // 로봇 음성을 위한 디스토션 커브
        const samples = 44100;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + 20) * x * 20 * Math.PI / 180) / (Math.PI + 20 * Math.abs(x));
        }
        
        distortion.curve = curve;
        distortion.oversample = '4x';
        
        source.buffer = audioBuffer;
        source.connect(distortion);
        
        return distortion;
    }

    // 🔄 음성 속도 조절
    adjustPlaybackRate(rate) {
        this.effects.speedControl = Math.max(0.5, Math.min(2.0, rate));
        console.log(`⚡ 재생 속도: ${this.effects.speedControl}x`);
    }

    // 🎭 다양한 음성 스타일
    getVoiceStyles() {
        return {
            natural: { rate: 1.0, pitch: 1.0, effect: 'none' },
            dramatic: { rate: 0.9, pitch: 0.8, effect: 'reverb' },
            energetic: { rate: 1.2, pitch: 1.1, effect: 'echo' },
            mysterious: { rate: 0.8, pitch: 0.7, effect: 'robotVoice' },
            professional: { rate: 1.0, pitch: 0.9, effect: 'none' }
        };
    }
}

// 전역 변수로 초기화
window.voiceEffects = new VoiceEffects();
