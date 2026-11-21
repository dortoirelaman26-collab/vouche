-- One-time migration: adds the editable company record.
CREATE TABLE IF NOT EXISTS company (
  id               INTEGER PRIMARY KEY CHECK (id = 1),
  brand            TEXT NOT NULL DEFAULT '',
  brand_sub        TEXT NOT NULL DEFAULT '',
  operator_name    TEXT NOT NULL DEFAULT '',
  operator_licence TEXT NOT NULL DEFAULT '',
  operator_tax_id  TEXT NOT NULL DEFAULT '',
  operator_contact TEXT NOT NULL DEFAULT '',
  site_url         TEXT NOT NULL DEFAULT '',
  updated_at       TEXT NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO company
  (id, brand, brand_sub, operator_name, operator_licence, operator_tax_id, operator_contact, site_url)
VALUES
  (1, 'ООО «ВАША КОМПАНИЯ»', 'Проверка визовых ваучеров',
      'ООО «ВАША КОМПАНИЯ»', 'РТО № ______', 'ИНН __________', '', '');
