from django.contrib import admin
from .models import News

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('headline', 'source', 'category', 'timestamp')
    list_filter = ('source', 'category')
    search_fields = ('headline', 'summary')
    ordering = ('-timestamp',) 