import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialise Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test de connexion
app.get('/', (req, res) => {
  res.send('🎉 GROWTH API is running !');
});

// Récupérer tous les posts
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(full_name, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur récupération posts :', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Ajouter un post
app.post('/api/posts', async (req, res) => {
  const { content, author_id } = req.body;

  // Sécurité : vérifier que les deux champs sont présents
  if (!content || !author_id) {
    return res.status(400).json({ error: 'Champ content ou author_id manquant' });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([{ content, author_id }]);

  if (error) {
    console.error('Erreur création post :', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

