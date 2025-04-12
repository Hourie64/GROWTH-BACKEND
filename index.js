import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get('/', (req, res) => {
  res.send('🎉 GROWTH API is running !');
});

app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(full_name, avatar_url)');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/api/posts', async (req, res) => {
  const { content } = req.body;
  const DEFAULT_AUTHOR_ID = 'TON_UUID_ICI'; // à remplacer par l'UUID "Utilisateur par défaut"
  const { data, error } = await supabase
    .from('posts')
    .insert([{ content, author_id: DEFAULT_AUTHOR_ID }])
    .select('*, users(full_name, avatar_url)');

  if (error) {
    console.error('Erreur lors de la publication :', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 GROWTH API running on port ${PORT}`);
});
