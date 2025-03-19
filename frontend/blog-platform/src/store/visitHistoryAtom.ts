import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Create a writable atom with localStorage to persist visited posts
export const visitedPostsAtom = atomWithStorage<string[]>("visitedPosts", []);

// Atom for adding a visited post
export const addVisitedPostAtom = atom(
  null,
  (get, set, postId: string) => {
    const visitedPosts = get(visitedPostsAtom);
    if (!visitedPosts.includes(postId)) {
      set(visitedPostsAtom, [...visitedPosts, postId]); // Updates localStorage automatically
    }
  }
);

// Atom for clearing visit history
export const clearVisitHistoryAtom = atom(
  null,
  (_get, set) => {
    set(visitedPostsAtom, []); // Clears localStorage automatically
  }
);
