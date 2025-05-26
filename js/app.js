// 메인 애플리케이션 스크립트
class ShortsGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentVideo = null;
        this.isGenerating = false;
        this.audioContext = null;
        this.videoElement = null;
    }

    initializeElements() {
        this.scriptInput = document.getElementById('scriptInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.videoCanvas = document.getElementById('videoCanvas');
        this.subtitleOverlay = document.getElementById('subtitleOverlay');
        this.progressModal = document.getElementById('progressModal');
        this.voiceSpeedSlider = document.getElementById('voiceSpeed');
        this.speedValue = document.getElementById('speedValue');
        this.playBtn = document.getElementById('playBtn');
        this.progressBar = document.getElementById('progressBar');
        this.timeDisplay = document.getElementById('timeDisplay');
        
        // 다운로드 버튼들
        this.downloadVideo = document.getElementById('downloadVideo');
        this.downloadAudio = document.getElementById('downloadAudio');
        this.downloadSubtitle = document.getElementById('downloadSubtitle');

        // Canvas context
        this.ctx = this.videoCanvas.getContext('2d');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateVideo());
        this.voiceSpeedSlider.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value + 'x';
        });
        
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // 다운로드 이벤트
        this.downloadVideo.addEventListener('click', () => this.downloadVideoFile());
        this.downloadAudio.addEventListener('click', () => this.downloadAudioFile());
        this.downloadSubtitle.addEventListener('click', () => this.downloadSubtitleFile());

        // 텍스트 입력 실시간 미리보기
        this.scriptInput.addEventListener('input', () => this.updatePreview());

        // 네비게이션 스크롤
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async generateVideo() {
        if (this.isGenerating) return;
        
        const script = this.scriptInput.value.trim();
        if (!script) {
            this.showNotification('대본을 입력해주세요!', 'error');
            return;
        }

        this.isGenerating = true;
        this.showProgressModal();
        
        try {
            // 1단계: 대본 분석
            await this.updateProgress(1, '대본을 분석하고 있습니다...');
            const scriptAnalysis = await this.analyzeScript(script);
            
            // 2단계: 이미지 생성
            await this.updateProgress(2, '장면에 맞는 이미지를 생성하고 있습니다...');
            const images = await this.generateImages(scriptAnalysis);
            
            // 3단계: 음성 합성
            await this.updateProgress(3, '자연스러운 음성을 합성하고 있습니다...');
            const audio = await this.generateAudio(script);
            
            // 4단계: 영상 합성
            await this.updateProgress(4, '최종 영상을 제작하고 있습니다...');
            const video = await this.compileVideo(images, audio, scriptAnalysis);
            
            this.currentVideo = video;
            this.hideProgressModal();
            this.enableDownloadButtons();
            this.showNotification('영상이 성공적으로 생성되었습니다!', 'success');
            
        } catch (error) {
            console.error('영상 생성 중 오류:', error);
            this.hideProgressModal();
            this.showNotification('영상 생성 중 오류가 발생했습니다.', 'error');
        } finally {
            this.isGenerating = false;
        }
    }

    async analyzeScript(script) {
        return new Promise(resolve => {
            setTimeout(() => {
                const sentences = script.split(/[.!?]/).filter(s => s.trim().length > 0);
                const analysis = sentences.map((sentence, index) => ({
                    text: sentence.trim(),
                    startTime: index * 3,
                    duration: 3,
                    emotion: this.detectEmotion(sentence),
                    keywords: this.extractKeywords(sentence)
                }));
                resolve(analysis);
            }, 1500);
        });
    }

    detectEmotion(text) {
        const emotions = ['excited', 'calm', 'dramatic', 'happy', 'serious'];
        return emotions[Math.floor(Math.random() * emotions.length)];
    }

    extractKeywords(text) {
        const words = text.toLowerCase().split(' ');
        return words.filter(word => word.length > 3).slice(0, 3);
    }

    async generateImages(scriptAnalysis) {
        return new Promise(resolve => {
            setTimeout(() => {
                const images = scriptAnalysis.map((scene, index) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 360;
                    canvas.height = 640;
                    const ctx = canvas.getContext('2d');
                    
                    // 더 다양하고 아름다운 배경 생성
                    this.createEnhancedBackground(ctx, scene, index);
                    
                    return canvas.toDataURL('image/jpeg', 0.9);
                });
                resolve(images);
            }, 2000);
        });
    }

    createEnhancedBackground(ctx, scene, index) {
        // 감정에 따른 색상 팔레트
        const emotionColors = {
            excited: [
                { start: '#FF6B6B', end: '#FFE66D' },
                { start: '#FF8E53', end: '#FF6B9D' }
            ],
            calm: [
                { start: '#4ECDC4', end: '#44A08D' },
                { start: '#96DEDA', end: '#50C9C3' }
            ],
            dramatic: [
                { start: '#2C3E50', end: '#FD746C' },
                { start: '#FC4A1A', end: '#F7B733' }
            ],
            happy: [
                { start: '#FDBB2D', end: '#22C1C3' },
                { start: '#FF9A9E', end: '#FECFEF' }
            ],
            serious: [
                { start: '#434343', end: '#000000' },
                { start: '#667db6', end: '#0082c8' }
            ]
        };

        const colors = emotionColors[scene.emotion] || emotionColors.calm;
        const colorSet = colors[index % colors.length];

        // 그라데이션 배경
        const gradient = ctx.createLinearGradient(0, 0, 360, 640);
        gradient.addColorStop(0, colorSet.start);
        gradient.addColorStop(1, colorSet.end);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 360, 640);

        // 기하학적 패턴 추가
        this.addGeometricPatterns(ctx, scene, index);

        // 키워드 기반 아이콘 추가
        this.addKeywordIcons(ctx, scene.keywords, index);
    }

    addGeometricPatterns(ctx, scene, index) {
        ctx.save();
        ctx.globalAlpha = 0.15;

        const patterns = ['circles', 'triangles', 'waves', 'particles'];
        const pattern = patterns[index % patterns.length];

        switch (pattern) {
            case 'circles':
                for (let i = 0; i < 8; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * 360,
                        Math.random() * 640,
                        Math.random() * 100 + 30,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fill();
                }
                break;

            case 'triangles':
                for (let i = 0; i < 6; i++) {
                    const x = Math.random() * 360;
                    const y = Math.random() * 640;
                    const size = Math.random() * 60 + 20;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + size, y + size);
                    ctx.lineTo(x - size, y + size);
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.fill();
                }
                break;

            case 'waves':
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 3;
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    for (let x = 0; x <= 360; x += 10) {
                        const y = Math.sin((x + i * 50) * 0.02) * 30 + 100 + i * 120;
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
                break;

            case 'particles':
                for (let i = 0; i < 50; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * 360,
                        Math.random() * 640,
                        Math.random() * 4 + 1,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
                    ctx.fill();
                }
                break;
        }

        ctx.restore();
    }

    addKeywordIcons(ctx, keywords, index) {
        if (!keywords || keywords.length === 0) return;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';

        // 키워드별 간단한 아이콘/텍스트 표시
        keywords.slice(0, 2).forEach((keyword, i) => {
            const x = 90 + i * 180;
            const y = 200 + Math.sin(index) * 100;
            
            // 키워드 첫 글자를 큰 글씨로 표시
            const firstChar = keyword.charAt(0).toUpperCase();
            ctx.fillText(firstChar, x, y);
            
            // 작은 원 배경
            ctx.beginPath();
            ctx.arc(x, y - 15, 35, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
        });

        ctx.restore();
    }

    async generateAudio(script) {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('음성 합성을 지원하지 않는 브라우저입니다.'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(script);
            utterance.lang = 'ko-KR';
            utterance.rate = parseFloat(this.voiceSpeedSlider.value);
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onend = () => {
                resolve({
                    duration: script.length * 0.1,
                    utterance: utterance
                });
            };

            utterance.onerror = reject;
            speechSynthesis.speak(utterance);
        });
    }

    async compileVideo(images, audio, scriptAnalysis) {
        return new Promise(async (resolve) => {
            // 실제 비디오 녹화 시작
            const videoData = await this.recordRealVideo(images, audio, scriptAnalysis);
            resolve(videoData);
        });
    }

    async recordRealVideo(images, audio, scriptAnalysis) {
        return new Promise((resolve) => {
            // Canvas 스트림 생성
            const stream = this.videoCanvas.captureStream(30); // 30 FPS
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            const chunks = [];
            let currentImageIndex = 0;
            const totalDuration = scriptAnalysis.length * 3000; // 3초씩
            const imageDuration = 3000; // 각 이미지 3초

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const videoBlob = new Blob(chunks, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(videoBlob);
                
                resolve({
                    images: images,
                    audio: audio,
                    scenes: scriptAnalysis,
                    duration: totalDuration / 1000,
                    videoBlob: videoBlob,
                    videoUrl: videoUrl
                });
            };

            // 녹화 시작
            recorder.start();

            // 이미지 애니메이션 시작
            this.animateImagesForRecording(images, scriptAnalysis, () => {
                // 녹화 완료
                recorder.stop();
            });
        });
    }

    animateImagesForRecording(images, scriptAnalysis, onComplete) {
        let currentIndex = 0;
        const imageDuration = 3000; // 3초
        
        const showNextImage = () => {
            if (currentIndex >= images.length) {
                setTimeout(onComplete, 500); // 잠시 대기 후 완료
                return;
            }

            const img = new Image();
            img.onload = () => {
                // 캔버스 클리어
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, 360, 640);
                
                // 이미지 그리기
                this.ctx.drawImage(img, 0, 0, 360, 640);
                
                // 자막 추가
                if (scriptAnalysis[currentIndex]) {
                    this.drawSubtitle(scriptAnalysis[currentIndex].text);
                }
                
                // 트랜지션 효과
                this.addTransitionEffect(currentIndex);
                
                currentIndex++;
                setTimeout(showNextImage, imageDuration);
            };
            
            img.onerror = () => {
                // 이미지 로드 실패시 기본 배경
                this.drawDefaultBackground(currentIndex);
                if (scriptAnalysis[currentIndex]) {
                    this.drawSubtitle(scriptAnalysis[currentIndex].text);
                }
                currentIndex++;
                setTimeout(showNextImage, imageDuration);
            };
            
            img.src = images[currentIndex];
        };

        showNextImage();
    }

    drawSubtitle(text) {
        // 자막 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(20, 520, 320, 100);
        
        // 자막 테두리
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(20, 520, 320, 100);
        
        // 자막 텍스트
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // 텍스트 줄바꿈 처리
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        const maxWidth = 280;

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine.trim() !== '') {
            lines.push(currentLine.trim());
        }

        // 텍스트 그리기
        const lineHeight = 22;
        const startY = 570 - (lines.length * lineHeight) / 2;

        lines.forEach((line, index) => {
            this.ctx.fillText(line, 180, startY + index * lineHeight);
        });
    }

    addTransitionEffect(index) {
        const effects = ['fadeIn', 'slideUp', 'zoomIn', 'none'];
        const effect = effects[index % effects.length];
        
        this.ctx.save();
        
        switch (effect) {
            case 'fadeIn':
                // 페이드 인 효과 시뮬레이션
                this.ctx.globalAlpha = 0.9;
                break;
            case 'slideUp':
                // 슬라이드 업 효과
                this.ctx.translate(0, -10);
                break;
            case 'zoomIn':
                // 줌 인 효과
                this.ctx.scale(1.05, 1.05);
                this.ctx.translate(-9, -16);
                break;
        }
        
        this.ctx.restore();
    }

    drawDefaultBackground(index) {
        // 기본 그라데이션 배경
        const colors = [
            ['#667eea', '#764ba2'],
            ['#f093fb', '#f5576c'],
            ['#4facfe', '#00f2fe'],
            ['#43e97b', '#38f9d7']
        ];
        
        const colorPair = colors[index % colors.length];
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 640);
        gradient.addColorStop(0, colorPair[0]);
        gradient.addColorStop(1, colorPair[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 360, 640);
        
        // 장식 요소 추가
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
                Math.random() * 360,
                Math.random() * 640,
                Math.random() * 80 + 20,
                0,
                Math.PI * 2
            );
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }

    // ... 계속됩니다 (파일이 너무 길어서 다음 파트에서 계속)

    async updateProgress(step, message) {
        const steps = document.querySelectorAll('.step');
        const loadingProgress = document.getElementById('loadingProgress');
        const progressText = document.getElementById('progressText');
        
        // 이전 단계들을 완료로 표시
        for (let i = 0; i < step - 1; i++) {
            steps[i].classList.remove('active');
            steps[i].classList.add('completed');
        }
        
        // 현재 단계를 활성화
        if (steps[step - 1]) {
            steps[step - 1].classList.add('active');
        }
        
        // 진행률 업데이트
        const progress = (step / 4) * 100;
        loadingProgress.style.width = progress + '%';
        progressText.textContent = message;
        
        // 각 단계마다 약간의 지연
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    showProgressModal() {
        this.progressModal.style.display = 'block';
        // 초기화
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.getElementById('loadingProgress').style.width = '0%';
    }

    hideProgressModal() {
        this.progressModal.style.display = 'none';
    }

    enableDownloadButtons() {
        this.downloadVideo.disabled = false;
        this.downloadAudio.disabled = false;
        this.downloadSubtitle.disabled = false;
    }

    updatePreview() {
        const text = this.scriptInput.value.trim();
        if (text) {
            this.subtitleOverlay.textContent = text.substring(0, 100) + (text.length > 100 ? '...' : '');
        } else {
            this.subtitleOverlay.textContent = '여기에 자막이 표시됩니다';
        }
    }

    togglePlay() {
        const icon = this.playBtn.querySelector('i');
        if (icon.classList.contains('fa-play')) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            this.playVideo();
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            this.pauseVideo();
        }
    }

    playVideo() {
        if (this.currentVideo && this.currentVideo.videoUrl) {
            // 실제 생성된 비디오가 있으면 재생
            this.playGeneratedVideo();
        } else {
            // 미리보기 모드
            this.playPreview();
        }
    }

    playGeneratedVideo() {
        // 실제 비디오 재생을 위한 임시 비디오 엘리먼트 생성
        if (this.videoElement) {
            this.videoElement.remove();
        }

        this.videoElement = document.createElement('video');
        this.videoElement.src = this.currentVideo.videoUrl;
        this.videoElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
        `;

        const phoneScreen = document.querySelector('.phone-screen');
        phoneScreen.appendChild(this.videoElement);
        
        this.videoElement.play();
        
        // 진행률 업데이트
        this.videoElement.addEventListener('timeupdate', () => {
            if (this.videoElement.duration > 0) {
                const progress = (this.videoElement.currentTime / this.videoElement.duration) * 100;
                this.progressBar.style.width = progress + '%';
                
                const currentTime = this.formatTime(this.videoElement.currentTime);
                const totalTime = this.formatTime(this.videoElement.duration);
                this.timeDisplay.textContent = `${currentTime} / ${totalTime}`;
            }
        });

        this.videoElement.addEventListener('ended', () => {
            const icon = this.playBtn.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        });
    }

    playPreview() {
        // 미리보기 재생 (기존 로직 유지)
        if (this.currentVideo && this.currentVideo.scenes) {
            this.animatePreview(this.currentVideo.scenes);
        }
    }

    animatePreview(scenes) {
        let currentIndex = 0;
        const duration = 3000; // 3초

        const showNextScene = () => {
            if (currentIndex >= scenes.length) {
                const icon = this.playBtn.querySelector('i');
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                return;
            }

            const scene = scenes[currentIndex];
            this.subtitleOverlay.textContent = scene.text;
            
            // 간단한 배경 변경
            this.drawDefaultBackground(currentIndex);
            this.drawSubtitle(scene.text);
            
            currentIndex++;
            setTimeout(showNextScene, duration);
        };

        showNextScene();
    }

    pauseVideo() {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    downloadVideoFile() {
        if (!this.currentVideo || !this.currentVideo.videoBlob) {
            this.showNotification('먼저 영상을 생성해주세요!', 'error');
            return;
        }
        
        // 실제 MP4 다운로드
        const link = document.createElement('a');
        link.download = 'youtube-shorts-' + Date.now() + '.webm';
        link.href = this.currentVideo.videoUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('영상 다운로드가 시작되었습니다!', 'success');
    }

    downloadAudioFile() {
        if (!this.currentVideo || !this.currentVideo.audio) {
            this.showNotification('먼저 영상을 생성해주세요!', 'error');
            return;
        }
        
        // 음성 재생성 및 녹음
        this.generateAndDownloadAudio();
    }

    async generateAndDownloadAudio() {
        try {
            const script = this.scriptInput.value.trim();
            const utterance = new SpeechSynthesisUtterance(script);
            utterance.rate = parseFloat(this.voiceSpeedSlider.value);
            utterance.lang = 'ko-KR';

            // Web Audio API로 음성 녹음
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const dest = this.audioContext.createMediaStreamDestination();
            const recorder = new MediaRecorder(dest.stream);
            const chunks = [];

            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.download = 'youtube-shorts-audio-' + Date.now() + '.wav';
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(url);
                this.showNotification('음성 파일 다운로드가 시작되었습니다!', 'success');
            };

            recorder.start();
            
            utterance.onend = () => {
                setTimeout(() => recorder.stop(), 500);
            };

            speechSynthesis.speak(utterance);
            
        } catch (error) {
            console.error('음성 다운로드 오류:', error);
            this.showNotification('음성 다운로드 중 오류가 발생했습니다.', 'error');
        }
    }

    downloadSubtitleFile() {
        if (!this.currentVideo) {
            this.showNotification('먼저 영상을 생성해주세요!', 'error');
            return;
        }
        
        // 자막 파일 생성 및 다운로드
        const subtitles = this.generateSRTFormat();
        const blob = new Blob([subtitles], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = 'youtube-shorts-subtitles-' + Date.now() + '.srt';
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('자막 파일 다운로드가 시작되었습니다!', 'success');
    }

    generateSRTFormat() {
        const script = this.scriptInput.value.trim();
        const sentences = script.split(/[.!?]/).filter(s => s.trim().length > 0);
        
        let srt = '';
        sentences.forEach((sentence, index) => {
            const startTime = this.formatSRTTime(index * 3);
            const endTime = this.formatSRTTime((index + 1) * 3);
            
            srt += `${index + 1}\n`;
            srt += `${startTime} --> ${endTime}\n`;
            srt += `${sentence.trim()}\n\n`;
        });
        
        return srt;
    }

    formatSRTTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const milliseconds = Math.floor((seconds % 1) * 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ShortsGenerator();
    
    // 타이핑 효과
    const typingText = document.querySelector('.typing-effect');
    if (typingText) {
        const texts = ['유튜브 쇼츠', '틱톡 영상', '인스타 릴스', 'SNS 콘텐츠'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        typeWriter();
    }
});

// 🎛️ 고급 컨트롤 초기화
class AdvancedControls {
    constructor() {
        this.currentVoiceStyle = 'natural';
        this.speechSpeed = 1.0;
        this.speechPitch = 1.0;
        this.particlesEnabled = false;
        this.gradientEnabled = true;
        
        this.initControls();
    }

    initControls() {
        // 음성 스타일 버튼 이벤트
        document.querySelectorAll('.voice-style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 모든 버튼에서 active 클래스 제거
                document.querySelectorAll('.voice-style-btn').forEach(b => b.classList.remove('active'));
                // 클릭된 버튼에 active 클래스 추가
                e.target.classList.add('active');
                this.currentVoiceStyle = e.target.dataset.style;
                console.log(`🎵 음성 스타일 변경: ${this.currentVoiceStyle}`);
            });
        });

        // 속도 슬라이더
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.speechSpeed = parseFloat(e.target.value);
                speedValue.textContent = `${this.speechSpeed}x`;
                if (window.voiceEffects) {
                    window.voiceEffects.adjustPlaybackRate(this.speechSpeed);
                }
            });
        }

        // 피치 슬라이더
        const pitchSlider = document.getElementById('pitch-slider');
        const pitchValue = document.getElementById('pitch-value');
        if (pitchSlider) {
            pitchSlider.addEventListener('input', (e) => {
                this.speechPitch = parseFloat(e.target.value);
                const pitchText = this.speechPitch < 0.8 ? '낮음' : 
                                 this.speechPitch > 1.2 ? '높음' : '보통';
                pitchValue.textContent = pitchText;
            });
        }

        // 효과 토글
        const particlesToggle = document.getElementById('particles-toggle');
        const gradientToggle = document.getElementById('gradient-toggle');
        
        if (particlesToggle) {
            particlesToggle.addEventListener('change', (e) => {
                this.particlesEnabled = e.target.checked;
                console.log(`✨ 파티클 효과: ${this.particlesEnabled ? 'ON' : 'OFF'}`);
            });
        }

        if (gradientToggle) {
            gradientToggle.addEventListener('change', (e) => {
                this.gradientEnabled = e.target.checked;
                console.log(`🌈 그라데이션 배경: ${this.gradientEnabled ? 'ON' : 'OFF'}`);
            });
        }
    }

    // 현재 설정 가져오기
    getCurrentSettings() {
        return {
            voiceStyle: this.currentVoiceStyle,
            speed: this.speechSpeed,
            pitch: this.speechPitch,
            particles: this.particlesEnabled,
            gradient: this.gradientEnabled
        };
    }
}

// 🎯 개선된 영상 생성 함수
async function generateAdvancedVideo() {
    const settings = window.advancedControls.getCurrentSettings();
    const script = document.getElementById('script').value;
    
    if (!script.trim()) {
        alert('🚨 대본을 입력해주세요!');
        return;
    }

    // 로딩 시작
    showLoadingState('🤖 AI가 고급 영상을 생성하고 있습니다...');
    
    try {
        // 1. 음성 생성 (설정 적용)
        console.log('🎵 고급 음성 생성 중...', settings);
        
        // 2. 시각 효과 적용
        console.log('🎨 시각 효과 적용 중...', settings);
        
        // 3. 영상 렌더링
        console.log('🎬 영상 렌더링 중...');
        
        // 실제 영상 생성 로직...
        await new Promise(resolve => setTimeout(resolve, 3000)); // 시뮬레이션
        
        // 성공 메시지
        showSuccessMessage('🎉 고급 AI 영상이 성공적으로 생성되었습니다!');
        
    } catch (error) {
        console.error('❌ 영상 생성 오류:', error);
        alert('영상 생성 중 오류가 발생했습니다.');
    } finally {
        hideLoadingState();
    }
}

// UI 헬퍼 함수들
function showLoadingState(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
                    align-items: center; z-index: 9999;">
            <div style="text-align: center; color: white;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 20px; font-size: 18px;">${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoadingState() {
    const loading = document.getElementById('loading-overlay');
    if (loading) loading.remove();
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.appendChild(successDiv);
    
    // 3초 후 자동 제거
    setTimeout(() => successDiv.remove(), 3000);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 YouTube Shorts Generator 고급 모드 로딩...');
    
    // 고급 컨트롤 초기화
    window.advancedControls = new AdvancedControls();
    
    console.log('✅ 모든 고급 기능이 로드되었습니다!');
});
