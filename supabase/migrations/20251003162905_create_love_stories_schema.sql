/*
  # Love Stories Platform Database Schema

  1. New Tables
    - `stories`
      - `id` (uuid, primary key) - Unique identifier for each story
      - `title` (text) - The title of the love story
      - `content` (text) - The full text of the love story
      - `author_name` (text) - Name of the person sharing their story
      - `created_at` (timestamptz) - When the story was published
      - `updated_at` (timestamptz) - When the story was last modified
    
    - `comments`
      - `id` (uuid, primary key) - Unique identifier for each comment
      - `story_id` (uuid, foreign key) - Reference to the story being commented on
      - `commenter_name` (text) - Name of the person commenting
      - `comment_text` (text) - The comment content
      - `created_at` (timestamptz) - When the comment was posted

  2. Security
    - Enable RLS on both tables
    - Allow public read access for all stories and comments
    - Allow public write access for creating stories and comments (open platform)
    
  3. Indexes
    - Add index on story_id in comments table for faster comment lookups
    - Add index on created_at for sorting stories by date
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  commenter_name text NOT NULL,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON comments(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Stories policies: Allow everyone to read and create stories
CREATE POLICY "Anyone can view stories"
  ON stories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create stories"
  ON stories FOR INSERT
  WITH CHECK (true);

-- Comments policies: Allow everyone to read and create comments
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  WITH CHECK (true);