"""
OpenRouter AI Provider
Supports 400+ AI models through a unified API
"""
import requests
import json
from typing import Dict, Any
from .base import AIProvider


class OpenRouterProvider(AIProvider):
    """OpenRouter AI provider implementation"""
    
    DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct"  # Fast, capable, and cost-effective
    API_URL = "https://openrouter.ai/api/v1/chat/completions"
    
    def _initialize(self):
        """Initialize OpenRouter client"""
        self.api_key = self.config.get('api_key')
        self.model = self.config.get('model', self.DEFAULT_MODEL)
        self.site_url = self.config.get('site_url', 'http://localhost:8000')
        self.site_name = self.config.get('site_name', 'SWOT Analysis System')
        
        if self.api_key and self.api_key.startswith('sk-or-v1-'):
            self.is_available = True
            print(f"[OpenRouter] Initialized with model: {self.model}")
        else:
            print("[OpenRouter] Invalid or missing API key")
            self.is_available = False
    
    def is_ready(self) -> bool:
        """Check if OpenRouter is ready"""
        return self.is_available and bool(self.api_key)
    
    def generate_completion(self, prompt: str, system_prompt: str = None, **kwargs) -> str:
        """
        Generate completion using OpenRouter API
        
        Args:
            prompt: User prompt
            system_prompt: System prompt (optional)
            **kwargs: Additional parameters (temperature, max_tokens, etc.)
        
        Returns:
            Generated text response
        """
        if not self.is_ready():
            raise Exception("OpenRouter provider is not ready. Check API key configuration.")
        
        # Build messages
        messages = []
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
        messages.append({
            "role": "user",
            "content": prompt
        })
        
        # Prepare request
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": self.site_url,
            "X-Title": self.site_name
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": kwargs.get('temperature', 0.7),
            "max_tokens": kwargs.get('max_tokens', 2000),
        }
        
        # Add optional parameters
        if 'top_p' in kwargs:
            payload['top_p'] = kwargs['top_p']
        if 'frequency_penalty' in kwargs:
            payload['frequency_penalty'] = kwargs['frequency_penalty']
        if 'presence_penalty' in kwargs:
            payload['presence_penalty'] = kwargs['presence_penalty']
        
        try:
            print(f"[OpenRouter] Calling API with model: {self.model}")
            response = requests.post(
                self.API_URL,
                headers=headers,
                json=payload,
                timeout=60
            )
            
            response.raise_for_status()
            result = response.json()
            
            if 'choices' in result and len(result['choices']) > 0:
                content = result['choices'][0]['message']['content']
                print(f"[OpenRouter] Success! Response length: {len(content)} chars")
                return content
            else:
                raise Exception(f"Unexpected response format: {result}")
                
        except requests.exceptions.RequestException as e:
            print(f"[OpenRouter] Request error: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_detail = e.response.json()
                    print(f"[OpenRouter] Error details: {error_detail}")
                except:
                    print(f"[OpenRouter] Error response: {e.response.text}")
            raise Exception(f"OpenRouter API error: {str(e)}")
        except Exception as e:
            print(f"[OpenRouter] Unexpected error: {e}")
            raise
    
    def list_available_models(self) -> list:
        """
        Get list of available models from OpenRouter
        
        Returns:
            List of model dictionaries
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
            }
            response = requests.get(
                "https://openrouter.ai/api/v1/models",
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get('data', [])
        except Exception as e:
            print(f"[OpenRouter] Error fetching models: {e}")
            return []
