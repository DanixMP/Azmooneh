"""
Local LLM Provider
Supports local LLM servers (Ollama, LM Studio, etc.)
"""
import requests
from typing import Dict, Any
from .base import AIProvider


class LocalLLMProvider(AIProvider):
    """Local LLM provider for self-hosted models"""
    
    def _initialize(self):
        """Initialize local LLM connection"""
        self.base_url = self.config.get('base_url', 'http://localhost:11434')
        self.model = self.config.get('model', 'llama3')
        self.api_type = self.config.get('api_type', 'ollama')  # ollama, lmstudio, vllm
        
        # Check if server is available
        self.is_available = self._check_connection()
        
        if self.is_available:
            print(f"[LocalLLM] Connected to {self.api_type} at {self.base_url}")
        else:
            print(f"[LocalLLM] Could not connect to {self.base_url}")
    
    def _check_connection(self) -> bool:
        """Check if local LLM server is accessible"""
        try:
            if self.api_type == 'ollama':
                response = requests.get(f"{self.base_url}/api/tags", timeout=2)
                return response.status_code == 200
            elif self.api_type == 'lmstudio':
                response = requests.get(f"{self.base_url}/v1/models", timeout=2)
                return response.status_code == 200
            else:
                # Generic check
                response = requests.get(self.base_url, timeout=2)
                return response.status_code in [200, 404]  # 404 is ok, means server is up
        except:
            return False
    
    def is_ready(self) -> bool:
        """Check if local LLM is ready"""
        return self.is_available
    
    def generate_completion(self, prompt: str, system_prompt: str = None, **kwargs) -> str:
        """
        Generate completion using local LLM
        
        Args:
            prompt: User prompt
            system_prompt: System prompt (optional)
            **kwargs: Additional parameters
        
        Returns:
            Generated text response
        """
        if not self.is_ready():
            raise Exception("Local LLM is not available. Make sure the server is running.")
        
        if self.api_type == 'ollama':
            return self._generate_ollama(prompt, system_prompt, **kwargs)
        elif self.api_type in ['lmstudio', 'vllm']:
            return self._generate_openai_compatible(prompt, system_prompt, **kwargs)
        else:
            raise Exception(f"Unsupported API type: {self.api_type}")
    
    def _generate_ollama(self, prompt: str, system_prompt: str = None, **kwargs) -> str:
        """Generate using Ollama API"""
        url = f"{self.base_url}/api/generate"
        
        full_prompt = prompt
        if system_prompt:
            full_prompt = f"{system_prompt}\n\n{prompt}"
        
        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": kwargs.get('temperature', 0.7),
                "num_predict": kwargs.get('max_tokens', 2000),
            }
        }
        
        try:
            response = requests.post(url, json=payload, timeout=120)
            response.raise_for_status()
            result = response.json()
            return result.get('response', '')
        except Exception as e:
            raise Exception(f"Ollama API error: {str(e)}")
    
    def _generate_openai_compatible(self, prompt: str, system_prompt: str = None, **kwargs) -> str:
        """Generate using OpenAI-compatible API (LM Studio, vLLM)"""
        url = f"{self.base_url}/v1/chat/completions"
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": kwargs.get('temperature', 0.7),
            "max_tokens": kwargs.get('max_tokens', 2000),
        }
        
        try:
            response = requests.post(url, json=payload, timeout=120)
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content']
        except Exception as e:
            raise Exception(f"Local LLM API error: {str(e)}")
