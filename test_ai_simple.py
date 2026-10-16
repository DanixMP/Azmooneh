"""
Simple test to check if AI is working with actual different inputs
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from swot.ai_service import get_ai_analyzer

def test_different_inputs():
    """Test with two different inputs to see if results differ"""
    
    analyzer = get_ai_analyzer()
    
    # Test 1: Positive answers
    print("=" * 60)
    print("TEST 1: Positive Student")
    print("=" * 60)
    
    answers1 = [
        {'category': 'strength', 'question': 'What are your strengths?', 'answer': 'I am very confident, creative, and a natural leader'},
        {'category': 'weakness', 'question': 'What are your weaknesses?', 'answer': 'Sometimes I can be too perfectionist'},
        {'category': 'opportunity', 'question': 'What opportunities do you have?', 'answer': 'Many leadership positions available'},
        {'category': 'threat', 'question': 'What are the threats?', 'answer': 'High competition but I can handle it'},
    ]
    
    result1 = analyzer.analyze_swot_answers(answers1)
    print(f"\nPersonality Type: {result1['personality_type']}")
    print(f"Overall Score: {result1['overall_score']}")
    print(f"Confidence: {result1['traits']['confidence']}")
    
    # Test 2: Negative answers
    print("\n" + "=" * 60)
    print("TEST 2: Struggling Student")
    print("=" * 60)
    
    answers2 = [
        {'category': 'strength', 'question': 'What are your strengths?', 'answer': 'I try hard but not sure what I am good at'},
        {'category': 'weakness', 'question': 'What are your weaknesses?', 'answer': 'I lack confidence, procrastinate a lot, and struggle with time management'},
        {'category': 'opportunity', 'question': 'What opportunities do you have?', 'answer': 'Not many opportunities available to me'},
        {'category': 'threat', 'question': 'What are the threats?', 'answer': 'Very high competition and I feel overwhelmed'},
    ]
    
    result2 = analyzer.analyze_swot_answers(answers2)
    print(f"\nPersonality Type: {result2['personality_type']}")
    print(f"Overall Score: {result2['overall_score']}")
    print(f"Confidence: {result2['traits']['confidence']}")
    
    # Compare
    print("\n" + "=" * 60)
    print("COMPARISON")
    print("=" * 60)
    
    if result1['personality_type'] == result2['personality_type']:
        print("⚠️  WARNING: Same personality type for different inputs!")
    else:
        print("✅ Different personality types - AI is working!")
    
    if result1['overall_score'] == result2['overall_score']:
        print("⚠️  WARNING: Same overall score for different inputs!")
    else:
        print("✅ Different scores - AI is working!")
    
    if result1['traits']['confidence'] == result2['traits']['confidence']:
        print("⚠️  WARNING: Same confidence score for different inputs!")
    else:
        print("✅ Different confidence scores - AI is working!")

if __name__ == '__main__':
    test_different_inputs()
