// 비디오 생성 관련 고급 기능
class VideoGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.recorder = null;
        this.chunks = [];
    }

    initCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    async createVideoFromImages(images, duration = 3000) {
        if (!this.canvas) return null;

        const stream = this.canvas.captureStream(30); // 30 FPS
        this.recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm'
        });

        this.chunks = [];
        this.recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.chunks.push(event.data);
            }
        };

        return new Promise((resolve) => {
            this.recorder.onstop = () => {
                const blob = new Blob(this.chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                resolve(url);
            };

            this.recorder.start();
            this.animateImages(images, duration);
            
            setTimeout(() => {
                this.recorder.stop();
            }, duration);
        });
    }

    async animateImages(images, totalDuration) {
        const durationPerImage = totalDuration / images.length;
        let currentImageIndex = 0;

        const animate = () => {
            if (currentImageIndex >= images.length) return;

            const img = new Image();
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 이미지 그리기
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                
                // 트랜지션 효과 추가
                this.addTransitionEffect(currentImageIndex);
                
                currentImageIndex++;
                
                if (currentImageIndex < images.length) {
                    setTimeout(animate, durationPerImage);
                }
            };
            img.src = images[currentImageIndex];
        };

        animate();
    }

    addTransitionEffect(index) {
        const effects = ['fadeIn', 'slideLeft', 'zoomIn', 'rotateIn'];
        const effect = effects[index % effects.length];
        
        this.ctx.save();
        
        switch (effect) {
            case 'fadeIn':
                this.ctx.globalAlpha = 0.8;
                break;
            case 'slideLeft':
                this.ctx.translate(-20, 0);
                break;
            case 'zoomIn':
                this.ctx.scale(1.1, 1.1);
                break;
            case 'rotateIn':
                this.ctx.rotate(0.05);
                break;
        }
        
        this.ctx.restore();
    }

    generateBackgroundPattern(type = 'gradient') {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');

        switch (type) {
            case 'gradient':
                const gradient = ctx.createLinearGradient(0, 0, 0, 640);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 360, 640);
                break;
                
            case 'geometric':
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 360, 640);
                
                // 기하학적 패턴 추가
                for (let i = 0; i < 20; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * 360,
                        Math.random() * 640,
                        Math.random() * 50 + 10,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.3)`;
                    ctx.fill();
                }
                break;
                
            case 'particles':
                ctx.fillStyle = '#0f0f23';
                ctx.fillRect(0, 0, 360, 640);
                
                // 파티클 효과
                for (let i = 0; i < 100; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * 360,
                        Math.random() * 640,
                        Math.random() * 3 + 1,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
                    ctx.fill();
                }
                break;
        }

        return canvas.toDataURL();
    }

    async processImageWithAI(imageData, style = 'enhance') {
        // AI 이미지 처리 시뮬레이션
        return new Promise(resolve => {
            setTimeout(() => {
                // 실제로는 여기서 AI 서비스 API를 호출
                console.log(`AI processing with style: ${style}`);
                resolve(imageData);
            }, 1000);
        });
    }

    generateTextOverlay(text, style = 'bold') {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');

        // 텍스트 스타일 설정
        const styles = {
            bold: {
                font: 'bold 32px Arial',
                color: '#ffffff',
                strokeColor: '#000000',
                strokeWidth: 4
            },
            elegant: {
                font: '28px Georgia',
                color: '#f8f8f8',
                strokeColor: '#333333',
                strokeWidth: 2
            },
            playful: {
                font: 'bold 30px Comic Sans MS',
                color: '#ff6b6b',
                strokeColor: '#ffffff',
                strokeWidth: 3
            },
            professional: {
                font: '26px Helvetica',
                color: '#ffffff',
                strokeColor: '#000000',
                strokeWidth: 2
            }
        };

        const textStyle = styles[style] || styles.bold;
        
        ctx.font = textStyle.font;
        ctx.fillStyle = textStyle.color;
        ctx.strokeStyle = textStyle.strokeColor;
        ctx.lineWidth = textStyle.strokeWidth;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 텍스트 래핑
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        const maxWidth = 320;

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            
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
        const lineHeight = 40;
        const startY = 320 - (lines.length * lineHeight) / 2;

        lines.forEach((line, index) => {
            const y = startY + index * lineHeight;
            ctx.strokeText(line, 180, y);
            ctx.fillText(line, 180, y);
        });

        return canvas.toDataURL();
    }

    // 고급 효과들
    createParticleSystem(count = 50) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * 360,
                y: Math.random() * 640,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random(),
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
        
        return particles;
    }

    animateParticles(ctx, particles) {
        particles.forEach(particle => {
            // 파티클 업데이트
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 경계 체크
            if (particle.x < 0 || particle.x > 360) particle.vx *= -1;
            if (particle.y < 0 || particle.y > 640) particle.vy *= -1;
            
            // 파티클 그리기
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    createWaveEffect(ctx, time) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            for (let x = 0; x <= 360; x += 5) {
                const y = Math.sin((x + time + i * 100) * 0.01) * 50 + 320 + i * 50;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        ctx.restore();
    }

    addGlowEffect(ctx, x, y, radius, color) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 전역으로 사용할 수 있도록 export
window.VideoGenerator = VideoGenerator;
