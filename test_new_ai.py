"""
Test script for new AI service
Run with: python test_new_ai.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from swot.ai_service_new import get_ai_analyzer

def test_ai_service():
    """Test the new AI service"""
    print("=" * 60)
    print("Testing New AI Service")
    print("=" * 60)
    
    # Get analyzer instance
    analyzer = get_ai_analyzer()
    
    # Check provider status
    print(f"\nActive Provider: {analyzer.config_manager.get_active_provider()}")
    print(f"Provider Ready: {analyzer.provider.is_ready() if analyzer.provider else False}")
    
    if analyzer.provider:
        print(f"Provider Name: {analyzer.provider.get_name()}")
    
    # Test with sample answers
    print("\n" + "=" * 60)
    print("Running Test Analysis")
    print("=" * 60)
    
    test_answers = [
        {
            'category': 'strength',
            'question': 'نقاط قوت شما چیست؟',
            'answer': 'من در حل مسئله و تفکر تحلیلی مهارت دارم. همچنین در کار تیمی خوب هستم.'
        },
        {
            'category': 'strength',
            'question': 'بهترین مهارت‌های شما کدامند؟',
            'answer': 'برنامه‌نویسی، یادگیری سریع، و خلاقیت در حل مشکلات'
        },
        {
            'category': 'weakness',
            'question': 'نقاط ضعف شما چیست؟',
            'answer': 'گاهی در مدیریت زمان مشکل دارم و کمی کمال‌گرا هستم'
        },
        {
            'category': 'opportunity',
            'question': 'چه فرصت‌هایی برای رشد دارید؟',
            'answer': 'می‌توانم در پروژه‌های متن‌باز شرکت کنم و مهارت‌های جدید یاد بگیرم'
        },
        {
            'category': 'threat',
            'question': 'چه چالش‌هایی پیش رو دارید؟',
            'answer': 'رقابت زیاد در بازار کار و نیاز به یادگیری مداوم'
        }
    ]
    
    try:
        result = analyzer.analyze_swot_answers(test_answers)
        
        print("\n✅ Analysis Successful!")
        print("\n" + "=" * 60)
        print("Results:")
        print("=" * 60)
        print(f"\nPersonality Type: {result.get('personality_type')}")
        print(f"Overall Score: {result.get('overall_score')}/100")
        
        print("\nTraits:")
        for trait, score in result.get('traits', {}).items():
            print(f"  - {trait}: {score}/100")
        
        print(f"\nSummary:\n{result.get('summary')}")
        
        print("\nKey Strengths:")
        for strength in result.get('key_strengths', []):
            print(f"  • {strength}")
        
        print("\nAreas for Improvement:")
        for area in result.get('areas_for_improvement', []):
            print(f"  • {area}")
        
        print("\nRecommendations:")
        for rec in result.get('recommendations', []):
            print(f"  • {rec}")
        
        print("\nCareer Suggestions:")
        for career in result.get('career_suggestions', []):
            print(f"  • {career}")
        
        print("\n" + "=" * 60)
        print("✅ Test Completed Successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_ai_service()
