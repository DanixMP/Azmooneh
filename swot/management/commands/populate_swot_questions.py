from django.core.management.base import BaseCommand
from swot.models import SWOTQuestion


class Command(BaseCommand):
    help = 'Populate SWOT questions from the notebook'

    def handle(self, *args, **kwargs):
        questions_data = [
            # نقاط قوت (Strengths)
            {"q": "نقاط قوت شما چیست؟ توانایی‌ها یا مهارت‌هایی که شما را از دیگران متمایز می‌کند؟", "type": "strength", "order": 1},
            {"q": "چه مهارت‌های برجسته‌ای دارید؟", "type": "strength", "order": 2},
            {"q": "نظر دیگران درباره نقاط قوت شما چیست؟", "type": "strength", "order": 3},

            # نقاط ضعف (Weaknesses)
            {"q": "نقاط ضعف یا محدودیت‌های خود را لیست کنید.", "type": "weakness", "order": 4},
            {"q": "آیا عادات نامطلوبی دارید؟ اگر بله، کدام‌ها؟", "type": "weakness", "order": 5},
            {"q": "نظر دیگران درباره نقاط ضعف شما چیست؟", "type": "weakness", "order": 6},

            # فرصت‌ها (Opportunities)
            {"q": "چه فرصت‌هایی در محیط یا اطراف شما وجود دارد که می‌توانید از آن‌ها برای رشد استفاده کنید؟", "type": "opportunity", "order": 7},
            {"q": "چه مهارت‌های جدیدی می‌توانید یاد بگیرید تا مزیت رقابتی پیدا کنید؟", "type": "opportunity", "order": 8},

            # تهدیدها (Threats)
            {"q": "چه تهدیدهایی ممکن است مانع پیشرفت شما شوند؟", "type": "threat", "order": 9},
            {"q": "آیا ویژگی‌های شخصی شما ممکن است رسیدن به اهداف را محدود کنند؟", "type": "threat", "order": 10},
            {"q": "چه موانع خارجی (مثل رقابت یا تغییرات تکنولوژی) ممکن است شما را تهدید کنند؟", "type": "threat", "order": 11}
        ]

        # Clear existing questions
        SWOTQuestion.objects.all().delete()

        # Create new questions
        for q_data in questions_data:
            SWOTQuestion.objects.create(
                question_text=q_data['q'],
                category=q_data['type'],
                order=q_data['order'],
                is_active=True
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(questions_data)} SWOT questions'))
