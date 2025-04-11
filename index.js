import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// GET : récupérer les posts
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(full_name, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST : ajouter un post
app.post('/api/posts', async (req, res) => {
  const { content } = req.body;

  const { data: user } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const { data, error } = await supabase
    .from('posts')
    .insert([{ content, author_id: userId }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 GROWTH API running on port ${PORT}`);
});
