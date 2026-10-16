"""
Test script for AI SWOT Analysis
Run this to verify the AI service is working correctly
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from swot.ai_service import get_ai_analyzer

def test_ai_analysis():
    """Test the AI analyzer with sample SWOT data"""
    
    print("🧪 Testing AI SWOT Analysis Service...")
    print("-" * 50)
    
    # Sample SWOT answers
    sample_answers = [
        {
            'category': 'strength',
            'question': 'What are your top 3 personal strengths?',
            'answer': 'I am a good problem solver, I work well in teams, and I am very organized.'
        },
        {
            'category': 'strength',
            'question': 'What skills do you excel at?',
            'answer': 'Programming, data analysis, and communication.'
        },
        {
            'category': 'weakness',
            'question': 'What areas do you need to improve?',
            'answer': 'Time management and public speaking.'
        },
        {
            'category': 'weakness',
            'question': 'What challenges do you face?',
            'answer': 'Sometimes I procrastinate and struggle with deadlines.'
        },
        {
            'category': 'opportunity',
            'question': 'What opportunities are available to you?',
            'answer': 'There are many online courses and networking events in my field.'
        },
        {
            'category': 'opportunity',
            'question': 'What trends can you take advantage of?',
            'answer': 'The growing demand for data scientists and AI specialists.'
        },
        {
            'category': 'threat',
            'question': 'What obstacles do you face?',
            'answer': 'High competition in the job market and rapid technology changes.'
        },
        {
            'category': 'threat',
            'question': 'What external factors concern you?',
            'answer': 'Economic uncertainty and the need to constantly update skills.'
        }
    ]
    
    try:
        # Get analyzer
        analyzer = get_ai_analyzer()
        print(f"✅ AI Analyzer initialized")
        print(f"   g4f client: {'Available' if analyzer.client else 'Not available (using fallback)'}")
        print()
        
        # Run analysis
        print("🤖 Running AI analysis...")
        results = analyzer.analyze_swot_answers(sample_answers)
        
        # Display results
        print("\n" + "=" * 50)
        print("📊 ANALYSIS RESULTS")
        print("=" * 50)
        print(f"\n🎯 Personality Type: {results.get('personality_type', 'N/A')}")
        print(f"📈 Overall Score: {results.get('overall_score', 0)}/100")
        
        print("\n🧠 Personality Traits:")
        traits = results.get('traits', {})
        for trait, score in traits.items():
            bar = "█" * (score // 5) + "░" * (20 - score // 5)
            print(f"   {trait.replace('_', ' ').title():20s} [{bar}] {score}%")
        
        print("\n💪 Key Strengths:")
        for i, strength in enumerate(results.get('key_strengths', []), 1):
            print(f"   {i}. {strength}")
        
        print("\n🎯 Areas for Improvement:")
        for i, area in enumerate(results.get('areas_for_improvement', []), 1):
            print(f"   {i}. {area}")
        
        print("\n💡 Recommendations:")
        for i, rec in enumerate(results.get('recommendations', []), 1):
            print(f"   {i}. {rec}")
        
        print("\n💼 Career Suggestions:")
        for i, career in enumerate(results.get('career_suggestions', []), 1):
            print(f"   {i}. {career}")
        
        print("\n📝 Summary:")
        print(f"   {results.get('summary', 'N/A')}")
        
        print("\n" + "=" * 50)
        print("✅ Test completed successfully!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_ai_analysis()
