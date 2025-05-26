#!/bin/bash

echo "🔄 PythonAnywhere ↔ GitHub 동시 업데이트"
echo "=================================="

# 현재 시간
TIMESTAMP=$(date +'%Y-%m-%d %H:%M:%S')

# Git 상태 확인
echo "📋 현재 Git 상태:"
git status --short

# 변경사항이 있는지 확인
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 변경사항 발견! 동기화 시작..."
    
    # GitHub에 푸시
    git add .
    git commit -m "🔄 실시간 동기화: $TIMESTAMP"
    git push origin main
    
    echo "✅ GitHub 업데이트 완료!"
else
    echo "📭 변경사항이 없습니다."
fi

# PythonAnywhere 웹앱 재시작 (API 사용)
echo "🔄 PythonAnywhere 웹앱 재시작 중..."

# 웹앱 재시작 시뮬레이션 (실제로는 대시보드에서 Reload 필요)
echo "⚠️  수동으로 PythonAnywhere Dashboard에서 'Reload' 버튼을 클릭해주세요!"

echo ""
echo "🌐 확인 URL들:"
echo "GitHub Pages: https://tonyhwang1004.github.io/youtube-shorts-generator/"
echo "PythonAnywhere: https://tonyhwang1004.pythonanywhere.com"
echo ""
echo "⏱️ 업데이트 완료: $TIMESTAMP"
