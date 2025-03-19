import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";

const API_BASE_URL = "http://localhost:5001";

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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // ✅ Fetch all posts on mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/posts`)
      .then((response) => {
        setPosts(response.data);
        setFilteredPosts(response.data);

         // ✅ Extract unique authors & tags safely
        const posts: Post[] = response.data;
        const uniqueAuthors: string[] = [...new Set(posts.map((post) => post.author))];
        const uniqueTags: string[] = [...new Set(posts.flatMap((post) => post.tags))];
        setAuthors(uniqueAuthors);
        setTags(uniqueTags);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // ✅ Handle filtering logic
  useEffect(() => {
    let updatedPosts = posts;

    if (selectedAuthor) {
      updatedPosts = updatedPosts.filter((post) => post.author === selectedAuthor);
    }

    if (selectedTag) {
      updatedPosts = updatedPosts.filter((post) => post.tags.includes(selectedTag));
    }

    setFilteredPosts(updatedPosts);
  }, [selectedAuthor, selectedTag, posts]);

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

  // ✅ Delete Post Function
  const deletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">📖 Blog Posts</h1>

      {/* ✅ Filter Options with Accessible Labels */}
      <div className="flex space-x-4 mb-4">
        {/* Filter by Author */}
        <div className="flex flex-col w-1/2">
          <label htmlFor="authorFilter" className="mb-1 font-medium">Filter by Author:</label>
          <select 
            id="authorFilter"
            value={selectedAuthor} 
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Tag */}
        <div className="flex flex-col w-1/2">
          <label htmlFor="tagFilter" className="mb-1 font-medium">Filter by Tag:</label>
          <select 
            id="tagFilter"
            value={selectedTag} 
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Display Filtered Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600">No posts found for the selected filters.</p>
        ) : (
          filteredPosts.map(({ id, title, content, author, tags, date, bookmarked }) => (
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

              {/* ✅ Edit Button */}
              <Link to={`/edit/${id}`}>
                <button className="mt-2 px-3 py-1 rounded bg-blue-500 text-white ml-2">
                  ✏️ Edit
                </button>
              </Link>

              {/* ✅ Delete Button */}
              <button 
                className="mt-2 px-3 py-1 rounded bg-red-500 text-white ml-2"
                onClick={() => deletePost(id)}
              >
                 💀 Delete
              </button>

              {/* ✅ Add Comments Section */}
              <Comments postId={id} />

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostList;
