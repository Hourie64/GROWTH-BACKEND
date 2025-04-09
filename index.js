
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Get posts
app.get("/api/posts", async (req, res) => {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Create post
app.post("/api/posts", async (req, res) => {
  const { title, content, author_id } = req.body;
  const { data, error } = await supabase.from("posts").insert([{ title, content, author_id }]);
  if (error) return res.status(500).json({ error });
  res.status(201).json(data[0]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ GROWTH backend running on port ${PORT}`);
});
