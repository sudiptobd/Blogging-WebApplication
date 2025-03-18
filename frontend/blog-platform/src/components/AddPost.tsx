import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5001"; // Ensure this matches your backend

function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) {
      setError("⚠️ All fields are required.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/posts`, {
        title,
        content,
        author,
        tags: tags.split(",").map(tag => tag.trim()), // Convert to an array
      });
      setSuccess("✅ Post added successfully!");
      setError("");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setError("❌ Failed to add post. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left">📝 Add New Post</h2>

      {/* Success & Error Messages */}
      {success && <p className="mb-4 text-green-600 font-semibold">{success}</p>}
      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>

        {/* Content Field */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-1">Content</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content..."
          />
        </div>

        {/* Author Field */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Tags Field */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., react, frontend, javascript"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full px-4 py-3 bg-yellow-500 text-white text-lg font-bold rounded-lg hover:bg-yellow-600 transition">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPost;
