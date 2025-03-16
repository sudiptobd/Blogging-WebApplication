import json2md from "json2md";
import fs from "fs";
import archiver from "archiver";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure Named Export Works for ES Modules
export function exportPostsToMarkdown(res) {
  const postsFile = path.join(__dirname, "../data/posts.json"); // Fix path
  const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));

  const archive = archiver("zip", { zlib: { level: 9 } });

  res.attachment("posts.zip");
  archive.pipe(res);

  posts.forEach((post) => {
    const markdown = json2md([{ h1: post.title }, { p: post.content }]);
    archive.append(markdown, { name: `${post.title.replace(/\s+/g, "-")}.md` });
  });

  archive.finalize();
}
