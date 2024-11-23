# Standard Library

# Third Party Library
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Custom Module
from prompt import code_fix_template, code_generate_template
from llm.model import code_llm

# FastAPI 인스턴스 생성
app = FastAPI()


# Pydantic 모델 정의 - 코드 오류 수정 요청 타입
class CodeRequest(BaseModel):
    code: str
    question: str


# Pydantic 모델 정의 - 코드 오류 수정 응답 타입
class CodeResponse(BaseModel):
    fixed_code: str
    explanation: str


# Pydantic 모델 정의 - 코드 생성 요청 타입
class CodeGenerateRequest(BaseModel):
    question: str


# Pydantic 모델 정의 - 코드 생성 응답 타입
class CodeGenerateResponse(BaseModel):
    generated_code: str
    explanation: str


# 코드 오류 수정 엔드포인트
@app.post("/api/fix-code", response_model=CodeResponse)
async def fix_code(request: CodeRequest):
    try:
        # 프롬프트 생성
        formatted_prompt = code_fix_template.format(
            code=request.code,
            question=request.question
        )
        
        # LLM을 통한 응답 생성
        response = await code_llm.generate_response(formatted_prompt)
        
        # 응답 파싱
        parts = response.split("2. ")
        if len(parts) != 2:
            raise HTTPException(status_code=500, detail="응답 형식이 올바르지 않습니다")
            
        fixed_code = parts[0].replace("1. 수정된 코드\n", "").strip()
        explanation = parts[1].strip()
        
        return CodeResponse(
            fixed_code=fixed_code,
            explanation=explanation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 코드 생성 엔드포인트
@app.post("/api/generate-code", response_model=CodeGenerateResponse)
async def generate_code(request: CodeGenerateRequest):
    try:
        # 프롬프트 생성
        formatted_prompt = code_generate_template.format(
            question=request.question
        )
        
        # LLM을 통한 응답 생성
        response = await code_llm.generate_response(formatted_prompt)
        
        # 응답 파싱
        parts = response.split("2. ")
        if len(parts) != 2:
            raise HTTPException(status_code=500, detail="응답 형식이 올바르지 않습니다")
            
        generated_code = parts[0].replace("1. 생성된 코드\n", "").strip()
        explanation = parts[1].strip()
        
        return CodeGenerateResponse(
            generated_code=generated_code,
            explanation=explanation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 모델 상태 확인 엔드포인트
@app.get("/api/model/status")
async def model_status():
    """LLM 모델의 상태를 확인합니다."""
    try:
        # 간단한 프롬프트로 모델 테스트
        test_response = await code_llm.generate_response("Hello")
        return {
            "status": "healthy",
            "model_name": code_llm.model_name,
            "test_response": test_response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"모델 상태 확인 실패: {str(e)}")

# 모델 재로드 엔드포인트
@app.post("/api/model/reload")
async def reload_model():
    """LLM 모델을 재로드합니다."""
    try:
        code_llm.reload_model()
        return {"status": "success", "message": "모델이 성공적으로 재로드되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"모델 재로드 실패: {str(e)}")

# 서버 상태 확인용 엔드포인트
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
