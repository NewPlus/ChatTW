from typing import Optional
from langchain.callbacks.manager import CallbackManagerForLLMRun
from langchain.llms import Ollama
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

class CodeLLM:
    """코드 관련 작업을 처리하는 LLM 모델 클래스"""
    
    def __init__(self, model_name: str = "qwen2.5-coder-32b-instruct-gguf"):
        """LLM 모델 초기화
        
        Args:
            model_name (str): 사용할 Ollama 모델 이름
        """
        self.model_name = model_name
        self.llm = self._initialize_llm()
    
    def _initialize_llm(self) -> Ollama:
        """Ollama LLM 모델 초기화
        
        Returns:
            Ollama: 초기화된 Ollama 모델 인스턴스
        """
        return Ollama(
            model=self.model_name,
            callbacks=[StreamingStdOutCallbackHandler()],
            temperature=0.1,  # 코드 생성에는 낮은 temperature가 적합
            top_p=0.95,
            top_k=40,
            num_ctx=4096,  # 컨텍스트 길이
            repeat_penalty=1.1
        )
    
    async def generate_response(self, prompt: str) -> str:
        """프롬프트에 대한 응답 생성
        
        Args:
            prompt (str): 입력 프롬프트
            
        Returns:
            str: 생성된 응답
        """
        try:
            response = await self.llm.ainvoke(prompt)
            return response
        except Exception as e:
            raise Exception(f"LLM 응답 생성 중 오류 발생: {str(e)}")
    
    def reload_model(self) -> None:
        """모델 재로드"""
        self.llm = self._initialize_llm()

# 싱글톤 인스턴스 생성
code_llm = CodeLLM()
