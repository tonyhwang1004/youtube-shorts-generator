#!/bin/bash

# YouTube Shorts Generator 배포 스크립트
echo "🚀 배포를 시작합니다..."

# 사용자에게 배포 방법 선택 요청
echo "배포 방법을 선택하세요:"
echo "1) GitHub Pages"
echo "2) Netlify" 
echo "3) Vercel"
echo "4) 로컬 빌드만"

read -p "선택 (1-4): " choice

case $choice in
    1)
        echo "📚 GitHub Pages로 배포합니다..."
        
        # gh-pages 브랜치 생성
        git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
        
        # 변경사항 커밋
        git add .
        git commit -m "Deploy to GitHub Pages - $(date)"
        
        # 푸시
        git push origin gh-pages
        
        echo "✅ GitHub Pages 배포 완료!"
        echo "🌐 사이트 URL: https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')"
        ;;
        
    2)
        echo "🎯 Netlify로 배포합니다..."
        
        if ! command -v netlify &> /dev/null; then
            echo "Netlify CLI를 설치합니다..."
            npm install -g netlify-cli
        fi
        
        netlify deploy --prod --dir=.
        echo "✅ Netlify 배포 완료!"
        ;;
        
    3)
        echo "⚡ Vercel로 배포합니다..."
        
        if ! command -v vercel &> /dev/null; then
            echo "Vercel CLI를 설치합니다..."
            npm install -g vercel
        fi
        
        vercel --prod
        echo "✅ Vercel 배포 완료!"
        ;;
        
    4)
        echo "📦 로컬 빌드를 생성합니다..."
        
        # 빌드 디렉토리 생성
        mkdir -p dist
        
        # 파일 복사
        cp -r css js assets index.html dist/ 2>/dev/null || true
        
        # 불필요한 파일 제거
        rm -rf dist/.git
        rm -f dist/install.sh dist/deploy.sh dist/run.sh
        
        echo "✅ 빌드 완료! dist/ 폴더를 확인하세요."
        ;;
        
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac

echo "🎉 배포 프로세스가 완료되었습니다!"
