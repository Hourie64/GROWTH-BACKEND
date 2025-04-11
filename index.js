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

// Route test
app.get('/', (req, res) => {
  res.send('🎉 GROWTH API is running !');
});

// Récupérer les posts avec les infos de l’auteur
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(full_name, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erreur récupération des posts:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Créer un nouveau post
app.post('/api/posts', async (req, res) => {
  const { content } = req.body;

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.user) {
    console.error('❌ Aucun utilisateur connecté');
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([{ content, author_id: user.user.id }]);

  if (error) {
    console.error('❌ Erreur création post:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

// Démarrage du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 GROWTH API running on port ${PORT}`);
});
