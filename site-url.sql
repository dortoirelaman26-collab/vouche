-- One-time migration: adds the editable public domain field.
-- Safe to skip on a fresh install if company.sql already includes site_url.
ALTER TABLE company ADD COLUMN site_url TEXT NOT NULL DEFAULT '';
