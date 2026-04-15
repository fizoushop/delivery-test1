/*
  # Create todos table

  1. New Tables
    - `todos`
      - `id` (uuid, primary key) - Unique identifier for each todo
      - `task` (text) - Description of the todo task
      - `completed` (boolean, default false) - Whether the task is completed
      - `created_at` (timestamptz) - When the todo was created
  
  2. Security
    - Enable RLS on `todos` table
    - Add public access policies for this demo app
      - Allow anyone to read todos
      - Allow anyone to insert new todos
      - Allow anyone to update todos
      - Allow anyone to delete todos
*/

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view todos"
  ON todos FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert todos"
  ON todos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update todos"
  ON todos FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete todos"
  ON todos FOR DELETE
  USING (true);