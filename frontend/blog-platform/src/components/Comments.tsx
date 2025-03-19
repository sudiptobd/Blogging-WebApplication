import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}

interface CommentsProps {
  postId: string;
}

function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  // ✅ Fetch comments on mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/comments/${postId}`)
      .then(response => setComments(response.data))
      .catch(error => console.error("Error fetching comments:", error));
  }, [postId]);

  // ✅ Add Comment
  const addComment = async () => {
    if (!author || !content) return alert("All fields are required.");
    
    try {
      const response = await axios.post(`${API_BASE_URL}/comments/${postId}`, { author, content });
      setComments([...comments, response.data]); // Update UI
      setAuthor("");
      setContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // ✅ Delete Comment
  const deleteComment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/comments/${id}`);
      setComments(comments.filter(comment => comment.id !== id)); // Update UI
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded shadow">
      <h3 className="text-lg font-bold">💬 Comments</h3>

      {/* ✅ Display Comments */}
      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet.</p>
      ) : (
        comments.map(({ id, author, content, date }) => (
          <div key={id} className="p-2 border-t">
            <p className="text-sm text-gray-500"><strong>{author}</strong> | {new Date(date).toLocaleString()}</p>
            <p>{content}</p>
            <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded" onClick={() => deleteComment(id)}>Delete</button>
          </div>
        ))
      )}

        <p></p>

      {/* ✅ Add Comment Form */}
      <div className="mt-4 flex flex-col space-y-1">
        <textarea  
          placeholder="Your Name" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)}
          className="border px-3 py-0.5 rounded mb-1"
        />
        <textarea 
          placeholder="Your Comment" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          className="border px-3 py-0.5 rounded mb-1"
        />
        <p></p>
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={addComment}>Add Comment</button>
      </div>
    </div>
  );
}

export default Comments;
