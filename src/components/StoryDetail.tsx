import { useState, useEffect } from 'react';
import { supabase, type Story, type Comment } from '../lib/supabase';
import CommentSection from './CommentSection';
import { ArrowLeft, Heart, Calendar, Loader2 } from 'lucide-react';

interface StoryDetailProps {
  storyId: string;
  onBack: () => void;
}

export default function StoryDetail({ storyId, onBack }: StoryDetailProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStoryAndComments();
  }, [storyId]);

  const fetchStoryAndComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .maybeSingle();

      if (storyError) throw storyError;
      if (!storyData) {
        setError('Story not found');
        return;
      }

      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      setStory(storyData);
      setComments(commentsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading story...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Stories
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error || 'Story not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6 transition font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Stories
      </button>

      <article className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">{story.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-rose-600">by {story.author_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(story.created_at)}</span>
          </div>
          <div>
            <span>{estimateReadTime(story.content)} min read</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.content}</p>
        </div>
      </article>

      <CommentSection
        storyId={storyId}
        comments={comments}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}
