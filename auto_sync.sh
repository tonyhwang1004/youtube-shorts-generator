#!/bin/bash

echo "👀 파일 변경 실시간 감지 시작..."
echo "Ctrl+C로 중지"

while true; do
    # 파일 변경 감지 (5초마다 체크)
    if [ index.html -nt /tmp/last_sync 2>/dev/null ] || [ ! -f /tmp/last_sync ]; then
        echo "🔔 파일 변경 감지! $(date)"
        
        # 동기화 실행
        ./sync_both.sh
        
        # 마지막 동기화 시간 기록
        touch /tmp/last_sync
        
        echo "✅ 동기화 완료!"
        echo "━━━━━━━━━━━━━━━━━━━━"
    fi
    
    sleep 5
done
