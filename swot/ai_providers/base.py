"""
Base AI Provider interface
All AI providers must implement this interface
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any


class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize the provider with configuration
        
        Args:
            config: Provider-specific configuration dictionary
        """
        self.config = config or {}
        self.is_available = False
        self._initialize()
    
    @abstractmethod
    def _initialize(self):
        """Initialize the provider (check API keys, setup client, etc.)"""
        pass
    
    @abstractmethod
    def generate_completion(self, prompt: str, system_prompt: str = None, **kwargs) -> str:
        """
        Generate a completion from the AI model
        
        Args:
            prompt: The user prompt
            system_prompt: Optional system prompt
            **kwargs: Additional provider-specific parameters
            
        Returns:
            The generated text response
        """
        pass
    
    @abstractmethod
    def is_ready(self) -> bool:
        """Check if the provider is ready to use"""
        pass
    
    def get_name(self) -> str:
        """Get the provider name"""
        return self.__class__.__name__
