from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import aiohttp

# FastAPI 앱 생성
app = FastAPI(title="사내 코딩 챗봇 API")


# 요청 모델 정의
class CodeRequest(BaseModel):
    code: Optional[str] = None
    prompt: str


# 응답 모델 정의
class CodeResponse(BaseModel):
    response: str
    fixed_code: Optional[str] = None


# Ollama API와 통신하는 비동기 함수
async def generate_ai_response(prompt: str, code: Optional[str] = None) -> str:
    # Local에서 실행
    url = "http://localhost:11434/api/generate"
    
    try:
        # 코드 수정 모드와 생성 모드에 따른 프롬프트 구성
        if code:
            system_prompt = "다음 코드의 오류를 분석하고 수정해주세요:"
            full_prompt = f"{system_prompt}\n\n{code}\n\n질문: {prompt}"
        else:
            system_prompt = "다음 요구사항에 맞는 코드를 생성해주세요:"
            full_prompt = f"{system_prompt}\n\n{prompt}"
        
        # 요청 데이터 구성
        data = {
            "model": "qwen2.5-coder:0.5b",
            "prompt": full_prompt,
            "stream": False
        }
        
        # 비동기 컨텍스트에서 동기 함수 실행
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=data) as response:
                if response.status != 200:
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"AI 모델 서버 오류: {await response.text()}"
                    )
                    
                result = await response.json()
                return result['response']
    
    # 예외 처리
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI 모델 서버 연결 오류: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI 처리 중 오류 발생: {str(e)}"
        )

# 코드 수정 및 생성 엔드포인트
@app.post("/generate/", response_model=CodeResponse)
async def generate_code(request: CodeRequest):
    """
    코드 수정 또는 생성 요청을 처리합니다.
    - code가 제공되면 코드 수정 모드로 동작
    - code가 없으면 코드 생성 모드로 동작
    """
    response = await generate_ai_response(request.prompt, request.code)
    
    # 응답 반환
    return CodeResponse(
        response=response,
        fixed_code=response if request.code else None
    )

# 상태 확인 엔드포인트
@app.get("/health")
async def health_check():
    """API 서버의 상태를 확인합니다."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
