import { useState, useEffect } from 'react';
import { supabase, type StoryWithCommentCount } from '../lib/supabase';
import StoryCard from './StoryCard';
import { Loader2, Heart } from 'lucide-react';

interface StoryListProps {
  onStoryClick: (storyId: string) => void;
  refreshTrigger?: number;
}

export default function StoryList({ onStoryClick, refreshTrigger }: StoryListProps) {
  const [stories, setStories] = useState<StoryWithCommentCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, [refreshTrigger]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (storiesError) throw storiesError;

      const storiesWithCounts = await Promise.all(
        (storiesData || []).map(async (story) => {
          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('story_id', story.id);

          return {
            ...story,
            comment_count: count || 0,
          };
        })
      );

      setStories(storiesWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading love stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-12 text-center">
        <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Love Stories Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Be the first to share your beautiful love story with the world!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} onClick={() => onStoryClick(story.id)} />
      ))}
    </div>
  );
}
