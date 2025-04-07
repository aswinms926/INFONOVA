from django.core.management.base import BaseCommand
from app.models import News
import requests
from datetime import datetime

class Command(BaseCommand):
    help = 'Sync news from FastAPI to database'

    def handle(self, *args, **options):
        try:
            # Fetch news from FastAPI
            response = requests.get('http://localhost:8003/news')
            news_items = response.json()

            # Import each news item
            for item in news_items:
                News.objects.get_or_create(
                    headline=item['headline'],
                    defaults={
                        'summary': item['summary'],
                        'url': item['url'],
                        'source': item['source'],
                        'timestamp': datetime.fromisoformat(item['timestamp']),
                        'category': item['category']
                    }
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully synced: {item["headline"]}'))

            self.stdout.write(self.style.SUCCESS('Successfully synced all news items'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error syncing news: {str(e)}')) 