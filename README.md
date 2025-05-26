# 🎬 YouTube Shorts Generator - AI 영상 자동 생성기

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

## 📖 프로젝트 소개

**ShortsAI**는 텍스트 대본만 입력하면 AI가 자동으로 유튜브 쇼츠 영상을 생성해주는 혁신적인 웹 애플리케이션입니다.

### ✨ 주요 기능

- 🤖 **AI 자동 생성**: 텍스트만 입력하면 이미지, 음성, 자막 자동 생성
- 🎨 **다양한 스타일**: 모던, 시네마틱, 미니멀, 생동감 넘치는 4가지 스타일  
- ⚡ **빠른 제작**: 평균 5분 이내 고품질 영상 완성
- 📱 **모바일 최적화**: 9:16 비율의 완벽한 모바일 영상
- 💾 **실제 다운로드**: WebM, WAV, SRT 파일 다운로드

## 🚀 빠른 시작

### 실행 방법
```bash
# 실행 스크립트 사용
./run.sh

# 또는 직접 Python 서버 실행
python3 -m http.server 8000
```

### 사용법
1. 대본 입력
2. 스타일 설정 (모던, 시네마틱 등)
3. "AI 영상 생성하기" 클릭
4. 15초 실제 영상 완성!

## 📁 프로젝트 구조

```
youtube-shorts-generator/
├── index.html              # 메인 페이지
├── css/style.css           # 스타일시트
├── js/
│   ├── app.js              # 메인 로직
│   ├── video-generator.js  # 비디오 생성
│   └── text-to-speech.js   # 음성 합성
├── assets/                 # 리소스 파일
├── run.sh                  # 실행 스크립트
└── deploy.sh               # 배포 스크립트
```

## 🎯 실제 결과물

- ✅ **15초 WebM 영상** (9:16 세로 비율)
- ✅ **음성 파일** (WAV 형식)
- ✅ **자막 파일** (SRT 형식)
- ✅ **폰에서 재생 가능한 실제 쇼츠**

## 🔧 기술 스택

- **HTML5 + CSS3**: 반응형 디자인
- **Vanilla JavaScript**: ES6+ 모던 문법
- **Canvas API**: 비디오 렌더링
- **MediaRecorder API**: 실제 영상 녹화
- **Web Speech API**: 음성 합성

## 📞 문의

- **GitHub**: https://github.com/tonyhwang1004
- **Email**: tonyhwang1004@example.com

---

Made with ❤️ by Tony Hwang
