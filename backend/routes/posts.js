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

// ✅ Read posts from file
const getPosts = () => JSON.parse(fs.readFileSync(postsFile, "utf-8"));

// ✅ Write posts to file
const savePosts = (posts) => fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

// ✅ Fetch posts with pagination & sorting
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const posts = getPosts();
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const paginatedPosts = sortedPosts.slice((page - 1) * 15, page * 15);
  res.json(paginatedPosts);
});

// ✅ Create a new post
router.post("/", (req, res) => {
  const newPost = { id: uuidv4(), date: new Date().toISOString(), bookmarked: false, ...req.body };
  const validation = validatePost(newPost);
  if (!validation.success) return res.status(400).json(validation.error);

  const posts = getPosts();
  posts.push(newPost);
  savePosts(posts);
  res.status(201).json(newPost);
});

// ✅ Update a post
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const posts = getPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts[index] = { ...posts[index], ...req.body };
  savePosts(posts);
  res.json(posts[index]);
});

// ✅ Toggle Bookmark Status
router.patch("/:id/bookmark", (req, res) => {
  const { id } = req.params;
  const posts = getPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts[index].bookmarked = !posts[index].bookmarked; // Toggle bookmark status
  savePosts(posts);
  res.json(posts[index]);
});

// ✅ Delete a post
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let posts = getPosts();

  // Check if the post exists
  const postExists = posts.some((post) => post.id === id);
  if (!postExists) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Filter out the post to be deleted
  posts = posts.filter((post) => post.id !== id);
  savePosts(posts);

  res.json({ message: "Post deleted successfully", id });
});


// ✅ Search posts by title
router.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase();
  const posts = getPosts();
  const results = query ? posts.filter((p) => p.title.toLowerCase().includes(query)) : posts.slice(0, 15);
  res.json(results);
});

// ✅ Export posts to Markdown & ZIP
router.get("/export", async (req, res) => {
  await exportPostsToMarkdown(res);
});

export default router;
