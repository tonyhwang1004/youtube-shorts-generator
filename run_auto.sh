#!/bin/bash
echo "🎬 YouTube Shorts Generator를 시작합니다..."
for PORT in {8001..8010}; do
    if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "📡 포트 $PORT에서 서버를 시작합니다..."
        echo "🌐 브라우저에서 http://localhost:$PORT 로 접속하세요"
        python3 -m http.server $PORT
        exit 0
    fi
done
echo "❌ 사용 가능한 포트를 찾을 수 없습니다."
