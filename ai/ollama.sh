# ollama 서비스 활성화 & 시작
sudo systemctl enable ollama
sudo systemctl start ollama

# ollama 서비스 중지
sudo systemctl disable ollama
sudo systemctl stop ollama
sudo killall ollama

# 모델 설치 & 실행
ollama run qwen2.5-coder:3b-instruct-q4_K_M
