#!/bin/bash

# YouTube Shorts Generator 실행 스크립트
echo "🎬 YouTube Shorts Generator를 시작합니다..."

# 포트 확인 함수
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# 사용 가능한 포트 찾기
PORT=8000
while check_port $PORT; do
    PORT=$((PORT + 1))
done

echo "📡 포트 $PORT에서 서버를 시작합니다..."

# Python 웹 서버 실행
if command -v python3 &> /dev/null; then
    echo "🐍 Python3으로 서버 실행"
    echo "🌐 브라우저에서 http://localhost:$PORT 로 접속하세요"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "🐍 Python으로 서버 실행"
    echo "🌐 브라우저에서 http://localhost:$PORT 로 접속하세요"
    python -m http.server $PORT
elif command -v node &> /dev/null; then
    echo "🟢 Node.js로 서버 실행"
    npx live-server --port=$PORT --open=/
else
    echo "❌ Python 또는 Node.js가 설치되어 있지 않습니다."
    echo "다음 중 하나를 설치해주세요:"
    echo "  - Python: https://python.org"
    echo "  - Node.js: https://nodejs.org"
    echo ""
    echo "또는 index.html 파일을 더블클릭하여 브라우저에서 직접 열어보세요."
    exit 1
fi
