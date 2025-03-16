import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001"; // Make sure this matches your backend

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

function App() {
  // ✅ Explicitly define `useState` type
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/posts`)
      .then(response => setPosts(response.data))
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
           ))}
      </ul>
    </div>
  );
}

export default App;
