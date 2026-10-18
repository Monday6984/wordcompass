# WordCompass Coaching & Mentoring: website

The public website for WordCompass Coaching & Mentoring (a Transformational Vocabularies company),
plus a private admin area for parent call requests.

## How it's built

| Part | What | Where |
| --- | --- | --- |
| Frontend | React 18 + Vite 6 + Tailwind CSS 3 single-page app (react-router-dom v6, lucide-react). Content lives in plain data files. | `src/` (content in `src/data/`) |
| Backend | Vercel serverless functions (Node). The browser **never** talks to the database; every read and write goes through `/api`. | `api/` |
| Database | Neon Postgres, London region (aws-eu-west-2), because the data includes children's ages. | `db/migrations/` |
| Login | Better Auth (email + password), running in our own function, with its tables in the same Neon database. | `api/auth/[...all].js`, `api/_lib/auth.js` |
| Email | Resend: new-request alerts and password-reset emails. | `api/_lib/email.js` |
| Hosting | Vercel. | `vercel.json` |

```
api/
  parent-call.js              POST  booking form → database + email alert
  blog-feed.js                GET   latest posts from the WordPress blog
  auth/[...all].js            *     Better Auth: sign in/out, session, password reset
  admin/requests/index.js     GET   request list (admin only)
  admin/requests/[id].js      PATCH change status / notes (admin only)
  admin/export.js             GET   CSV export (admin only)
  _lib/                       shared server code (not endpoints): db, auth, requireAdmin, email…
db/migrations/                SQL, applied in order by `npm run db:migrate`
scripts/                      migrate, create-admin, sitemap generator, optional photo download
src/
  admin/                      /admin area (lazy-loaded; public visitors never download it)
  components/home/            homepage sections
  components/site/            header, footer, form, cards, shared building blocks
  data/                       editable content (site text, coaches)
  hooks/ lib/ pages/
public/                       images, favicon, manifest, sitemap.xml, robots.txt
```

## Local development

You need Node 18 or newer and the Vercel CLI (`npm i -g vercel`).

```bash
npm install
cp .env.example .env.local      # then fill it in (see "Environment variables")
vercel login                    # once
vercel link                     # once: connects this folder to your Vercel project
npm run db:migrate              # once, and after adding a migration
npm run create-admin -- you@example.com "Your Name"

npm run dev:full                # `vercel dev`: site + /api together on http://localhost:3000
```

- **`npm run dev:full`** (`vercel dev`) runs the Vite app **and** the `/api` functions. Use it for
  anything involving the form, admin, login or blog feed. **Its variables come from the
  Development environment stored in your Vercel project**, not from `.env.local` (`vercel dev` only
  reads a file named `.env`). After changing a value, update it in Vercel
  (`vercel env add NAME development --force`) and restart `vercel dev`.
- `.env.local` is still used by the npm scripts (`db:migrate`, `create-admin`, the sitemap) and by
  plain `npm run dev`.
- **`npm run dev`** is plain Vite on http://localhost:5173, for quick frontend-only work. `/api`
  doesn't exist there, so the blog shows its "Visit our blog" fallback and the form shows its
  "Send by email instead" option. That's expected.
- `npm run lint`, `npm run build` (also regenerates `public/sitemap.xml` and `robots.txt`),
  `npm run preview`.

## Environment variables

Put them in `.env.local` locally (git-ignored) and in **Vercel → Settings → Environment Variables**
for **Production and Preview**. **Secret** ones must never be shared or committed, and nothing
secret may start with `VITE_` (those are built into the public JavaScript).

| Variable | Secret? | What it is |
| --- | --- | --- |
| `DATABASE_URL` | **secret** | Neon **pooled** connection string (host contains `-pooler`) |
| `BETTER_AUTH_SECRET` | **secret** | Random string that signs sessions. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `BETTER_AUTH_URL` | | Site address. Local `http://localhost:3000`; Production `https://coaching.transformationalvocabularies.com`; leave **unset** for Preview (the preview's own URL is used) |
| `RESEND_API_KEY` | **secret** | Resend API key |
| `NOTIFY_EMAIL_TO` | | Who gets new-request alerts (comma-separate several) |
| `NOTIFY_EMAIL_FROM` | | Sender for all emails: `WordCompass <bookings@coaching.transformationalvocabularies.com>`. Resend verified the **subdomain** `coaching.transformationalvocabularies.com` (the main domain's MX records conflicted), so the sender must be on that subdomain |
| `BLOG_FEED_URL` | | `https://transformationalvocabularies.com/wp-json/wp/v2/posts` (or any RSS/Atom feed URL) |
| `BLOG_SITE_URL` | | Blog home page (server side) |
| `VITE_BLOG_SITE_URL` | public | Blog home page for the "Visit our blog" buttons |
| `SITE_URL` | | `https://coaching.transformationalvocabularies.com`: sitemap, robots.txt, trusted origin, link in alert emails |

## Database (Neon)

1. console.neon.tech → **New project** → name `wordcompass` → region **AWS Europe (London)**.
2. **Connect** → turn on **Connection pooling** → copy the string into `DATABASE_URL`.
3. Run **`npm run db:migrate`**. It applies `db/migrations/*.sql` in order and records each in a
   `schema_migrations` table, so it's safe to run again. You can also paste a file into Neon's
   **SQL Editor**, but then the runner won't know it was applied.

| Migration | Creates |
| --- | --- |
| `001_parent_call_requests.sql` | the requests table, `updated_at` trigger, indexes |
| `002_auth.sql` | Better Auth's `user`, `session`, `account`, `verification`, `rateLimit` tables (generated by Better Auth 1.7.10 from `api/_lib/auth.js`), with `user.role` defaulting to `user` |

To change the database later, add `003_….sql` and run `npm run db:migrate` (locally, pointing at
the production `DATABASE_URL`). If you change Better Auth plugins in `api/_lib/auth.js`, regenerate
its schema with Better Auth's CLI (better-auth.com/docs/concepts/cli) and add the difference as a
new migration.

**Neon free plan:** the database sleeps after 5 minutes without activity and wakes automatically on
the next request. That first request after a quiet spell (a form submission or admin page) takes a
moment longer. This is normal.

## Admin accounts

Public sign-up is switched off. The **only** way to create an account is:

```bash
npm run create-admin -- someone@example.com "Full Name"
```

This creates the account with role `admin` and prints a **temporary password once**. Sign in at
`/admin/login`, then change it: sign out, choose **Forgot password?**, and follow the emailed link
(valid for 1 hour, single use). If the email already has an account, the command just makes it an
admin and leaves the password alone. Run it locally with `DATABASE_URL` pointing at production.

- **Forgotten password:** "Forgot password?" on `/admin/login` emails a reset link. Resetting signs
  the account out everywhere. Reset emails go through Resend, so `RESEND_API_KEY` and
  `NOTIFY_EMAIL_FROM` must be set.
- **Remove admin access:** in Neon's SQL Editor,
  `update "user" set role = 'user' where email = 'someone@example.com';`
  (or `delete from "user" where email = …` to remove the account and its sessions).

## How it works

### Booking form → database + email alert
`src/components/site/BookCallForm.jsx` checks the fields in the browser and POSTs JSON to
`/api/parent-call`. The function:

- accepts only POST with `application/json`, up to 10 KB;
- quietly accepts and discards anything with the hidden honeypot field (`company`) filled;
- limits each IP to 5 requests per 10 minutes (in memory, so it resets when Vercel starts a new
  instance: a speed bump, not a guarantee);
- re-checks every field with the same rules as the form (`src/lib/callRequest.js`, the dropdown
  lists in `src/data/siteContent.js`, coach names in `src/data/coaches.js`) and rejects unknown fields;
- inserts the row with a parameterised query;
- emails `NOTIFY_EMAIL_TO` (subject "New parent call request – {name}", reply-to the parent, link to
  `/admin`). If the email fails, the request is still saved and the parent still sees success. The
  error appears in Vercel's function logs.

If the API can't be reached (network error or server error), the form offers a **"Send by email
instead"** button that opens the visitor's email app with the details filled in.

Coach pages link to `/book-a-call?coach={slug}`. The form then shows "You'd like to talk about
working with {name}" and saves it as `preferred_coach`.

### Login and admin
- Better Auth runs at `/api/auth/*` (`api/auth/[...all].js`, config in `api/_lib/auth.js`):
  - email + password only, with sign-up disabled;
  - httpOnly, SameSite=Lax cookies, Secure on https;
  - sessions end after 7 days without activity;
  - sign-in and reset requests are rate-limited per IP, stored in the database;
  - trusted origins are the live domain, the current Vercel deployment URL, and `http://localhost:3000`.
- Every `/api/admin/*` function starts with `requireAdmin` (`api/_lib/requireAdmin.js`). It returns
  401 if there's no session and 403 if the account's role isn't `admin`. Changes (PATCH) also
  require our own `Origin` header (CSRF protection).
- `/admin/login`, `/admin/reset-password` and `/admin` (the request list) live outside the public
  layout, are marked `noindex`, and are a separate lazy-loaded chunk. Nothing on the public site
  links to them.
- The list offers status tabs with counts, search (name, email or phone), a status dropdown that
  saves immediately, notes, "Load more" (50 at a time), and **Export CSV** of the current filter.
  In the CSV, any value starting with `= + - @` gets a leading apostrophe so spreadsheets can't run
  it as a formula. That includes phone numbers written as `+44…`.

### Blog feed
`/api/blog-feed` fetches the 12 newest posts from `BLOG_FEED_URL` (WordPress REST API, falling back
to the blog's `/feed/` RSS). It strips HTML, trims excerpts to about 180 characters, allows only
http(s) links and images, and is cached by Vercel for 15 minutes (stale copies are served for up to
a day while it refreshes). On any failure it returns `[]`, and the site shows "Visit our blog".
`/blog` shows up to 12 posts and the homepage "Latest stories" strip shows 3. Old `/blog/...` links
redirect to `/blog`.

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
| Pages in the sitemap | `scripts/generate-sitemap.mjs` → `ROUTES` |

Anything in **[square brackets]** on the site is a placeholder. Search the project for `[` and `£X`.

### Add or edit a coach
Each coach in `src/data/coaches.js` has:

- `name`, `headline`
- `slug`: their page address, `/coaches/{slug}`. Lowercase with hyphens and unique, e.g.
  `messiah-odinma`. Changing it changes the URL.
- `shortBio`: one or two sentences for the cards on the homepage and `/coaches`.
- `bio`, `expertise` (title + body), `connect`: the full profile on their page.
- `photo`: `null` shows their initials on a teal circle. To add one, save a **square** photo at
  least **800×800** as `public/images/coaches/{slug}.webp` and set
  `photo: "/images/coaches/{slug}.webp"` (see `public/images/coaches/README.txt`).
- `featured: true` shows them on the homepage.

A new coach automatically gets a page, previous/next links and a sitemap entry, and becomes a valid
"preferred coach" on the form.

### Site photos
The four site photos are committed in `public/images/photos/`. `npm run fetch-images` re-downloads
any missing ones from Base44; it is not part of dev or build, so deploys never depend on Base44.

## Deploy to Vercel

1. Push this repo to GitHub (below).
2. vercel.com → **Add New → Project → Import** the repo. **Framework Preset: Vite** (build
   `npm run build`, output `dist`).
3. **Environment Variables:** add every variable above for **Production** and **Preview**.
   - Set `BETTER_AUTH_URL=https://coaching.transformationalvocabularies.com` for **Production only**.
   - Use the same `BETTER_AUTH_SECRET` everywhere.
   - *Optional:* **Storage → Connect Database → Neon** links your Neon project and fills in
     `DATABASE_URL` automatically.
4. **Deploy.** Then **Settings → Domains** → add `coaching.transformationalvocabularies.com` and
   create the DNS record Vercel shows (usually a CNAME `coaching` → `cname.vercel-dns.com`).
5. Run `npm run create-admin` locally against the production database, and sign in at
   `https://coaching.transformationalvocabularies.com/admin`.

Every push to `main` redeploys. `vercel.json`:

- sends every `/api/auth/...` path to `api/auth/[...all].js` (outside Next.js, Vercel's `[...all]`
  only matches one path segment, so Better Auth's two-part paths like `/api/auth/sign-in/email`
  need this rewrite);
- sends page addresses (no dot, not `/api/`, `/src/`, `/node_modules/` or Vite's `/@…`) to
  `index.html`, so refreshing `/coaches/messiah-odinma` works and `vercel dev` still serves Vite's files;
- adds security headers, and marks `/api/admin/*` and `/api/auth/*` as `no-store`.

### Push to GitHub

```bash
gh repo create wordcompass --private --source=. --remote=origin --push
```

Or create an empty **private** repo on github.com (no README), then:

```bash
git remote add origin https://github.com/<your-account>/wordcompass.git
git branch -M main
git push -u origin main
```

## Known dependency notices

`npm audit` lists advisories for react-router v6 (open redirect via user-controlled `<Link>` paths,
and server-side rendering hydration). This site has neither, and the fix is the v7 major upgrade.
Other notices are in build-time tools (Tailwind 3's watcher and CSS parser) that don't ship to
visitors. Fixing them means Tailwind 4, which would need a design check.

## Before launch checklist

- [ ] Neon project in **London**, `npm run db:migrate` run against it
- [ ] Admin account created (`npm run create-admin`), signed in, temporary password changed
- [x] Resend domain verified (`coaching.transformationalvocabularies.com`); `NOTIFY_EMAIL_FROM` set in Vercel
- [ ] All environment variables in Vercel (Production + Preview); `BETTER_AUTH_URL` set for Production
- [ ] One real test submission received by email and visible in `/admin`
- [ ] Placeholders in **[square brackets]** replaced (search the project for `[`)
- [ ] £X price (Pricing section, Pricing page and Terms)
- [ ] Phone number, `phoneHref` and company number in `src/data/siteContent.js`
- [ ] Policy texts, dates and the named safeguarding lead. The Privacy Policy should mention that
      call requests are stored with Neon (UK) and emailed via Resend
- [ ] Coach photos (`public/images/coaches/{slug}.webp`)
- [x] Coach `shortBio` texts approved (18 Oct 2026)
- [ ] Testimonials confirmed as real and approved
- [ ] `og:image` in `index.html` set to an absolute URL
- [ ] Sitemap submitted in Google Search Console
