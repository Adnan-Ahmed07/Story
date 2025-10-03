import { Heart, MessageCircle, Calendar } from 'lucide-react';
import type { StoryWithCommentCount } from '../lib/supabase';

interface StoryCardProps {
  story: StoryWithCommentCount;
  onClick: () => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExcerpt = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 border-transparent hover:border-rose-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 group-hover:fill-current transition-all" />
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-2">
            {story.title}
          </h3>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed">
        {getExcerpt(story.content)}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(story.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{story.comment_count || 0} {story.comment_count === 1 ? 'comment' : 'comments'}</span>
          </div>
        </div>
        <span className="text-rose-600 font-medium">by {story.author_name}</span>
      </div>
    </div>
  );
}
