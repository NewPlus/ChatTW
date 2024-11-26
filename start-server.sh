# FastAPI 서버 실행 (터미널 1)
cd ai
python -m uvicorn main:app --reload --port 8001

# Next.js 개발 서버 실행 (터미널 2)
cd web
npm run dev