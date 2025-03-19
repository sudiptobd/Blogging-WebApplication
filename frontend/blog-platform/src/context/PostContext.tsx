import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

// ✅ Define Post Interface
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: string;
  bookmarked: boolean;
}

// ✅ Define State & Action Types
interface State {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_SUCCESS"; payload: Post[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "TOGGLE_BOOKMARK"; payload: string }
  | { type: "DELETE_POST"; payload: string };

// Reducer Function
const postReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, posts: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "TOGGLE_BOOKMARK":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload ? { ...post, bookmarked: !post.bookmarked } : post
        ),
      };
    case "DELETE_POST":
      return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
    default:
      return state;
  }
};

// Create Context
const PostContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(
  undefined
);

// Context Provider Component
export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, {
    posts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/posts`)
      .then((response) => dispatch({ type: "FETCH_SUCCESS", payload: response.data }))
      .catch((error) => dispatch({ type: "FETCH_ERROR", payload: error.message }));
  }, []);

  return <PostContext.Provider value={{ state, dispatch }}>{children}</PostContext.Provider>;
};

// Custom Hook for Using Post Context
export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePostContext must be used within PostProvider");
  return context;
};
