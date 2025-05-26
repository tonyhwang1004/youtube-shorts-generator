// 텍스트 음성 변환 고급 기능
class TextToSpeechEngine {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.audioContext = null;
        this.loadVoices();
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        if (this.voices.length === 0) {
            this.synthesis.addEventListener('voiceschanged', () => {
                this.voices = this.synthesis.getVoices();
            });
        }
    }

    getKoreanVoices() {
        return this.voices.filter(voice => 
            voice.lang.includes('ko') || voice.lang.includes('KR')
        );
    }

    async speak(text, options = {}) {
        const defaultOptions = {
            rate: 1,
            pitch: 1,
            volume: 1,
            voice: null,
            onEnd: null,
            onError: null
        };

        const settings = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            this.currentUtterance = new SpeechSynthesisUtterance(text);
            
            // 음성 설정
            this.currentUtterance.rate = settings.rate;
            this.currentUtterance.pitch = settings.pitch;
            this.currentUtterance.volume = settings.volume;
            this.currentUtterance.lang = 'ko-KR';

            // 한국어 음성이 있으면 사용
            const koreanVoices = this.getKoreanVoices();
            if (koreanVoices.length > 0) {
                this.currentUtterance.voice = koreanVoices[0];
            }

            // 이벤트 핸들러
            this.currentUtterance.onend = () => {
                if (settings.onEnd) settings.onEnd();
                resolve();
            };

            this.currentUtterance.onerror = (error) => {
                if (settings.onError) settings.onError(error);
                reject(error);
            };

            // 음성 재생
            this.synthesis.speak(this.currentUtterance);
        });
    }

    stop() {
        this.synthesis.cancel();
    }

    pause() {
        this.synthesis.pause();
    }

    resume() {
        this.synthesis.resume();
    }

    // 텍스트를 문장 단위로 분할하여 타이밍 생성
    generateTimings(text, wordsPerMinute = 150) {
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
        const timings = [];
        let currentTime = 0;

        sentences.forEach(sentence => {
            const words = sentence.trim().split(' ').length;
            const duration = (words / wordsPerMinute) * 60; // 초 단위
            
            timings.push({
                text: sentence.trim(),
                startTime: currentTime,
                duration: duration,
                endTime: currentTime + duration
            });
            
            currentTime += duration;
        });

        return timings;
    }

    // SSML (Speech Synthesis Markup Language) 지원
    createSSML(text, options = {}) {
        const {
            emphasis = 'moderate',
            pauseTime = '0.5s',
            prosody = {}
        } = options;

        let ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR">`;
        
        if (prosody.rate || prosody.pitch || prosody.volume) {
            ssml += `<prosody`;
            if (prosody.rate) ssml += ` rate="${prosody.rate}"`;
            if (prosody.pitch) ssml += ` pitch="${prosody.pitch}"`;
            if (prosody.volume) ssml += ` volume="${prosody.volume}"`;
            ssml += `>`;
        }

        // 문장 사이에 적절한 휴지 추가
        const sentences = text.split(/([.!?])/).filter(s => s.trim().length > 0);
        for (let i = 0; i < sentences.length; i += 2) {
            const sentence = sentences[i];
            const punctuation = sentences[i + 1] || '';
            
            ssml += `<emphasis level="${emphasis}">${sentence}${punctuation}</emphasis>`;
            
            if (punctuation && i < sentences.length - 2) {
                ssml += `<break time="${pauseTime}"/>`;
            }
        }

        if (prosody.rate || prosody.pitch || prosody.volume) {
            ssml += `</prosody>`;
        }

        ssml += `</speak>`;
        return ssml;
    }

    // 감정 분석 기반 음성 조정
    adjustVoiceByEmotion(emotion) {
        const emotionSettings = {
            excited: { rate: 1.2, pitch: 1.1, volume: 0.9 },
            calm: { rate: 0.9, pitch: 0.9, volume: 0.8 },
            dramatic: { rate: 0.8, pitch: 0.8, volume: 1.0 },
            happy: { rate: 1.1, pitch: 1.0, volume: 0.9 },
            serious: { rate: 0.9, pitch: 0.9, volume: 0.8 }
        };

        return emotionSettings[emotion] || emotionSettings.calm;
    }

    // 오디오 레코딩 및 저장
    async recordSpeech(text, options = {}) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // MediaRecorder를 사용한 오디오 캡처
        const dest = this.audioContext.createMediaStreamDestination();
        const recorder = new MediaRecorder(dest.stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        return new Promise((resolve, reject) => {
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                resolve({ blob, url });
            };

            recorder.start();
            
            this.speak(text, {
                ...options,
                onEnd: () => {
                    setTimeout(() => recorder.stop(), 500);
                },
                onError: reject
            });
        });
    }

    // 음성 품질 개선
    enhanceAudioQuality(audioBlob) {
        return new Promise((resolve) => {
            // 실제로는 Web Audio API를 사용해 노이즈 제거, 정규화 등 수행
            // 여기서는 시뮬레이션
            setTimeout(() => {
                resolve(audioBlob);
            }, 500);
        });
    }

    // 여러 문장을 연속으로 읽기
    async speakMultiple(sentences, options = {}) {
        const results = [];
        
        for (const sentence of sentences) {
            try {
                const result = await this.speak(sentence, options);
                results.push(result);
                
                // 문장 간 짧은 휴식
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.error('음성 생성 오류:', error);
                results.push(null);
            }
        }
        
        return results;
    }

    // 음성 미리보기
    previewVoice(text, voiceIndex = 0) {
        const availableVoices = this.getKoreanVoices();
        if (availableVoices.length === 0) {
            console.warn('한국어 음성을 찾을 수 없습니다.');
            return;
        }

        const voice = availableVoices[voiceIndex] || availableVoices[0];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        this.synthesis.speak(utterance);
    }

    // 사용 가능한 음성 목록 가져오기
    getAvailableVoices() {
        return this.getKoreanVoices().map((voice, index) => ({
            index: index,
            name: voice.name,
            lang: voice.lang,
            gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male'
        }));
    }
}

// 전역으로 사용할 수 있도록 export
window.TextToSpeechEngine = TextToSpeechEngine;
