# Visa voucher verification portal

Russian-language verification site. Voucher records live in a **Cloudflare D1**
database, not in a public file.

- Public check: `https://vouche-verification.pages.dev/verify.html?code=CODE`
- Admin (password protected): `https://vouche-verification.pages.dev/admin.html`

## Files

| Path | Purpose |
|---|---|
| `index.html` | Enter a voucher number |
| `verify.html` | Verification page (status, 15 document fields) |
| `admin.html` | Issuer tool: log in, publish, edit, delete records |
| `app.js` | Rendering + API calls |
| `data/vouchers.js` | Company details and display flags (no voucher data) |
| `functions/api/check.js` | Public read-only lookup endpoint |
| `functions/api/admin.js` | Authenticated save/list/delete endpoints |
| `schema.sql` | D1 table definition |
| `wrangler.toml` | Pages project + D1 binding |

## Deploy

Full step-by-step guide: **[DEPLOY.md](DEPLOY.md)**.

Short version:

```powershell
npx wrangler d1 execute vouche-db --remote --file=schema.sql
npx wrangler pages secret put ADMIN_PASSWORD --project-name=vouche-verification
npx wrangler pages deploy . --project-name=vouche-verification
```

## Security notes

- `ADMIN_PASSWORD` is an encrypted secret; never put it in a file or in git.
- The site is public. Keep `maskPassport: true` in `data/vouchers.js`.
- Two records starting with `DEMO-` are test data. Delete them from
  `admin.html` before real use.
