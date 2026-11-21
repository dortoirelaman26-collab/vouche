# Visa voucher verification portal

Russian-language verification site. Voucher records live in a **Cloudflare D1**
database, not in a public file.

- Public check: `https://vouche-verification.pages.dev/verify.html?code=CODE`
- Admin (password protected): `https://vouche-verification.pages.dev/admin.html`
- Company details admin: `https://vouche-verification.pages.dev/company.html`

## Files

| Path | Purpose |
|---|---|
| `index.html` | Enter a voucher number |
| `verify.html` | Verification page (status, 15 document fields) |
| `admin.html` | Issuer tool: log in, publish, edit, delete records |
| `company.html` | Issuer tool: edit company name, RTO, INN, contact, public domain |
| `app.js` | Rendering + API calls |
| `data/vouchers.js` | Default company details + display flags (no voucher data) |
| `functions/api/check.js` | Public read-only lookup endpoint |
| `functions/api/company.js` | Public read-only company settings endpoint |
| `functions/api/admin.js` | Authenticated save/list/delete + company-save endpoints |
| `schema.sql` | D1 vouchers table |
| `company.sql` | D1 company table + default row |
| `site-url.sql` | Adds the editable public-domain column |
| `wrangler.toml` | Pages project + D1 binding |

## Deploy

Full step-by-step guide: **[DEPLOY.md](DEPLOY.md)**.

Short version:

```powershell
npx wrangler d1 execute vouche-db --remote --file=schema.sql
npx wrangler d1 execute vouche-db --remote --file=company.sql
npx wrangler d1 execute vouche-db --remote --file=site-url.sql
npx wrangler pages secret put ADMIN_PASSWORD --project-name=vouche-verification
npx wrangler pages deploy . --project-name=vouche-verification
```

## Security notes

- `ADMIN_PASSWORD` is an encrypted secret; never put it in a file or in git.
- The site is public. `maskPassport: false` shows full passport numbers on the
  verification page; set it to `true` in `data/vouchers.js` to mask them.
- Check `admin.html` for any leftover `DEMO-` test records and delete them
  before real use.
