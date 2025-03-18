import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001"; // Match with backend

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) return alert("All fields are required!");

    try {
      const newPost = {
        title,
        content,
        author,
        tags: tags.split(",").map((tag) => tag.trim()), // Convert comma-separated tags to array
      };

      await axios.post(`${API_BASE_URL}/posts`, newPost);
      alert("Post added successfully!");
      setTitle("");
      setContent("");
      setAuthor("");
      setTags("");
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Failed to add post.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">📝 Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
