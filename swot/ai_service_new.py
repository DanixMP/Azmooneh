"""
New AI Service for SWOT Analysis
Flexible architecture supporting multiple AI providers (OpenRouter, Local LLMs, etc.)
"""
import os
import json
from typing import Dict, List, Any, Optional
from django.conf import settings
from .ai_providers import OpenRouterProvider, LocalLLMProvider


class AIConfig:
    """AI Configuration Manager"""
    
    def __init__(self):
        self.config_file = os.path.join(settings.BASE_DIR, 'ai_config.json')
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load AI configuration from file"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"[AIConfig] Error loading config: {e}")
        
        # Return default configuration
        return self._get_default_config()

    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default AI configuration"""
        return {
            "active_provider": "openrouter",
            "providers": {
                "openrouter": {
                    "api_key": "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",
                    "model": "meta-llama/llama-3.3-70b-instruct",
                    "site_url": "http://localhost:8000",
                    "site_name": "SWOT Analysis System"
                },
                "local_llm": {
                    "base_url": "http://localhost:11434",
                    "model": "llama3",
                    "api_type": "ollama"
                }
            }
        }
    
    def get_active_provider(self) -> str:
        """Get the active provider name"""
        return self.config.get('active_provider', 'openrouter')
    
    def get_provider_config(self, provider_name: str) -> Dict[str, Any]:
        """Get configuration for a specific provider"""
        return self.config.get('providers', {}).get(provider_name, {})
    
    def save_config(self):
        """Save configuration to file"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
            print(f"[AIConfig] Configuration saved to {self.config_file}")
        except Exception as e:
            print(f"[AIConfig] Error saving config: {e}")



class SWOTAIAnalyzer:
    """AI-powered SWOT analysis with flexible provider support"""
    
    def __init__(self):
        self.config_manager = AIConfig()
        self.provider = None
        self._initialize_provider()
    
    def _initialize_provider(self):
        """Initialize the active AI provider"""
        active_provider = self.config_manager.get_active_provider()
        provider_config = self.config_manager.get_provider_config(active_provider)
        
        print(f"[AI Service] Initializing provider: {active_provider}")
        
        try:
            if active_provider == 'openrouter':
                self.provider = OpenRouterProvider(provider_config)
            elif active_provider == 'local_llm':
                self.provider = LocalLLMProvider(provider_config)
            else:
                print(f"[AI Service] Unknown provider: {active_provider}")
                self.provider = None
            
            if self.provider and self.provider.is_ready():
                print(f"[AI Service] Provider {active_provider} ready!")
            else:
                print(f"[AI Service] Provider {active_provider} not ready")
        except Exception as e:
            print(f"[AI Service] Error initializing provider: {e}")
            self.provider = None

    
    def analyze_swot_answers(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze SWOT answers and generate personality insights
        
        Args:
            answers: List of dicts with 'category', 'question', 'answer'
        
        Returns:
            Dict with personality analysis results
        """
        print(f"[AI Service] Starting analysis with {len(answers)} answers")
        
        if not self.provider or not self.provider.is_ready():
            print("[AI Service] No provider available, using local analysis")
            return self._analyze_answers_locally(answers)
        
        try:
            # Build the analysis prompt
            prompt = self._build_analysis_prompt(answers)
            system_prompt = self._get_system_prompt()
            
            print(f"[AI Service] Calling AI provider...")
            response = self.provider.generate_completion(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.7,
                max_tokens=2000
            )
            
            print(f"[AI Service] Got response, length: {len(response)} chars")
            
            # Parse and structure the response
            analysis = self._parse_ai_response(response)
            print(f"[AI Service] Analysis parsed successfully")
            
            return analysis
            
        except Exception as e:
            print(f"[AI Service] ERROR: {type(e).__name__}: {str(e)}")
            print("[AI Service] Falling back to local analysis")
            return self._analyze_answers_locally(answers)

    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for AI analysis"""
        return """شما یک روانشناس متخصص و مشاور شغلی هستید که در ارزیابی شخصیت و تحلیل SWOT تخصص دارید. 
همه پاسخ‌های شما باید به زبان فارسی (پارسی) باشند. 
از واژگان دقیق، حرفه‌ای و تشویق‌کننده استفاده کنید. 
تحلیل‌های شما باید عمیق، سازنده و قابل اجرا باشند."""
    
    def _build_analysis_prompt(self, answers: List[Dict[str, Any]]) -> str:
        """Build a comprehensive prompt for AI analysis"""
        
        # Organize answers by category
        categorized = {
            'strength': [],
            'weakness': [],
            'opportunity': [],
            'threat': []
        }
        
        for answer in answers:
            category = answer.get('category', '')
            if category in categorized:
                categorized[category].append({
                    'question': answer.get('question', ''),
                    'answer': answer.get('answer', '')
                })
        
        prompt = """You are an expert psychologist and career counselor. Analyze the following SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis responses from a student and provide a comprehensive personality assessment.

SWOT Analysis Responses:

"""
        
        # Add strengths
        if categorized['strength']:
            prompt += "**STRENGTHS (نقاط قوت):**\n"
            for item in categorized['strength']:
                prompt += f"Q: {item['question']}\nA: {item['answer']}\n\n"
        
        # Add weaknesses
        if categorized['weakness']:
            prompt += "**WEAKNESSES (نقاط ضعف):**\n"
            for item in categorized['weakness']:
                prompt += f"Q: {item['question']}\nA: {item['answer']}\n\n"

        
        # Add opportunities
        if categorized['opportunity']:
            prompt += "**OPPORTUNITIES (فرصت‌ها):**\n"
            for item in categorized['opportunity']:
                prompt += f"Q: {item['question']}\nA: {item['answer']}\n\n"
        
        # Add threats
        if categorized['threat']:
            prompt += "**THREATS (تهدیدها):**\n"
            for item in categorized['threat']:
                prompt += f"Q: {item['question']}\nA: {item['answer']}\n\n"
        
        prompt += """
Based on these responses, provide a detailed analysis in JSON format with the following structure.
IMPORTANT: All text fields MUST be in Persian (Farsi) language.

{
  "personality_type": "نوع شخصیتی به فارسی (مثلاً 'متفکر تحلیلی'، 'رهبر خلاق'، و غیره)",
  "overall_score": 85,
  "traits": {
    "confidence": 80,
    "self_awareness": 90,
    "growth_mindset": 75,
    "resilience": 85,
    "strategic_thinking": 70
  },
  "summary": "خلاصه جامع 2-3 پاراگرافی از شخصیت دانشجو، نقاط قوت و زمینه‌های توسعه به زبان فارسی. این متن باید دقیق، سازنده و تشویق‌کننده باشد.",
  "key_strengths": [
    "اولین نقطه قوت اصلی شناسایی شده به فارسی",
    "دومین نقطه قوت اصلی شناسایی شده به فارسی",
    "سومین نقطه قوت اصلی شناسایی شده به فارسی"
  ],
  "areas_for_improvement": [
    "اولین زمینه نیازمند توسعه به فارسی",
    "دومین زمینه نیازمند توسعه به فارسی",
    "سومین زمینه نیازمند توسعه به فارسی"
  ],
  "recommendations": [
    "توصیه عملی اول به فارسی",
    "توصیه عملی دوم به فارسی",
    "توصیه عملی سوم به فارسی"
  ],
  "career_suggestions": [
    "مسیر شغلی اول که با پروفایل همخوانی دارد به فارسی",
    "مسیر شغلی دوم که با پروفایل همخوانی دارد به فارسی",
    "مسیر شغلی سوم که با پروفایل همخوانی دارد به فارسی"
  ]
}

CRITICAL REQUIREMENTS:
1. Provide ONLY the JSON response, no additional text before or after
2. ALL text content MUST be in Persian (Farsi) language
3. Scores should be between 0-100
4. Be insightful, constructive, and encouraging
5. Use proper Persian grammar and vocabulary
6. Make recommendations specific and actionable
"""
        
        return prompt

    
    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse AI response and extract JSON"""
        print(f"[AI Service] Parsing response...")
        try:
            # Try to find JSON in the response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = response[start_idx:end_idx]
                parsed = json.loads(json_str)
                print(f"[AI Service] JSON parsed successfully!")
                return parsed
            else:
                print(f"[AI Service] No JSON found in response")
                return self._generate_fallback_analysis()
        
        except json.JSONDecodeError as e:
            print(f"[AI Service] JSON decode error: {e}")
            return self._generate_fallback_analysis()
        except Exception as e:
            print(f"[AI Service] Unexpected error in parsing: {e}")
            return self._generate_fallback_analysis()

    
    def _generate_fallback_analysis(self) -> Dict[str, Any]:
        """Generate a generic fallback analysis"""
        return {
            "personality_type": "فرد خودآگاه",
            "overall_score": 75,
            "traits": {
                "confidence": 70,
                "self_awareness": 80,
                "growth_mindset": 75,
                "resilience": 70,
                "strategic_thinking": 65
            },
            "summary": "بر اساس تحلیل SWOT شما، شما خودآگاهی خوبی از محیط شخصی و حرفه‌ای خود نشان می‌دهید. شما زمینه‌های کلیدی قوت را شناسایی کرده و فرصت‌های رشد را تشخیص می‌دهید. به تقویت نقاط قوت خود ادامه دهید و در عین حال به زمینه‌های قابل بهبود توجه کنید.",
            "key_strengths": [
                "توانایی‌های قوی در تأمل و خودشناسی",
                "آگاهی از نیازهای توسعه شخصی",
                "رویکرد فعال به خودسازی"
            ],
            "areas_for_improvement": [
                "ادامه توسعه زمینه‌های ضعف شناسایی شده",
                "ایجاد استراتژی‌هایی برای کاهش تهدیدها",
                "تقویت مهارت‌های برنامه‌ریزی استراتژیک"
            ],
            "recommendations": [
                "یک برنامه عملیاتی بر اساس تحلیل SWOT خود ایجاد کنید",
                "اهداف خاص و قابل اندازه‌گیری برای بهبود تعیین کنید",
                "به طور منظم تحلیل SWOT خود را بازبینی و به‌روزرسانی کنید"
            ],
            "career_suggestions": [
                "نقش‌هایی که از نقاط قوت شناسایی شده شما استفاده می‌کنند",
                "موقعیت‌هایی که فرصت‌های رشد ارائه می‌دهند",
                "زمینه‌هایی که با علایق و توانایی‌های شما همسو هستند"
            ]
        }

    
    def _analyze_answers_locally(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze answers locally using keyword matching and sentiment"""
        
        # Categorize answers
        categorized = {
            'strength': [],
            'weakness': [],
            'opportunity': [],
            'threat': []
        }
        
        for answer in answers:
            category = answer.get('category', '')
            answer_text = answer.get('answer', '').lower()
            if category in categorized:
                categorized[category].append(answer_text)
        
        # Analyze sentiment and keywords
        positive_keywords = ['good', 'great', 'excellent', 'strong', 'confident', 
                           'skilled', 'talented', 'creative', 'leader', 'organized', 
                           'خوب', 'عالی', 'قوی', 'مطمئن', 'ماهر', 'خلاق', 'رهبر', 'سازمان']
        negative_keywords = ['weak', 'poor', 'lack', 'struggle', 'difficult', 
                           'problem', 'issue', 'ضعیف', 'کم', 'مشکل', 'سخت', 'نقص']
        
        # Count positive and negative indicators
        positive_count = 0
        negative_count = 0
        total_length = 0
        
        for strength in categorized['strength']:
            total_length += len(strength)
            for keyword in positive_keywords:
                if keyword in strength:
                    positive_count += 2
        
        for weakness in categorized['weakness']:
            total_length += len(weakness)
            for keyword in negative_keywords:
                if keyword in weakness:
                    negative_count += 1
        
        for opp in categorized['opportunity']:
            total_length += len(opp)
            for keyword in positive_keywords:
                if keyword in opp:
                    positive_count += 1
        
        for threat in categorized['threat']:
            total_length += len(threat)
            for keyword in negative_keywords:
                if keyword in threat:
                    negative_count += 1

        
        # Calculate scores based on analysis
        detail_score = min(100, (total_length // 50) * 10 + 50)
        positivity_ratio = positive_count / max(1, positive_count + negative_count)
        
        # Base scores
        confidence = int(50 + (positivity_ratio * 40) + (len(categorized['strength']) * 5))
        self_awareness = int(60 + (total_length // 100) * 10)
        growth_mindset = int(55 + (len(categorized['opportunity']) * 8))
        resilience = int(50 + (positivity_ratio * 35))
        strategic_thinking = int(55 + (len(categorized['opportunity']) * 7))
        
        # Cap at 100
        confidence = min(100, confidence)
        self_awareness = min(100, self_awareness)
        growth_mindset = min(100, growth_mindset)
        resilience = min(100, resilience)
        strategic_thinking = min(100, strategic_thinking)
        
        overall_score = int((confidence + self_awareness + growth_mindset + resilience + strategic_thinking) / 5)
        
        # Determine personality type
        if confidence > 75 and strategic_thinking > 70:
            personality_type = "رهبر استراتژیک"
        elif self_awareness > 80:
            personality_type = "متفکر خودآگاه"
        elif growth_mindset > 75:
            personality_type = "یادگیرنده پویا"
        elif resilience > 75:
            personality_type = "فرد انعطاف‌پذیر"
        else:
            personality_type = "فرد در حال رشد"
        
        # Generate summary
        summary = f"بر اساس تحلیل SWOT شما، شما به عنوان {personality_type} شناخته می‌شوید. "
        
        if overall_score >= 75:
            summary += "شما خودآگاهی بالایی دارید و نقاط قوت خود را به خوبی می‌شناسید. "
        elif overall_score >= 60:
            summary += "شما در مسیر خودشناسی و رشد شخصی قرار دارید. "
        else:
            summary += "شما در ابتدای مسیر خودشناسی هستید و فرصت‌های زیادی برای رشد دارید. "
        
        summary += "با تمرکز بر نقاط قوت و کار بر روی زمینه‌های قابل بهبود، می‌توانید به اهداف خود دست یابید."

        
        return {
            "personality_type": personality_type,
            "overall_score": overall_score,
            "traits": {
                "confidence": confidence,
                "self_awareness": self_awareness,
                "growth_mindset": growth_mindset,
                "resilience": resilience,
                "strategic_thinking": strategic_thinking
            },
            "summary": summary,
            "key_strengths": [
                f"شناسایی {len(categorized['strength'])} نقطه قوت مهم",
                "آگاهی از توانمندی‌های شخصی",
                "نگرش مثبت به رشد و توسعه"
            ],
            "areas_for_improvement": [
                f"کار بر روی {len(categorized['weakness'])} زمینه ضعف شناسایی شده",
                "تقویت مهارت‌های مدیریت چالش‌ها",
                "توسعه برنامه‌ریزی استراتژیک"
            ],
            "recommendations": [
                "یک برنامه عملیاتی مشخص برای بهبود نقاط ضعف تدوین کنید",
                "از فرصت‌های شناسایی شده برای رشد استفاده کنید",
                "به طور منظم پیشرفت خود را ارزیابی کنید"
            ],
            "career_suggestions": [
                "مشاغلی که با نقاط قوت شما همخوانی دارند",
                "نقش‌هایی که فرصت یادگیری و رشد ارائه می‌دهند",
                "زمینه‌هایی که به مهارت‌های شما نیاز دارند"
            ]
        }


# Singleton instance
_analyzer = None

def get_ai_analyzer() -> SWOTAIAnalyzer:
    """Get or create AI analyzer instance"""
    global _analyzer
    if _analyzer is None:
        _analyzer = SWOTAIAnalyzer()
    return _analyzer
