-- Parent call requests from the "Book a Free Parent Call" form.
-- Applied by `npm run db:migrate`, or paste into Neon's SQL Editor.
-- Only the server (/api functions) ever reads or writes this table.
-- gen_random_uuid() is built into Postgres 13+ (Neon runs 15–17).

create table parent_call_requests (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  parent_name         text not null,
  email               text not null,
  phone               text not null,
  child_age           int  not null check (child_age between 12 and 25),
  main_challenge      text not null,
  preferred_call_time text not null,
  preferred_coach     text null,
  consent             boolean not null check (consent),
  status              text not null default 'New'
                        check (status in ('New', 'Called', 'Matched', 'Not proceeding')),
  notes               text,
  updated_at          timestamptz
);

create index parent_call_requests_created_at_idx on parent_call_requests (created_at desc);
create index parent_call_requests_status_idx on parent_call_requests (status);

-- Keep updated_at current on every edit.
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger parent_call_requests_set_updated_at
  before update on parent_call_requests
  for each row execute function set_updated_at();
