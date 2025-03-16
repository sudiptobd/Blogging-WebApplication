import { atom } from "jotai";
import axios from "axios";

const API_URL = "http://localhost:5000/posts";

// ✅ Define the Post interface
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: string;
  bookmarked: boolean;
}

// ✅ Create Jotai atom for posts
export const postsAtom = atom<Post[]>([]);

// ✅ Modify `fetchPosts` to use Jotai’s setter function properly
export const fetchPosts = async (setPosts: (setter: (prev: Post[]) => Post[]) => void) => {
  try {
    const response = await axios.get<Post[]>(API_URL);
    setPosts(() => response.data); // ✅ Corrected setter function
  } catch (error) {
    console.error("Failed to fetch posts", error);
  }
};
