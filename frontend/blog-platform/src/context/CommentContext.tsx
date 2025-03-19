import { useEffect, createContext, useContext, useReducer } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
}

type CommentAction =
  | { type: "FETCH_SUCCESS"; payload: Comment[] }
  | { type: "ADD_COMMENT"; payload: Comment }
  | { type: "DELETE_COMMENT"; payload: string };

const commentReducer = (state: CommentState, action: CommentAction): CommentState => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, comments: action.payload, loading: false };
    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.payload] };
    case "DELETE_COMMENT":
      return { ...state, comments: state.comments.filter((c) => c.id !== action.payload) };
    default:
      return state;
  }
};

const CommentContext = createContext<
  | {
      state: CommentState;
      fetchComments: (postId: string) => void;
      addComment: (postId: string, author: string, content: string) => void;
      deleteComment: (commentId: string) => void;
    }
  | undefined
>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, { comments: [], loading: true });

  // ✅ Fetch comments when component mounts
  useEffect(() => {
    const fetchInitialComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments`);
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchInitialComments();
  }, []); // ✅ Empty dependency array means this runs on mount only

  const fetchComments = async (postId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments?postId=${postId}`);
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async (postId: string, author: string, content: string) => {
    try {
      const newComment = { id: crypto.randomUUID(), postId, author, content, date: new Date().toISOString() };
      await axios.post(`${API_BASE_URL}/comments`, newComment);
      dispatch({ type: "ADD_COMMENT", payload: newComment });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`);
      dispatch({ type: "DELETE_COMMENT", payload: commentId });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <CommentContext.Provider value={{ state, fetchComments, addComment, deleteComment }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useCommentContext must be used within a CommentProvider");
  }
  return context;
};
