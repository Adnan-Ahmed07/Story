import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Loader2 } from 'lucide-react';

interface StoryFormProps {
  onSuccess: () => void;
}

export default function StoryForm({ onSuccess }: StoryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long');
      return;
    }

    if (content.trim().length < 50) {
      setError('Story must be at least 50 characters long');
      return;
    }

    if (authorName.trim().length < 2) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: submitError } = await supabase.from('stories').insert([
        {
          title: title.trim(),
          content: content.trim(),
          author_name: authorName.trim(),
        },
      ]);

      if (submitError) throw submitError;

      setTitle('');
      setContent('');
      setAuthorName('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
        <h2 className="text-3xl font-bold text-gray-800">Share Your Love Story</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Story Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your love story a beautiful title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
            required
            disabled={isSubmitting}
            maxLength={200}
          />
          <p className="mt-1 text-sm text-gray-500">{title.length}/200 characters</p>
        </div>

        <div>
          <label htmlFor="authorName" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
            required
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Love Story
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell us your beautiful love story... How did you meet? What makes your relationship special?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition resize-none"
            rows={12}
            required
            disabled={isSubmitting}
            maxLength={10000}
          />
          <p className="mt-1 text-sm text-gray-500">{content.length}/10000 characters</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-rose-600 hover:to-pink-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sharing Your Story...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              Share Love Story
            </>
          )}
        </button>
      </div>
    </form>
  );
}
