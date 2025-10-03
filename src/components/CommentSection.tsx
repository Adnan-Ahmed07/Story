import { useState } from 'react';
import { supabase, type Comment } from '../lib/supabase';
import { MessageCircle, Send, Loader2, User } from 'lucide-react';

interface CommentSectionProps {
  storyId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentSection({ storyId, comments, onCommentAdded }: CommentSectionProps) {
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (commenterName.trim().length < 2) {
      setError('Please enter your name');
      return;
    }

    if (commentText.trim().length < 3) {
      setError('Comment must be at least 3 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: submitError } = await supabase
        .from('comments')
        .insert([
          {
            story_id: storyId,
            commenter_name: commenterName.trim(),
            comment_text: commentText.trim(),
          },
        ])
        .select()
        .single();

      if (submitError) throw submitError;

      setCommenterName('');
      setCommentText('');
      onCommentAdded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-rose-500" />
        <h2 className="text-2xl font-bold text-gray-800">
          Comments ({comments.length})
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b border-gray-200">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-sm"
              required
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>

          <div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts on this love story..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition resize-none text-sm"
              rows={3}
              required
              disabled={isSubmitting}
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-gray-500">{commentText.length}/1000 characters</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-rose-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post Comment
              </>
            )}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{comment.commenter_name}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.comment_text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
