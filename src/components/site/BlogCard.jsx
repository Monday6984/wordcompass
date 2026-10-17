import React from "react";
import { Image } from "@/components/ui/image";
import { formatDate } from "@/lib/utils";

// A post from the external blog. The whole card opens the post on the blog in a new tab
// (one "stretched" link per card).
export default function BlogCard({ post, headingLevel = "h2" }) {
  const Heading = headingLevel;
  return (
    <article className="card-soft relative flex h-full flex-col transition-colors duration-200 focus-within:border-teal-light hover:border-teal/30">
      {post.image && (
        <Image src={post.image} alt="" className="mb-6 h-44 w-full rounded-xl object-cover" />
      )}
      {post.category && (
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">{post.category}</p>
      )}
      <Heading className="mt-3 font-heading text-xl font-bold leading-snug text-charcoal">
        <a
          href={post.url}
          target="_blank"
          rel="noopener"
          className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-teal"
        >
          {post.title}
          <span className="sr-only"> (opens the blog in a new tab)</span>
        </a>
      </Heading>
      {post.excerpt && <p className="mt-3 text-mid">{post.excerpt}</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">{formatDate(post.date)}</p>
        <p aria-hidden="true" className="font-body text-sm font-semibold text-teal">
          Read on the blog ↗
        </p>
      </div>
    </article>
  );
}

export function BlogCardSkeleton() {
  return (
    <div aria-hidden="true" className="card-soft flex h-full animate-pulse flex-col">
      <div className="mb-6 h-44 w-full rounded-xl bg-black/5" />
      <div className="h-3 w-28 rounded bg-black/5" />
      <div className="mt-4 h-5 w-11/12 rounded bg-black/10" />
      <div className="mt-2 h-5 w-2/3 rounded bg-black/10" />
      <div className="mt-4 h-4 w-full rounded bg-black/5" />
      <div className="mt-2 h-4 w-5/6 rounded bg-black/5" />
      <div className="mt-8 h-3 w-24 rounded bg-black/5" />
    </div>
  );
}
