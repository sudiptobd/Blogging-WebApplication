import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { postsAtom, fetchPosts } from "../store/postsAtom";

const PostList: React.FC = () => {
  const [posts, setPosts] = useAtom(postsAtom);

  useEffect(() => {
    fetchPosts(setPosts); // ✅ No more type mismatch
  }, []);

  return (
    <div className="grid gap-4">
      {posts.map(({ id, title, author, date }) => (
        <div key={id} className="p-4 border rounded shadow">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-gray-600">{author}</p>
          <p className="text-sm">{new Date(date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
