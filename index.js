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

// POST /api/posts
app.post('/api/posts', async (req, res) => {
  const { content } = req.body;

  // ID temporaire d’un utilisateur par défaut
  const DEFAULT_AUTHOR_ID = "fab4beeb-e052-47db-b15e-00cd0ec0bf29";

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        content,
        author_id: DEFAULT_AUTHOR_ID,
      },
    ])
    .select("*, users(full_name, avatar_url)");

  if (error) {
    console.error("Erreur lors de la publication :", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});


// Post post (author_id temporaire forcé)
// Créer un post
app.post("/api/posts", async (req, res) => {
  const { content } = req.body;

  // Simule un user par défaut
  const DEFAULT_AUTHOR_ID = "8cc03a68-9015-4d1a-bb7b-c847a5b703c0";

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        content,
        author_id: DEFAULT_AUTHOR_ID,
      },
    ])
    .select("*, users(full_name, avatar_url)");

  if (error) {
    console.error("Erreur lors de la publication:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

// Démarrer serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 GROWTH API running on port ${PORT}`);
});
