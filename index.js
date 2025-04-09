
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// GET /api/posts
app.get("/api/posts", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(full_name, email)")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/posts
app.post("/api/posts", async (req, res) => {
  const { author_id, content } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ author_id, content }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ GROWTH API running on port ${PORT}`);
});

