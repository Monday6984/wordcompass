-- WordCompass Coaching & Mentoring: initial database schema
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- What it creates:
--   • parent_call_requests  — one row per "Book a Free Parent Call" submission
--   • admins                — which Supabase Auth users may use /admin
--   • public.is_admin()     — true when the signed-in user is in admins
--   • Row-level security so only admins can read/update requests.
--     Nobody can insert from the browser: the website's /api/parent-call
--     function inserts using the service role key, which bypasses RLS.
--
-- ─── HOW TO ADD AN ADMIN ────────────────────────────────────────────────────
--   1. Supabase dashboard → Authentication → Users → "Invite user" (or "Add user"),
--      and enter their email. They set a password from the invite email.
--   2. Then run this in the SQL Editor (change the email):
--
--        insert into admins (user_id, email)
--        select id, email from auth.users where email = 'person@example.com';
--
--   To remove an admin:
--        delete from admins where email = 'person@example.com';
--
-- ─── ALSO DO THIS ───────────────────────────────────────────────────────────
--   Authentication → Providers → Email → turn OFF "Allow new users to sign up",
--   so nobody can create their own account.
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ── Parent call requests ────────────────────────────────────────────────────
create table if not exists public.parent_call_requests (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  parent_name         text not null,
  email               text not null,
  phone               text not null,
  child_age           int  not null check (child_age between 12 and 25),
  main_challenge      text not null,
  preferred_call_time text not null,
  preferred_coach     text,
  consent             boolean not null check (consent),
  status              text not null default 'New'
                        check (status in ('New', 'Called', 'Matched', 'Not proceeding')),
  notes               text,
  updated_at          timestamptz
);

create index if not exists parent_call_requests_created_at_idx
  on public.parent_call_requests (created_at desc);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists parent_call_requests_set_updated_at on public.parent_call_requests;
create trigger parent_call_requests_set_updated_at
  before update on public.parent_call_requests
  for each row execute function public.set_updated_at();

-- ── Admins ──────────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ── is_admin() ──────────────────────────────────────────────────────────────
-- security definer so it can read admins regardless of the caller's RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ── Row-level security ──────────────────────────────────────────────────────
alter table public.parent_call_requests enable row level security;
alter table public.admins enable row level security;

-- parent_call_requests: admins may read and update. No insert/delete policies,
-- so the browser can never create or delete rows.
drop policy if exists "Admins can read requests" on public.parent_call_requests;
create policy "Admins can read requests"
  on public.parent_call_requests for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update requests" on public.parent_call_requests;
create policy "Admins can update requests"
  on public.parent_call_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Belt and braces: browser roles may only ever change status and notes.
revoke insert, update, delete on public.parent_call_requests from anon, authenticated;
grant select on public.parent_call_requests to authenticated;
grant update (status, notes) on public.parent_call_requests to authenticated;

-- admins: each user can see only their own row. No client-side writes.
drop policy if exists "Users can read their own admin row" on public.admins;
create policy "Users can read their own admin row"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

revoke insert, update, delete on public.admins from anon, authenticated;
