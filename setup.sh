# ollama 설치
curl -fsSL https://ollama.com/install.sh | sh

# ollama 서비스 시작
# systemctl start ollama
ollama serve

# ollama 모델 다운로드
# ollama pull qwen2.5-coder-7b-instruct-gguf
# ollama pull qwen2.5-coder-32b-instruct-gguf
# ollama pull qwen2.5-coder:7b
ollama pull qwen2.5-coder:0.5b
