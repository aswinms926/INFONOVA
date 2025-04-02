'use client';

import { useState, useEffect } from 'react';
import { readingTracker } from '@/lib/readingTracker';
import { useAuth } from '@/lib/AuthContext';
import { BentoGridItem } from './ui/BentoGrid';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const RecommendedArticles = () => {
  const [recommendations, setRecommendations] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user preferences
        const preferences = await readingTracker.getCategoryPreferences();
        
        if (!preferences) {
          setLoading(false);
          return;
        }

        // Sort categories by weight
        const sortedCategories = Object.entries(preferences.categories)
          .sort(([, a], [, b]) => b - a)
          .map(([category]) => category);

        // Fetch articles from preferred categories
        // This is where you'd integrate with your news API
        // For now, we'll use mock data
        const mockArticles: Article[] = sortedCategories.slice(0, 4).map((category, index) => ({
          id: `rec-${index}`,
          title: `Top ${category} Story`,
          description: `Latest news from your favorite ${category} category`,
          category
        }));

        setRecommendations(mockArticles);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-400">Sign in to see personalized recommendations</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-400">Start reading articles to get personalized recommendations</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {recommendations.map((article, i) => (
        <BentoGridItem
          key={article.id}
          id={i}
          title={article.title}
          description={article.description}
          className="md:col-span-1"
        />
      ))}
    </div>
  );
}; 