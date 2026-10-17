import React from "react";
import { Link } from "react-router-dom";
import useBlogFeed from "@/hooks/useBlogFeed";
import BlogCard from "@/components/site/BlogCard";

// The three newest blog posts. Hidden entirely until there are posts to show.
export default function LatestStoriesSection() {
  const { status, posts } = useBlogFeed(3);
  if (status !== "ready") return null;

  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <h2
          className="font-heading font-black text-charcoal"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          Latest stories
        </h2>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.url}>
              <BlogCard post={post} headingLevel="h3" />
            </li>
          ))}
        </ul>

        <Link
          to="/blog"
          className="mt-10 inline-flex font-body font-semibold text-teal underline-offset-4 hover:underline"
        >
          More from the blog →
        </Link>
      </div>
    </section>
  );
}
