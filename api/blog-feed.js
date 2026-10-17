// GET /api/blog-feed
// Returns the latest posts from the external blog as
//   [{ title, url, excerpt, date, image, category }]   (max 12, newest first)
//
// BLOG_FEED_URL is either
//   • a WordPress REST endpoint, e.g. https://example.com/wp-json/wp/v2/posts  (preferred), or
//   • an RSS / Atom feed URL, e.g. https://example.com/feed/
// BLOG_SITE_URL (the blog home page) is used to resolve relative links and images.
// If WordPress's API fails, the site's /feed/ RSS is tried instead.
// Any failure returns 200 with [] so the website never breaks.

import { XMLParser } from "fast-xml-parser";
import { sendJson } from "./_lib/http.js";

const MAX_POSTS = 12;
const EXCERPT_LENGTH = 180;
const TIMEOUT_MS = 8000;
const CACHE_OK = "public, s-maxage=900, stale-while-revalidate=86400";
const CACHE_EMPTY = "public, s-maxage=60";

// ── Text and URL clean-up ───────────────────────────────────────────────────
const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", pound: "£", copy: "©",
};

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(point) && point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "";
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

function plainText(value) {
  if (value === null || value === undefined) return "";
  const raw = typeof value === "object" ? value["#text"] ?? value.rendered ?? "" : String(value);
  const withoutTags = String(raw)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ");
  // Decode, then strip again in case encoded tags (&lt;b&gt;) were hiding in the text.
  return decodeEntities(withoutTags).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerptOf(value) {
  const text = plainText(value)
    .replace(/\s*\[(?:…|\.\.\.)\]\s*$/, "")
    .replace(/\s*(?:Continue reading|Read more)\b.*$/i, "")
    .trim();
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–—-]+$/, "")}…`;
}

function safeUrl(value, base) {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(decodeEntities(value.trim()), base);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function isoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function fetchWithTimeout(url, accept) {
  const response = await fetch(url, {
    headers: { Accept: accept, "User-Agent": "WordCompass-site/1.0 (+blog feed)" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response;
}

// ── WordPress REST API ──────────────────────────────────────────────────────
async function fromWordPress(feedUrl, base = feedUrl) {
  const url = new URL(feedUrl);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", String(MAX_POSTS));
  url.searchParams.set("_fields", "date,date_gmt,link,title,excerpt,_links,_embedded");
  const posts = await (await fetchWithTimeout(url.href, "application/json")).json();
  if (!Array.isArray(posts)) throw new Error("WordPress did not return a list of posts");

  return posts.map((post) => {
    const embedded = post._embedded || {};
    const media = (embedded["wp:featuredmedia"] || [])[0];
    const sizes = media?.media_details?.sizes || {};
    const imageSource =
      sizes.medium_large?.source_url || sizes.large?.source_url || media?.source_url || null;
    const category = (embedded["wp:term"] || [])
      .flat()
      .find((term) => term && term.taxonomy === "category" && term.name !== "Uncategorized");

    return {
      title: plainText(post.title),
      url: safeUrl(post.link, base),
      excerpt: excerptOf(post.excerpt),
      date: isoDate(post.date_gmt ? `${post.date_gmt}Z` : post.date),
      image: safeUrl(imageSource, base),
      category: category ? plainText(category.name) : null,
    };
  });
}

// ── RSS / Atom ──────────────────────────────────────────────────────────────
const asArray = (value) => (value === undefined || value === null ? [] : Array.isArray(value) ? value : [value]);

function firstImageIn(html) {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(String(html || ""));
  return match ? match[1] : null;
}

function rssImage(item) {
  const media = [...asArray(item["media:content"]), ...asArray(item["media:thumbnail"])].find(
    (entry) => entry?.["@_url"] && (!entry["@_medium"] || entry["@_medium"] === "image")
  );
  if (media) return media["@_url"];
  const enclosure = asArray(item.enclosure).find((entry) => String(entry?.["@_type"] || "").startsWith("image/"));
  if (enclosure) return enclosure["@_url"];
  const html = item["content:encoded"] ?? item.content?.["#text"] ?? item.content ?? item.description ?? item.summary;
  return firstImageIn(typeof html === "object" ? html["#text"] : html);
}

function atomLink(entry) {
  const links = asArray(entry.link);
  const alternate = links.find((link) => !link["@_rel"] || link["@_rel"] === "alternate") || links[0];
  return typeof alternate === "string" ? alternate : alternate?.["@_href"];
}

async function fromRss(feedUrl, base = feedUrl) {
  const xml = await (await fetchWithTimeout(feedUrl, "application/rss+xml, application/atom+xml, application/xml, text/xml")).text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", processEntities: false });
  const doc = parser.parse(xml);

  const rssItems = asArray(doc?.rss?.channel?.item);
  if (rssItems.length) {
    return rssItems.map((item) => ({
      title: plainText(item.title),
      url: safeUrl(typeof item.link === "string" ? item.link : item.guid?.["#text"] ?? item.guid, base),
      excerpt: excerptOf(item.description ?? item["content:encoded"]),
      date: isoDate(item.pubDate ?? item["dc:date"]),
      image: safeUrl(rssImage(item), base),
      category: asArray(item.category).map((category) => plainText(category)).find(Boolean) || null,
    }));
  }

  return asArray(doc?.feed?.entry).map((entry) => ({
    title: plainText(entry.title),
    url: safeUrl(atomLink(entry), base),
    excerpt: excerptOf(entry.summary ?? entry.content),
    date: isoDate(entry.published ?? entry.updated),
    image: safeUrl(rssImage(entry), base),
    category: asArray(entry.category).map((category) => plainText(category?.["@_term"] ?? category)).find(Boolean) || null,
  }));
}

// ── Handler ─────────────────────────────────────────────────────────────────
// base (BLOG_SITE_URL) resolves any relative links or images in the feed.
export async function loadPosts(feedUrl, base = feedUrl) {
  let posts;
  if (/\/wp-json\//.test(feedUrl)) {
    try {
      posts = await fromWordPress(feedUrl, base);
    } catch (error) {
      console.error("[blog-feed] WordPress API failed, trying RSS:", error.message);
      posts = await fromRss(new URL("/feed/", feedUrl).href, base);
    }
  } else {
    posts = await fromRss(feedUrl, base);
  }

  return posts
    .filter((post) => post.title && post.url)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, MAX_POSTS);
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendJson(res, 405, { error: "Method not allowed." }, { Allow: "GET" });
  }

  const feedUrl = safeUrl(process.env.BLOG_FEED_URL || "");
  if (!feedUrl) {
    console.error("[blog-feed] BLOG_FEED_URL is not set or isn't an http(s) URL.");
    return sendJson(res, 200, [], { "Cache-Control": CACHE_EMPTY });
  }

  try {
    const posts = await loadPosts(feedUrl, safeUrl(process.env.BLOG_SITE_URL || "") || feedUrl);
    return sendJson(res, 200, posts, { "Cache-Control": posts.length ? CACHE_OK : CACHE_EMPTY });
  } catch (error) {
    console.error("[blog-feed] Failed to load posts:", error.message);
    return sendJson(res, 200, [], { "Cache-Control": CACHE_EMPTY });
  }
}
