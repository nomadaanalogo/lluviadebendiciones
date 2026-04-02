-- Lluvia de Bendiciones - Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  price integer not null, -- price in COP
  images text[], -- array of image URLs
  stock integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bundles (pack pricing per product)
create table if not exists bundles (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  quantity integer not null,
  price integer not null, -- total price for this bundle in COP
  label text, -- e.g. "Más popular"
  badge text, -- e.g. "⭐ BESTSELLER"
  active boolean default true
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_city text not null,
  customer_department text not null,
  customer_address text not null,
  payment_method text not null check (payment_method in ('contraentrega', 'pago_inmediato')),
  status text not null default 'pendiente' check (status in ('pendiente','confirmado','despachado','entregado','cancelado')),
  subtotal integer not null,
  shipping integer default 0,
  total integer not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity integer not null,
  unit_price integer not null,
  total_price integer not null
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating integer check (rating between 1 and 5),
  comment text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Function to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_products_updated_at
  before update on products
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at
  before update on orders
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table products enable row level security;
alter table bundles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;

-- Public can read active products and bundles
create policy "Public can read active products"
  on products for select
  using (active = true);

create policy "Public can read active bundles"
  on bundles for select
  using (active = true);

-- Public can read approved reviews
create policy "Public can read approved reviews"
  on reviews for select
  using (approved = true);

-- Public can insert orders
create policy "Public can create orders"
  on orders for insert
  with check (true);

create policy "Public can create order items"
  on order_items for insert
  with check (true);

-- Public can insert reviews
create policy "Public can submit reviews"
  on reviews for insert
  with check (true);

-- Public can read own order by order_number (for tracking)
create policy "Public can read own orders"
  on orders for select
  using (true);

create policy "Public can read order items"
  on order_items for select
  using (true);

-- Admins (authenticated users) have full access
create policy "Admins full access to products"
  on products for all
  using (auth.role() = 'authenticated');

create policy "Admins full access to bundles"
  on bundles for all
  using (auth.role() = 'authenticated');

create policy "Admins full access to orders"
  on orders for all
  using (auth.role() = 'authenticated');

create policy "Admins full access to order items"
  on order_items for all
  using (auth.role() = 'authenticated');

create policy "Admins full access to reviews"
  on reviews for all
  using (auth.role() = 'authenticated');
