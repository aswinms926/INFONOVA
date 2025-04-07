from django.db import models

class News(models.Model):
    headline = models.CharField(max_length=255)
    summary = models.TextField()
    url = models.URLField()
    source = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    category = models.CharField(max_length=50)

    def __str__(self):
        return self.headline

    class Meta:
        verbose_name_plural = "News"
        ordering = ['-timestamp'] 