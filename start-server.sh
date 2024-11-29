# FastAPI 서버 실행 (터미널 1)
cd ai
python -m uvicorn main:app --reload --port 8001

# Ollama 서버 실행 (터미널 2)
ollama run qwen2.5-coder:3b-instruct-q4_K_M 

# Next.js 개발 서버 실행 (터미널 3)
cd web
npm run dev