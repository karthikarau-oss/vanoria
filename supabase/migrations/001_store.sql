-- Run in a dedicated Supabase project. Public catalogue remains draft until approved.
create extension if not exists pgcrypto;
create function public.is_staff() returns boolean language sql stable as $$
 select coalesce((auth.jwt()->'app_metadata'->>'role') in ('admin','staff'),false)
$$;
create table public.products(id uuid primary key default gen_random_uuid(),slug text unique not null,name text not null,description text,price_paise integer not null check(price_paise>=0),stock integer not null default 0 check(stock>=0),published boolean default false,details jsonb default '{}',created_at timestamptz default now());
create table public.categories(id uuid primary key default gen_random_uuid(),slug text unique not null,name text not null);
create table public.collections(id uuid primary key default gen_random_uuid(),slug text unique not null,name text not null,details jsonb default '{}');
create table public.flavours(id uuid primary key default gen_random_uuid(),name text not null,details jsonb default '{}');
create table public.occasions(id uuid primary key default gen_random_uuid(),name text not null,details jsonb default '{}');
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,name text,created_at timestamptz default now());
create table public.addresses(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,details jsonb not null);
create table public.gift_reminders(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,recipient text not null,occasion text not null,event_date date not null);
create table public.orders(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users(id),status text not null default 'pending' check(status in ('pending','paid','packing','shipped','cancelled','refunded')),amount_paise integer not null check(amount_paise>=0),currency text not null default 'INR',razorpay_order_id text unique,razorpay_payment_id text unique,delivery jsonb,created_at timestamptz default now());
create table public.order_items(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),product_id uuid references public.products(id),quantity integer not null check(quantity>0),unit_price_paise integer not null check(unit_price_paise>=0),configuration jsonb);
create table public.gift_boxes(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),configuration jsonb not null);
create table public.coupons(id uuid primary key default gen_random_uuid(),code text unique not null,details jsonb not null);
create table public.corporate_enquiries(id uuid primary key default gen_random_uuid(),name text not null,email text not null,details jsonb not null,created_at timestamptz default now());
create table public.homepage_content(id uuid primary key default gen_random_uuid(),key text unique not null,content jsonb not null,published boolean default false);
create table public.reviews(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),product_id uuid not null references public.products(id),rating integer not null check(rating between 1 and 5),body text not null,approved boolean default false);
create table public.store_settings(key text primary key,category text not null check(category in ('taxes','shipping','delivery','general')),value jsonb not null);
create table public.newsletter_subscriptions(email text primary key,created_at timestamptz default now());
create table public.payment_events(event_id text primary key,order_id uuid references public.orders(id),payload jsonb not null,processed_at timestamptz default now());
-- Every table is default-deny. Staff assignment only via trusted app_metadata/service role.
do $$ declare t text; begin foreach t in array array['products','categories','collections','flavours','occasions','profiles','addresses','gift_reminders','orders','order_items','gift_boxes','coupons','corporate_enquiries','homepage_content','reviews','store_settings','newsletter_subscriptions','payment_events'] loop execute format('alter table public.%I enable row level security',t); execute format('create policy staff_manage on public.%I for all to authenticated using (public.is_staff()) with check (public.is_staff())',t); end loop; end $$;
create policy public_products on public.products for select using(published=true);
create policy public_content on public.homepage_content for select using(published=true);
create policy public_reviews on public.reviews for select using(approved=true);
create policy own_profile on public.profiles for all to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy own_addresses on public.addresses for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy own_reminders on public.gift_reminders for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy own_gifts on public.gift_boxes for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy own_orders_read on public.orders for select to authenticated using(user_id=auth.uid());
create policy own_items_read on public.order_items for select to authenticated using(exists(select 1 from public.orders where orders.id=order_id and orders.user_id=auth.uid()));
-- No client writes to prices, inventory, order payment state, discounts, tax/shipping or payment events.
-- Logo/product uploads should use private Storage buckets with staff-only write policies and signed reads.
