#!/bin/bash

echo "🔄 GitHub 자동 동기화 시작..."
cd ~/youtube-shorts-generator/

# Git 설정 확인
if [ ! -d ".git" ]; then
    echo "🔧 Git 초기 설정"
    git init
    git remote add origin https://github.com/tonyhwang1004/youtube-shorts-generator.git
fi

# 변경사항이 있는지 확인
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 변경사항 발견! 업데이트 중..."
    git add .
    git commit -m "🔄 자동 업데이트: $(date +'%Y-%m-%d %H:%M')"
    git push origin main
    echo "✅ GitHub 동기화 완료!"
else
    echo "📭 변경사항이 없습니다."
fi
