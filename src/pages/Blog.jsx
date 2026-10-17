import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import useBlogFeed, { BLOG_SITE_URL } from "@/hooks/useBlogFeed";
import PageHero from "@/components/site/PageHero";
import FinalCta from "@/components/site/FinalCta";
import Btn from "@/components/site/Btn";
import BlogCard, { BlogCardSkeleton } from "@/components/site/BlogCard";

export default function Blog() {
  usePageMeta(
    "Blog — Raphael & Ella Stories and Articles | WordCompass",
    "The Raphael & Ella stories that model our vocabulary words, plus articles for parents of young people aged 12+."
  );

  const { status, posts } = useBlogFeed();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Stories, words and things that help."
        intro="The Raphael & Ella series, and articles for parents who've run out of road."
      />

      <section className="bg-cream py-14 sm:py-20">
        <div className="wrap">
          {status === "loading" && (
            <>
              <p role="status" className="sr-only">
                Loading the latest posts…
              </p>
              <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <li key={index}>
                    <BlogCardSkeleton />
                  </li>
                ))}
              </ul>
            </>
          )}

          {status === "ready" && (
            <>
              <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.url}>
                    <BlogCard post={post} />
                  </li>
                ))}
              </ul>
              {BLOG_SITE_URL && (
                <div className="mt-12 flex justify-center">
                  <Btn href={BLOG_SITE_URL} target="_blank" rel="noopener" variant="outline">
                    See all posts on our blog ↗
                  </Btn>
                </div>
              )}
            </>
          )}

          {(status === "empty" || status === "error") && (
            <div className="card-warm">
              <p className="text-mid">
                Our latest stories and articles are on our blog.
              </p>
              {BLOG_SITE_URL && (
                <div className="mt-6">
                  <Btn href={BLOG_SITE_URL} target="_blank" rel="noopener">
                    Visit our blog ↗
                  </Btn>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
