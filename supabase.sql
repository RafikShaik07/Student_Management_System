-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run
create table if not exists public.students (
  id      bigint primary key,
  name    text    not null,
  roll    text    not null unique,
  email   text    not null,
  course  text    not null,
  age     int     not null check (age between 1 and 100)
);

-- Block direct public access; the Vercel function uses the service key instead.
alter table public.students enable row level security;

-- Optional sample data
insert into public.students (id, name, roll, email, course, age) values
  (1700000000005, 'Asha Reddy',  'CS101', 'asha@example.com',   'Computer Science', 20),
  (1700000000004, 'Ravi Kumar',  'EC102', 'ravi@example.com',   'Electronics',      21),
  (1700000000003, 'Meera Nair',  'DS103', 'meera@example.com',  'Data Science',     19),
  (1700000000002, 'Karthik Rao', 'ME104', 'karthik@example.com','Mechanical',       22),
  (1700000000001, 'Sneha Das',   'BU105', 'sneha@example.com',  'Business',         20)
on conflict do nothing;
