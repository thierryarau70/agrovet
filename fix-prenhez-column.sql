-- Add the missing column to the animais table
ALTER TABLE public.animais 
ADD COLUMN IF NOT EXISTS status_prenhez text DEFAULT 'Vazia';

-- Small fix just in case the type was stored differently
-- You can run this in the Supabase SQL Editor
