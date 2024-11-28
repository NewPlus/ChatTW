# ollama 설치
curl -fsSL https://ollama.com/install.sh | sh

# ollama 모델 다운로드
# ollama pull qwen2.5-coder-7b-instruct-gguf
# ollama pull qwen2.5-coder-32b-instruct-gguf
# ollama pull qwen2.5-coder:7b
ollama pull qwen2.5-coder:0.5b


cd web
npm install react@18.2.0 react-dom@18.2.0
npm install react-markdown rehype-raw rehype-sanitize remark-gfm
npm install -D @tailwindcss/typography
npm install --save-dev @types/react-markdown
npm install react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter

rm -rf node_modules
npm install
