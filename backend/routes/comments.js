import express from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const commentsFile = path.join(__dirname, "../data/comments.json");

// ✅ Fetch all comments for a post
router.get("/", (req, res) => {
  const comments = JSON.parse(fs.readFileSync(commentsFile, "utf-8"));
  const postId = req.params.id;
  const postComments = comments.filter((comment) => comment.postId === postId);
  res.json(postComments);
});

// ✅ Add a new comment
router.post("/", (req, res) => {
  const comments = JSON.parse(fs.readFileSync(commentsFile, "utf-8"));
  const newComment = { id: uuidv4(), postId: req.params.id, ...req.body, date: new Date().toISOString() };
  comments.push(newComment);
  fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));
  res.status(201).json(newComment);
});

// ✅ Delete a comment
router.delete("/:commentId", (req, res) => {
  let comments = JSON.parse(fs.readFileSync(commentsFile, "utf-8"));
  const { commentId } = req.params;
  comments = comments.filter((comment) => comment.id !== commentId);
  fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));
  res.json({ message: "Comment deleted" });
});

// ✅ Correctly export the router as default
export default router;
