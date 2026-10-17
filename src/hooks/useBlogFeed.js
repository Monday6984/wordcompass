import { useEffect, useState } from "react";

// The blog's home page, for "Visit our blog" links. Set VITE_BLOG_SITE_URL (see .env.example).
export const BLOG_SITE_URL = (() => {
  const value = (import.meta.env.VITE_BLOG_SITE_URL || "").trim();
  return /^https?:\/\//i.test(value) ? value : "";
})();

// One request per page load, shared by the homepage strip and the /blog page.
let cached = null;
function loadFeed() {
  if (!cached) {
    cached = fetch("/api/blog-feed", { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((posts) => (Array.isArray(posts) ? posts : []))
      .catch((error) => {
        cached = null; // let a later visit try again
        throw error;
      });
  }
  return cached;
}

/**
 * Latest posts from the external blog (via /api/blog-feed).
 * status: "loading" | "ready" | "empty" | "error"
 */
export default function useBlogFeed(limit) {
  const [state, setState] = useState({ status: "loading", posts: [] });

  useEffect(() => {
    let active = true;
    loadFeed()
      .then((posts) => {
        if (active) setState({ status: posts.length ? "ready" : "empty", posts });
      })
      .catch(() => {
        if (active) setState({ status: "error", posts: [] });
      });
    return () => {
      active = false;
    };
  }, []);

  return limit ? { ...state, posts: state.posts.slice(0, limit) } : state;
}
