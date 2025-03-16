import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { validatePost } from "../utils/validate.js";
import { exportPostsToMarkdown } from "../utils/exportPosts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const postsFile = path.join(__dirname, "../data/posts.json");

// ✅ Fetch posts with pagination & sorting
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const paginatedPosts = sortedPosts.slice((page - 1) * 15, page * 15);
  res.json(paginatedPosts);
});

// ✅ Create a new post
router.post("/", (req, res) => {
  const newPost = { id: uuidv4(), date: new Date().toISOString(), ...req.body };
  const validation = validatePost(newPost);
  if (!validation.success) return res.status(400).json(validation.error);

  const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.status(201).json(newPost);
});

// ✅ Update a post
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts[index] = { ...posts[index], ...req.body };
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json(posts[index]);
});

// ✅ Delete a post
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  posts = posts.filter((post) => post.id !== id);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json({ message: "Post deleted" });
});

// ✅ Search posts by title
router.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase();
  const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  const results = query ? posts.filter((p) => p.title.toLowerCase().includes(query)) : posts.slice(0, 15);
  res.json(results);
});

// ✅ Export posts to Markdown & ZIP
router.get("/export", async (req, res) => {
  await exportPostsToMarkdown(res);
});

export default router;
