import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001"; // Ensure this matches your backend

// ✅ Define Post Type
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: string;
  bookmarked: boolean;
}

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/posts`)
      .then(response => setPosts(response.data))
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  // ✅ Toggle Bookmark Function
  const toggleBookmark = async (id: string, bookmarked: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/posts/${id}/bookmark`);
      
      // Update UI Immediately
      setPosts(posts.map(post => 
        post.id === id ? { ...post, bookmarked: !bookmarked } : post
      ));
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">📖 Blog Posts</h1>
      <div className="space-y-4">
        {posts.map(({ id, title, content, author, tags, date, bookmarked }) => (
          <div key={id} className={`p-4 border rounded shadow bg-white ${bookmarked ? "border-yellow-500" : ""}`}>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-600">{content}</p>
            <p className="text-sm text-gray-500">
              <strong>Author:</strong> {author} | <strong>Date:</strong> {new Date(date).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <strong>Tags:</strong> {tags.length > 0 ? tags.join(", ") : "No tags"}
            </p>
            
            {/* ✅ Bookmark Button */}
            <button 
              className={`mt-2 px-3 py-1 rounded ${bookmarked ? "bg-yellow-500" : "bg-gray-300"} text-white`}
              onClick={() => toggleBookmark(id, bookmarked)}
            >
              {bookmarked ? "⭐ Bookmarked" : "☆ Bookmark"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
