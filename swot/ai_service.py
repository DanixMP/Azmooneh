"""
AI Service for SWOT Analysis using Groq API
Analyzes student answers and determines personality traits
"""
import os
import json
from typing import Dict, List, Any
from django.conf import settings

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    print("Warning: groq library not installed. Install with: pip install groq")


class SWOTAIAnalyzer:
    """AI-powered SWOT analysis using Groq API"""
    
    def __init__(self):
        self.client = None
        self.api_key = None
        self._load_api_key()
        self._initialize_client()
    
    def _load_api_key(self):
        """Load Groq API key from g4f.txt file"""
        try:
            g4f_path = os.path.join(settings.BASE_DIR, 'g4f.txt')
            with open(g4f_path, 'r', encoding='utf-8') as f:
                content = f.read()
                for line in content.split('\n'):
                    if 'groq_api_key' in line.lower() and ':' in line:
                        self.api_key = line.split(':', 1)[1].strip().strip('"').strip()
                        if self.api_key and self.api_key != "gsk_YOUR_GROQ_API_KEY_HERE":
                            print(f"[AI Service] Groq API key loaded: {self.api_key[:20]}...")
                        else:
                            print("[AI Service] Groq API key placeholder found - please add real key")
                            self.api_key = None
                        break
        except Exception as e:
            print(f"[AI Service] Error loading Groq API key: {e}")
    
    def _initialize_client(self):
        """Initialize Groq client"""
        if not GROQ_AVAILABLE:
            print("[AI Service] Groq library not available, using local analysis")
            return
        
        if not self.api_key:
            print("[AI Service] No Groq API key found, using local analysis")
            print("[AI Service] Get free API key from: https://console.groq.com/keys")
            return
        
        try:
            self.client = Groq(api_key=self.api_key)
            print("[AI Service] Groq client initialized successfully")
        except Exception as e:
            print(f"[AI Service] Error initializing Groq client: {e}")
            self.client = None
    
    def analyze_swot_answers(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze SWOT answers and generate personality insights
        
        Args:
            answers: List of dicts with 'category', 'question', 'answer'
        
        Returns:
            Dict with personality analysis results
        """
        print(f"[AI Service] Starting analysis with {len(answers)} answers")
        
        if not self.client:
            print("[AI Service] No client available, using local analysis")
            return self._analyze_answers_locally(answers)
        
        # Prepare the prompt for AI analysis
        prompt = self._build_analysis_prompt(answers)
        print(f"[AI Service] Prompt built, length: {len(prompt)} characters")
        
        try:
            # Call g4f client
            print("[AI Service] Calling g4f client...")
            response = self._call_g4f_client(prompt)
            print(f"[AI Service] Got response, length: {len(response)} characters")
            print(f"[AI Service] Response preview: {response[:200]}...")
            
            # Parse and structure the response
            analysis = self._parse_ai_response(response)
            print(f"[AI Service] Analysis parsed successfully")
            print(f"[AI Service] Personality type: {analysis.get('personality_type', 'N/A')}")
            
            return analysis
        
        except Exception as e:
            print(f"[AI Service] ERROR: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            print("[AI Service] Falling back to local analysis")
            return self._analyze_answers_locally(answers)
    
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
    
    def _call_g4f_client(self, prompt: str) -> str:
        """Make API call using Groq client"""
        
        try:
            print(f"[AI Service] Calling Groq API...")
            
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Fast and capable model
                messages=[
                    {
                        "role": "system",
                        "content": "شما یک روانشناس متخصص و مشاور شغلی هستید که در ارزیابی شخصیت و تحلیل SWOT تخصص دارید. همه پاسخ‌های شما باید به زبان فارسی (پارسی) باشند. از واژگان دقیق، حرفه‌ای و تشویق‌کننده استفاده کنید. تحلیل‌های شما باید عمیق، سازنده و قابل اجرا باشند."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            result = response.choices[0].message.content
            print(f"[AI Service] Groq API call successful")
            return result
            
        except Exception as e:
            print(f"[AI Service] Groq API error: {type(e).__name__}: {str(e)}")
            raise
    
    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse AI response and extract JSON"""
        print(f"[AI Service] Parsing response...")
        try:
            # Try to find JSON in the response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            print(f"[AI Service] JSON boundaries: start={start_idx}, end={end_idx}")
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = response[start_idx:end_idx]
                print(f"[AI Service] Extracted JSON length: {len(json_str)}")
                parsed = json.loads(json_str)
                print(f"[AI Service] JSON parsed successfully!")
                return parsed
            else:
                print(f"[AI Service] No JSON found in response, using fallback")
                return self._generate_fallback_analysis()
        
        except json.JSONDecodeError as e:
            print(f"[AI Service] JSON decode error: {e}")
            print(f"[AI Service] Failed JSON: {json_str[:500] if 'json_str' in locals() else 'N/A'}")
            return self._generate_fallback_analysis()
        except Exception as e:
            print(f"[AI Service] Unexpected error in parsing: {e}")
            return self._generate_fallback_analysis()
    
    def _generate_fallback_analysis(self, answers: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate a dynamic fallback analysis based on answers"""
        
        # If we have answers, analyze them to generate personalized results
        if answers:
            return self._analyze_answers_locally(answers)
        
        # Otherwise return generic fallback
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
        positive_keywords = ['good', 'great', 'excellent', 'strong', 'confident', 'skilled', 'talented', 'creative', 'leader', 'organized', 'خوب', 'عالی', 'قوی', 'مطمئن', 'ماهر', 'خلاق', 'رهبر', 'سازمان']
        negative_keywords = ['weak', 'poor', 'lack', 'struggle', 'difficult', 'problem', 'issue', 'ضعیف', 'کم', 'مشکل', 'سخت', 'نقص']
        
        # Count positive and negative indicators
        positive_count = 0
        negative_count = 0
        total_length = 0
        
        for strength in categorized['strength']:
            total_length += len(strength)
            for keyword in positive_keywords:
                if keyword in strength:
                    positive_count += 2  # Strengths count more
        
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
        detail_score = min(100, (total_length // 50) * 10 + 50)  # More detailed = higher score
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
