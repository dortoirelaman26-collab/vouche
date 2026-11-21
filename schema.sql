-- Run once on your D1 database (see DEPLOY.md).
-- Safe to run again: it never deletes records.

CREATE TABLE IF NOT EXISTS vouchers (
  code          TEXT NOT NULL,
  code_norm     TEXT NOT NULL UNIQUE,
  status        TEXT NOT NULL DEFAULT 'valid',
  issued_at     TEXT NOT NULL DEFAULT '',
  surname       TEXT NOT NULL DEFAULT '',
  given         TEXT NOT NULL DEFAULT '',
  passport      TEXT NOT NULL DEFAULT '',
  dob           TEXT NOT NULL DEFAULT '',
  gender        TEXT NOT NULL DEFAULT '',
  nationality   TEXT NOT NULL DEFAULT '',
  multiplicity  TEXT NOT NULL DEFAULT '',
  entry_date    TEXT NOT NULL DEFAULT '',
  exit_date     TEXT NOT NULL DEFAULT '',
  purpose       TEXT NOT NULL DEFAULT '',
  stay          TEXT NOT NULL DEFAULT '',
  note          TEXT NOT NULL DEFAULT '',
  updated_at    TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);
