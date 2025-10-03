import { useState, useEffect } from 'react';
import { supabase, type Story, type Comment } from '../lib/supabase';
import CommentSection from './CommentSection';
import StoryForm from './StoryForm';
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
  const [editing, setEditing] = useState(false);

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
  <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8">
      <button
        onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-4 sm:mb-6 transition font-medium text-base sm:text-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Stories
      </button>

      {editing ? (
  <div className="mb-6 sm:mb-8">
          <StoryForm
            story={story}
            onSuccess={async () => {
              setEditing(false);
              await fetchStoryAndComments();
            }}
          />
          <button
            onClick={() => setEditing(false)}
            className="mt-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <article className="bg-white rounded-xl shadow-lg p-4 sm:p-8 md:p-12 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
              <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 leading-tight break-words">{story.title}</h1>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
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

            <div className="prose prose-base sm:prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{story.content}</p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 rounded bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow w-full sm:w-auto"
            >
              Edit Story
            </button>
          </article>

          <CommentSection
            storyId={storyId}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </>
      )}
    </div>
  );
}
