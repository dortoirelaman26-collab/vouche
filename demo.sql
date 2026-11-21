-- OPTIONAL. Two test records so you can try the live check page.
-- Run: npx wrangler d1 execute vouche-db --remote --file=demo.sql
-- Delete them later from admin.html, or run: DELETE FROM vouchers WHERE code LIKE 'DEMO-%';

INSERT OR IGNORE INTO vouchers
  (code, code_norm, status, issued_at, surname, given, passport, dob, gender, nationality,
   multiplicity, entry_date, exit_date, purpose, stay, note, updated_at)
VALUES
  ('DEMO-4X7K-92MQ', 'DEMO4X7K92MQ', 'valid', '2026-11-03T18:53:46Z',
   'DOE', 'JOHN', '000000000', '1990-01-01', 'M', 'United Kingdom',
   'Single entry', '2026-11-20', '2026-11-28', 'Tourism',
   'Moscow, Sample Hotel, 1 Example Street', '', '2026-11-03T18:53:46Z'),
  ('DEMO-8P2V-4LHT', 'DEMO8P2V4LHT', 'revoked', '2026-10-14T09:12:05Z',
   'SAMPLE', 'ANNA', '111111111', '1985-06-12', 'F', 'France',
   'Double entry', '2026-12-01', '2026-12-15', 'Business',
   'Saint Petersburg, Sample Inn, 5 Example Avenue',
   'Аннулировано по заявлению принимающей стороны.', '2026-10-14T09:12:05Z');
