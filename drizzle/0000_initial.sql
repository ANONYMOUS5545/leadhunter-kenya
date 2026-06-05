-- LeadHunter KE — Initial Database Schema
-- Run this in your Neon (or any PostgreSQL) database

-- ── Enums ──────────────────────────────────────────────────────────
CREATE TYPE IF NOT EXISTS city AS ENUM ('Nairobi','Mombasa','Kisumu','Nakuru','Eldoret');
CREATE TYPE IF NOT EXISTS subscription_tier AS ENUM ('free','starter','pro','enterprise');
CREATE TYPE IF NOT EXISTS scrape_status AS ENUM ('pending','running','completed','failed');
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('user','admin');

-- ── Users ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                    SERIAL PRIMARY KEY,
  email                 VARCHAR(255) NOT NULL UNIQUE,
  name                  VARCHAR(255),
  password_hash         TEXT,
  role                  user_role NOT NULL DEFAULT 'user',
  subscription_tier     subscription_tier NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  stripe_customer_id    VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Industries ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS industries (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL UNIQUE,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Cities ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL UNIQUE,
  county     VARCHAR(255),
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Businesses ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(500) NOT NULL,
  city                 VARCHAR(255) NOT NULL,
  industry_id          INTEGER REFERENCES industries(id),
  industry_name        VARCHAR(255),
  phone                VARCHAR(100),
  email                VARCHAR(255),
  website              TEXT,
  address              TEXT,
  facebook_url         TEXT,
  instagram_url        TEXT,
  tiktok_url           TEXT,
  twitter_url          TEXT,
  linkedin_url         TEXT,
  facebook_followers   INTEGER,
  instagram_followers  INTEGER,
  tiktok_followers     INTEGER,
  google_place_id      VARCHAR(500),
  google_rating        VARCHAR(10),
  google_review_count  INTEGER,
  google_maps_url      TEXT,
  weaknesses           JSONB DEFAULT '[]',
  cold_call_suggestions JSONB DEFAULT '[]',
  online_presence_score INTEGER DEFAULT 0,
  is_demo              BOOLEAN NOT NULL DEFAULT FALSE,
  data_source          VARCHAR(100),
  scrape_job_id        INTEGER,
  created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_industry ON businesses(industry_name);
CREATE INDEX IF NOT EXISTS idx_businesses_score ON businesses(online_presence_score);

-- ── Scrape Jobs ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scrape_jobs (
  id               SERIAL PRIMARY KEY,
  city_name        VARCHAR(255) NOT NULL,
  industry_id      INTEGER REFERENCES industries(id),
  industry_name    VARCHAR(255),
  status           scrape_status NOT NULL DEFAULT 'pending',
  total_found      INTEGER DEFAULT 0,
  total_processed  INTEGER DEFAULT 0,
  error_message    TEXT,
  started_at       TIMESTAMP,
  completed_at     TIMESTAMP,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by       INTEGER REFERENCES users(id)
);

-- ── Subscription Plans ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscription_plans (
  id                     SERIAL PRIMARY KEY,
  name                   VARCHAR(100) NOT NULL,
  tier                   subscription_tier NOT NULL,
  price_monthly          INTEGER NOT NULL,
  price_yearly           INTEGER NOT NULL,
  leads_per_month        INTEGER NOT NULL,
  export_enabled         BOOLEAN NOT NULL DEFAULT FALSE,
  cold_call_enabled      BOOLEAN NOT NULL DEFAULT FALSE,
  admin_access           BOOLEAN NOT NULL DEFAULT FALSE,
  features               JSONB DEFAULT '[]',
  stripe_monthly_price_id VARCHAR(255),
  stripe_yearly_price_id VARCHAR(255),
  is_active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at             TIMESTAMP NOT NULL DEFAULT NOW()
);
