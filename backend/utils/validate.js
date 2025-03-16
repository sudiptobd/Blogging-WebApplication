import { z } from "zod";

// ✅ Define Post Schema with Zod
const postSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(3, "Author name must be at least 3 characters"),
  tags: z.array(z.string()),
  date: z.string().datetime(),
  bookmarked: z.boolean(),
});

// ✅ Export function correctly
export function validatePost(post) {
  return postSchema.safeParse(post);
}
