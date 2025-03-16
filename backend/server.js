import express from "express";
import cors from "cors";
import postsRoutes from "./routes/posts.js";
import commentsRoutes from "./routes/comments.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/posts", postsRoutes);
app.use("/posts/:id/comments", commentsRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
