"""
AI Provider abstraction layer
Supports multiple AI providers with a unified interface
"""
from .base import AIProvider
from .openrouter import OpenRouterProvider
from .local_llm import LocalLLMProvider

__all__ = ['AIProvider', 'OpenRouterProvider', 'LocalLLMProvider']
