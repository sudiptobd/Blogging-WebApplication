import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

function EditPost() {
  const { id } = useParams<{ id: string }>();  // Get post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    author: "",
    tags: "",
    bookmarked: false,
  });

  // Load post data
  useEffect(() => {
    axios.get(`${API_BASE_URL}/posts`)
      .then((response) => {
        const postToEdit = response.data.find((p: any) => p.id === id);
        if (postToEdit) {
          setPost({
            title: postToEdit.title,
            content: postToEdit.content,
            author: postToEdit.author,
            tags: postToEdit.tags.join(", "),
            bookmarked: postToEdit.bookmarked,
          });
        }
      })
      .catch((error) => console.error("Error loading post:", error));
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPost = { ...post, tags: post.tags.split(",").map((t) => t.trim()) };

    try {
      await axios.patch(`${API_BASE_URL}/posts/${id}`, updatedPost);
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 border rounded shadow">
        
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            id="title"
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Enter post title"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block font-medium">Content</label>
          <textarea
            id="content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Enter post content"
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block font-medium">Author</label>
          <input
            id="author"
            type="text"
            value={post.author}
            onChange={(e) => setPost({ ...post, author: e.target.value })}
            placeholder="Enter author name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block font-medium">Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            value={post.tags}
            onChange={(e) => setPost({ ...post, tags: e.target.value })}
            placeholder="e.g., react, frontend"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button type="submit" className="mt-2 px-3 py-1 bg-green-500 text-white rounded">
          ✅ Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
