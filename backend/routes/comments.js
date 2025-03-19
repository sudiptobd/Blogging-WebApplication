import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const commentsFile = path.join(__dirname, "../data/comments.json");

// ✅ Read comments from file
const getComments = () => JSON.parse(fs.readFileSync(commentsFile, "utf-8"));

// ✅ Write comments to file
const saveComments = (comments) => fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));

// ✅ Fetch all comments
router.get("/", (req, res) => {
  const comments = getComments();
  res.json(comments);
});

// ✅ Fetch all comments for a post
router.get("/:postId", (req, res) => {
  const { postId } = req.params;
  const comments = getComments().filter(comment => comment.postId === postId);
  res.json(comments);
});

// ✅ Add a comment to a post
router.post("/:postId", (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ message: "Author and content are required." });
  }

  const newComment = {
    id: uuidv4(),
    postId,
    author,
    content,
    date: new Date().toISOString(),
  };

  const comments = getComments();
  comments.push(newComment);
  saveComments(comments);

  res.status(201).json(newComment);
});

// ✅ Delete a comment
router.delete("/:commentId", (req, res) => {
  const { commentId } = req.params;
  let comments = getComments();
  
  if (!comments.some(comment => comment.id === commentId)) {
    return res.status(404).json({ message: "Comment not found." });
  }

  comments = comments.filter(comment => comment.id !== commentId);
  saveComments(comments);

  res.json({ message: "Comment deleted successfully", id: commentId });
});

export default router;
