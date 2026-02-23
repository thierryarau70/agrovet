-- ============================================
-- AGROVET 2.0 - Supabase SQL Schema (FIXED)
-- Por favor, copie e roude TUDO isso no SQL Editor do Supabase novamente.
-- Essa versão corrige o erro "Database error saving new user".
-- ============================================

-- 1. Create table profiles explicitly in public schema
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'operador' check (role in ('admin', 'veterinario', 'operador')),
  created_at timestamptz default now()
);

-- 2. Propriedades
create table if not exists public.propriedades (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  nome text not null,
  proprietario text,
  municipio text,
  estado text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Lotes
create table if not exists public.lotes (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  propriedade_id bigint references public.propriedades on delete cascade,
  nome text not null,
  categoria text,
  retiro text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Animais
create table if not exists public.animais (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  lote_id bigint references public.lotes on delete cascade,
  femea text,
  categoria text,
  ord int,
  observacao text,
  status_prenhez text default 'Vazia',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. IATF Records
create table if not exists public.iatf_records (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  lote_id bigint,
  propriedade_id bigint,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.propriedades enable row level security;
alter table public.lotes enable row level security;
alter table public.animais enable row level security;
alter table public.iatf_records enable row level security;

-- Função is_admin (explícito public)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Removendo policies antigas se existirem para recriar
drop policy if exists "profiles: own or admin" on public.profiles;
drop policy if exists "propriedades: own or admin" on public.propriedades;
drop policy if exists "lotes: own or admin" on public.lotes;
drop policy if exists "animais: own or admin" on public.animais;
drop policy if exists "iatf_records: own or admin" on public.iatf_records;

-- Policies
create policy "profiles: own or admin" on public.profiles
  for all using (auth.uid() = id or public.is_admin());

create policy "propriedades: own or admin" on public.propriedades
  for all using (auth.uid() = user_id or public.is_admin());

create policy "lotes: own or admin" on public.lotes
  for all using (auth.uid() = user_id or public.is_admin());

create policy "animais: own or admin" on public.animais
  for all using (auth.uid() = user_id or public.is_admin());

create policy "iatf_records: own or admin" on public.iatf_records
  for all using (auth.uid() = user_id or public.is_admin());

-- ============================================
-- TRIGGER: cria perfil ao registrar novo usuário
-- ============================================

-- Primeiro dropa a trigger antiga que estava com erro
drop trigger if exists on_auth_user_created on auth.users;

-- Recria a função de trigger apontando explicitamente para public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'operador'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recria a trigger no schema auth apontando para a função no public
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- FIM
-- ============================================
