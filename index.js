import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✅ Route test
app.get("/", (req, res) => {
  res.send("🎉 GROWTH API is running !");
});

// ✅ GET /api/posts
app.get("/api/posts", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, users(full_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// ✅ POST /api/posts
app.post("/api/posts", async (req, res) => {
  const { content } = req.body;

  const DEFAULT_AUTHOR_ID = "8cc03a68-9015-4d1a-bb7b-c847a5b703c0"; // ← ton user par défaut

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        content,
        title: "Post rapide",
        author_id: DEFAULT_AUTHOR_ID,
      },
    ])
    .select("*, users(full_name, avatar_url)");

  if (error) {
    console.error("Erreur création :", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 GROWTH API running on port ${PORT}`);
});
