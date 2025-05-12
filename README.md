Project March 2025: Blog Management Platform
Build a blog management platform where users can create, and interact with blog posts. 

### Core Functionality
* Create, edit, and delete blog posts. Store posts in `posts.json` with fields: `id` (UUID), `title`, `content`, `author`, `tags` (array), `date`, `bookmarked` (boolean).
   * Use `uuid` package for generating unique IDs.
   * Use Node filesystem to store posts and comments in JSON files.
   * Use `Zod` to validate user input against a typed schema at the backend.
* Filter displayed posts by tags or authors.
* Add and delete comments on posts. Store comments in `comments.json` with `id`, `postId`, `author`, `content`, `date`.
* Bookmark important posts. Bookmarked posts appear at the top of the list.
* Search by post title. 
* Export all posts as individual Markdown files and download as a `.zip`.
   * Use `json2md` package to generate Markdown files.
   * Use `archiver` package for ZIP compression.
* Centralize global state for posts, comments, and UI interactions (e.g., loading states).
   * Use React Context with Reducer Function.
* Track post visits history, when the user clicks and visits a post, save the post ID in a global array. When displaying the list of posts, visited posts must appear differently than un-visited posts. Visits history should be maintained between sessions. Allow users to clear the visits history.
   * Use `jotai` for managgin visits history.

### API Endpoints:
* `GET /posts`: Fetch all posts in pages of 15, sorted by date in descending order, expect a `page` query parameter, and return first page when `page` is not included.
* `POST /posts`: Create a new post.
* `PATCH /posts/:id`: Update a post.
* `DELETE /posts/:id`: Delete a post.
* `GET /posts/:id/comments`: Fetch all comments for a post.
* `POST /posts/:id/comments`: Add a comment.
* `DELETE /posts/:id/comments/:id`: Delete a comment.
* `GET /posts/search`: expect a `q` query parameter and return posts that contains the text in the title, if no `q` is passed, return the first 15 posts.
* `GET /posts/export`: Export all posts as Markdown files in a ZIP.
  
**Note:** Remember to validate the user input using `Zod`.

### File-Based Storage Examples:
posts.json

```typescript
[  
  {  
    "id": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",  
    "title": "Introduction to React",  
    "content": "Lorem ipsum...",  
    "author": "John Doe",  
    "tags": ["react", "frontend"],  
    "date": "2026-01-10T12:34:56Z",  
    "bookmarked": true  
  }  
]
```
comments.json

```typescript
[  
  {  
    "id": "550e8400-e29b-41d4-a716-446655440000",  
    "postId": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",  
    "author": "Jane Smith",  
    "content": "Great post!",  
    "date": "2026-01-10T13:00:00Z"  
  }  
]
```
### Tech Stack:
* Frontend: React, React Router, Jotai, TailwindCSS.
* Backend: Express, Zod, uuid, json2md, archiver, Node filesystem.

### Need Assistance?
Contact me during office hours (10:00 AM–12:00 PM and 2:00–3:00 PM, Mon–Sat). Support includes design reviews, and best practices guidance.

---
## 🎥 Demo Video  
🔗 [Watch the Project Video Here](https://mum0-my.sharepoint.com/:f:/r/personal/sroy_miu_edu/Documents/WAP?csf=1&web=1&e=ueuJ3E)
---
