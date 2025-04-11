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

// Test route
app.get('/', (req, res) => {
  res.send('🎉 GROWTH API is running !');
});

// Get posts
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erreur récupération des posts:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Post post (author_id temporaire forcé)
app.post('/api/posts', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Le contenu est requis.' });
  }

  const author_id = '00000000-0000-0000-0000-000000000001'; // UUID utilisateur par défaut

  const { data, error } = await supabase
    .from('posts')
    .insert([{ content, author_id }])
    .select();

  if (error) {
    console.error('❌ Erreur création post:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

// Démarrer serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 GROWTH API running on port ${PORT}`);
});
