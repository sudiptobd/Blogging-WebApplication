import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PostList from "./components/PostList";
import AddPost from "./components/AddPost";

function App() {
  return (
    <Router>
      <div className="p-5 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📖 Blog Platform</h1>

        {/* ✅ Navigation Buttons Styled Like Bookmark Button */}
        <nav className="flex justify-center space-x-4 mb-6">
          <Link to="/">
            <button className="mt-2 px-3 py-1 rounded bg-yellow-500 text-white">
              🏠 Home
            </button>
          </Link>
          <Link to="/add">
            <button className="mt-2 px-3 py-1 rounded bg-yellow-500 text-white">
              ➕ Add Post
            </button>
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/add" element={<AddPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
