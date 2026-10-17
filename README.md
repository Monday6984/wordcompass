# WordCompass Coaching & Mentoring: website

The public website for WordCompass Coaching & Mentoring (a Transformational Vocabularies company),
plus a private admin area for parent call requests.

- **Front end:** React 18 + Vite 6 + Tailwind CSS 3 single-page app (react-router-dom v6, lucide-react).
  Most content lives in plain data files in `src/data/`.
- **Booking form:** saved to a **Supabase** database by a Vercel serverless function, which also emails
  the owner through **Resend**.
- **Admin:** `/admin`, sign in with a Supabase account to view and manage call requests.
- **Blog:** the latest posts are pulled from the WordPress blog at transformationalvocabularies.com.
  Each post opens on that blog.
- **Hosting:** Vercel (static site + functions in `api/`).

## Run it locally

You need Node 18 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see "Environment variables")
npm run dev                  # http://localhost:5173
npm run lint                 # check the code
npm run build                # production files go into dist/ (also regenerates the sitemap)
npm run preview              # serve the built dist/ (note: /api does not run in preview)
```

**Local API:** `npm run dev` also runs the serverless functions in `api/` (`/api/parent-call`,
`/api/blog-feed`) through a small Vite dev-server middleware (see `vite.config.js`). It reads every
variable in `.env.local`, so you don't need the Vercel CLI. If you prefer Vercel's own emulator,
`npx vercel dev` also works.

## Environment variables

Put them in `.env.local` locally (git-ignored) and in **Vercel → Project → Settings → Environment
Variables** for the live site. `VITE_` variables are built into the public JavaScript; the others
stay on the server.

| Variable | Where it's used | What it is |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | browser (admin) | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | browser (admin) | Supabase "anon public" key, safe to expose (row-level security protects data) |
| `SUPABASE_URL` | server | Supabase Project URL (same value) |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Supabase "service_role" key. **Secret:** bypasses security rules |
| `RESEND_API_KEY` | server only | Resend API key for the alert email |
| `NOTIFY_EMAIL_TO` | server | Who gets the alert (comma-separate several) |
| `NOTIFY_EMAIL_FROM` | server | Sender, e.g. `WordCompass <alerts@your-verified-domain>`. Use `WordCompass <onboarding@resend.dev>` until your domain is verified |
| `BLOG_FEED_URL` | server | `https://transformationalvocabularies.com/wp-json/wp/v2/posts` (or any RSS/Atom feed URL) |
| `BLOG_SITE_URL` | server | The blog's home page, used to resolve relative links in the feed |
| `VITE_BLOG_SITE_URL` | browser | The blog's home page, for the "Visit our blog" buttons |
| `SITE_URL` | build | `https://coaching.transformationalvocabularies.com`, used for sitemap.xml and robots.txt |

After changing a `VITE_` variable on Vercel, redeploy so it's built in.

## Supabase setup (one time)

1. Create a project at supabase.com in region **West EU (London) – eu-west-2** (the data includes
   children's ages, so it stays in the UK).
2. **SQL Editor → New query**, paste `supabase/migrations/001_init.sql`, **Run**. This creates the
   `parent_call_requests` and `admins` tables, the `is_admin()` function and the row-level security
   rules. It's safe to run again.
3. **Authentication → Providers → Email:** turn **off** "Allow new users to sign up".
4. **Authentication → URL Configuration:** set **Site URL** to
   `https://coaching.transformationalvocabularies.com`, and add these **Redirect URLs**:
   `https://coaching.transformationalvocabularies.com/admin/reset-password` and
   `http://localhost:5173/admin/reset-password`.
5. **Project Settings → API:** copy the Project URL, anon key and service_role key into your env vars.

### Add an admin

1. **Authentication → Users → Invite user** (or **Add user**) with their email.
2. In the SQL Editor, run (with their email):
   ```sql
   insert into admins (user_id, email)
   select id, email from auth.users where email = 'person@example.com';
   ```
3. They sign in at `/admin/login`. "Forgot password?" emails them a reset link.

To remove one: `delete from admins where email = 'person@example.com';`. Anyone signed in who isn't
in `admins` sees "This account doesn't have admin access".

## How it works

### Booking form → database + email

`src/components/site/BookCallForm.jsx` checks the fields in the browser, then POSTs JSON to
`/api/parent-call` (`api/parent-call.js`). The function:

- rejects bodies over 10 KB, unknown fields and anything that fails the same rules as the form
  (`src/lib/callRequest.js`, plus the dropdown lists in `src/data/siteContent.js`);
- silently accepts and discards submissions with the hidden honeypot field (`company`) filled in;
- limits each IP to 5 requests per 10 minutes. This is in memory, so it resets when Vercel starts a
  new instance; it's a speed bump, not a guarantee;
- inserts the row with the service role key (the browser can never insert or delete);
- emails `NOTIFY_EMAIL_TO` through Resend, with reply-to set to the parent. If the email fails, the
  request is still saved and the parent still sees success. The error goes to Vercel's function logs.

If the API can't be reached (network error or a server error), the form offers a **"Send by email
instead"** button that opens the visitor's email app with the request pre-filled, addressed to
`SITE.email`.

Coach pages link to `/book-a-call?coach={slug}`. The form then shows "You'd like to talk about
working with {name}" and saves `preferred_coach`.

### Admin area (`/admin`)

Lazy-loaded (public visitors never download it), with no public header or footer, and marked
`noindex`. Sign in, then filter by status, search by name, email or phone, change status (saved
immediately), add notes, export the filtered list as CSV, and load 50 more at a time. Nothing on the
public site links to it.

### Blog feed

`/api/blog-feed` (`api/blog-feed.js`) fetches the 12 newest posts from `BLOG_FEED_URL` (WordPress
REST API, falling back to the blog's `/feed/` RSS if the API fails). It strips HTML, trims excerpts
to about 180 characters, allows only http(s) links and images, and returns
`[{ title, url, excerpt, date, image, category }]`. Vercel caches it for 15 minutes (and serves a
stale copy for up to a day while refreshing). If anything fails it returns `[]`, and the site shows
a "Visit our blog" button instead. `/blog` shows up to 12 posts, and the homepage "Latest stories"
strip shows 3 (hidden when there are none). Old `/blog/...` links redirect to `/blog`.

## Where to edit things

| What | File |
| --- | --- |
| Email, phone, company line, strapline | `src/data/siteContent.js` → `SITE` |
| Nav and footer links | `src/data/siteContent.js` → `NAV`, `FOOTER_LINKS`, `POLICY_LINKS` |
| Steps, FAQs, testimonials, word list, checklists, form dropdowns | `src/data/siteContent.js` |
| Coaches | `src/data/coaches.js` |
| Logo and photo paths | `src/data/assets.js` |
| Policy pages | `src/pages/Safeguarding.jsx`, `Privacy.jsx`, `Terms.jsx`, `Cookies.jsx` |
| Colours and fonts | `tailwind.config.js` and `src/index.css` |
| Pages listed in the sitemap | `scripts/generate-sitemap.mjs` → `ROUTES` |

Anything in **[square brackets]** on the site is a placeholder waiting for real content. Search the
project for `[` and `£X` to find them all.

### Add or edit a coach

Each coach in `src/data/coaches.js` has:

- `name`, `headline`
- `slug`: their page address, `/coaches/{slug}`. Lowercase with hyphens, unique, e.g.
  `messiah-odinma`. Changing it changes the URL.
- `shortBio`: one or two sentences for the cards on the homepage and `/coaches`.
- `bio`, `expertise` (title + body list), `connect`: the full profile on their own page.
- `photo`: `null` shows their initials on a teal circle. To add one, save a **square** image, at least
  **800×800**, as `public/images/coaches/{slug}.webp` and set
  `photo: "/images/coaches/{slug}.webp"`. See `public/images/coaches/README.txt`.
- `featured: true` shows them on the homepage.

New coaches automatically get a page, previous/next links, a sitemap entry, and become a valid
"preferred coach" on the form.

### Site photos

The four site photos are committed in `public/images/photos/`. `npm run fetch-images` re-downloads
any missing ones from Base44; it is **not** part of dev or build, so deploys never depend on Base44.

**Safeguarding PDF:** put it in `public/documents/` and replace the "coming soon" label in
`src/pages/Safeguarding.jsx` (there's a comment showing the link to use).

## Folder structure

```
api/                    Vercel serverless functions
  parent-call.js        POST: save a call request + email alert
  blog-feed.js          GET: latest blog posts as JSON
  _lib/http.js          shared helpers (not an endpoint)
supabase/migrations/    SQL to run in Supabase
scripts/
  generate-sitemap.mjs  writes public/sitemap.xml + robots.txt (runs before every build)
  fetch-images.mjs      optional one-off photo download
public/                 static files (images, favicon, manifest, sitemap, robots)
src/
  admin/                /admin area (lazy-loaded chunk)
  components/home/      homepage sections
  components/site/      header, footer, form, cards, shared building blocks
  data/                 editable content
  hooks/                usePageMeta, useJsonLd, useBlogFeed
  lib/                  supabase client, form rules, utils
  pages/                one file per page
vercel.json             SPA routing (except /api), security headers, asset caching
```

## Deploy to Vercel

1. Push this repo to GitHub (see below).
2. On vercel.com: **Add New → Project → Import** the GitHub repo.
3. **Framework Preset: Vite**. Build command `npm run build` and output directory `dist` are the
   defaults.
4. Add every variable from the table above under **Environment Variables** (Production, and Preview
   if you want previews to work).
5. **Deploy**. Then **Settings → Domains → Add** `coaching.transformationalvocabularies.com` and
   create the DNS record Vercel shows (usually a CNAME `coaching` → `cname.vercel-dns.com`) at your
   domain provider.

Every push to `main` redeploys automatically. `vercel.json` sends every non-`/api` path to
`index.html` (so refreshing `/coaches/messiah-odinma` works) and adds security headers.

`public/_redirects` and `public/.htaccess` are left over from Netlify/cPanel hosting. The form,
admin and blog feed need the Vercel functions, so other hosts would only serve the static pages.

### Push to GitHub

With the GitHub CLI:

```bash
gh repo create wordcompass --private --source=. --remote=origin --push
```

Or manually: create an empty **private** repo on github.com (no README), then:

```bash
git remote add origin https://github.com/<your-account>/wordcompass.git
git branch -M main
git push -u origin main
```

## Known dependency notices

`npm audit` lists advisories for react-router v6 (open redirect via user-controlled `<Link>` paths,
and server-side rendering hydration). This site has neither, and the fix is the v7 major upgrade. The
remaining notices are in build-time tools (Tailwind 3's file watcher and CSS parser) and don't ship
to visitors. Fixing them means upgrading to Tailwind 4, which would need a design check.

## Before launch checklist

- [ ] Supabase project created in London, migration run, sign-ups disabled, URL configuration set
- [ ] Admin user(s) invited and added to `admins`; a non-admin account checked as refused
- [ ] Resend domain verified, and `NOTIFY_EMAIL_FROM` switched from `onboarding@resend.dev`
- [ ] All environment variables added in Vercel; one real test submission received by email
- [ ] Placeholders in **[square brackets]** replaced (search the project for `[`)
- [ ] £X price (Pricing section, Pricing page and Terms)
- [ ] Phone number, `phoneHref` and company number in `src/data/siteContent.js`
- [ ] Policy texts, dates and the named safeguarding lead; Privacy Policy mentions Supabase (UK/EU
      storage) and Resend for call requests
- [ ] Coach photos added (`public/images/coaches/{slug}.webp`)
- [ ] Coach `shortBio` texts approved
- [ ] Testimonials confirmed as real and approved
- [ ] `og:image` in `index.html` set to an absolute URL
      (`https://coaching.transformationalvocabularies.com/images/brand/wordcompass-logo.png`)
- [ ] Sitemap submitted in Google Search Console
