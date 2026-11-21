# Cloudflare Pages + D1 database — LIVE

**The site is already deployed:** https://check-globelvoyazh.pages.dev
**Admin:** https://check-globelvoyazh.pages.dev/admin.html
**Repository:** https://github.com/dortoirelaman26-collab/vouche

`vouche.pages.dev` belongs to another site, so the project is named
`check-globelvoyazh`. The site detects its own address automatically;
`siteUrl` is empty on purpose.

## Update the live site

```powershell
cd "C:\Users\user\Downloads\Nouveau dossier"
git add .
git commit -m "update"
git push
npx.cmd wrangler pages deploy . --project-name=check-globelvoyazh
```

Below is the original setup guide, kept for reference.

Free forever for this size of site: Pages hosting + D1 database + HTTPS.
No card needed. The domain can be added later (the domain name itself is not free).

---

## 1. Install what you need (once)

1. Create a free Cloudflare account: https://dash.cloudflare.com/sign-up
2. Install Node.js (LTS): https://nodejs.org/
3. Open **PowerShell** and check:

```powershell
node --version
```

## 2. Log in to Cloudflare from your computer

```powershell
cd "C:\Users\user\Downloads\Nouveau dossier\cloudflare-site"
npx wrangler login
```

A browser window opens — click **Allow**.

## 3. Create the database

```powershell
npx wrangler d1 create vouche-db
```

Wrangler prints a block like this:

```
[[d1_databases]]
binding = "DB"
database_name = "vouche-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id`** and paste it into `wrangler.toml` in this folder,
replacing `PASTE_YOUR_DATABASE_ID_HERE`.

## 4. Create the table

```powershell
npx wrangler d1 execute vouche-db --remote --file=schema.sql
```

Optional — add two test records so you can try the live page:

```powershell
npx wrangler d1 execute vouche-db --remote --file=demo.sql
```

(Delete them later from `admin.html`, or run
`npx wrangler d1 execute vouche-db --remote --command="DELETE FROM vouchers WHERE code LIKE 'DEMO-%'"`)

## 5. Check the settings in the file

`data/vouchers.js`:

```js
siteUrl: "",     // leave empty = use the site's own address automatically
useApi: true,
```

No URL to configure: QR links use the address the page is served from.
Replace only the company placeholders in that file:
`brand`, `operatorName`, `operatorLicence`, `operatorTaxId`, `operatorContact`.

## 6. Upload the folder to GitHub

```powershell
cd "C:\Users\user\Downloads\Nouveau dossier\cloudflare-site"
git init
git add .
git commit -m "Voucher portal with D1 database"
git branch -M main
git remote add origin https://github.com/dortoirelaman26-collab/vouche.git
git push -u origin main
```

If GitHub asks you to sign in, use **Sign in with browser** — a password alone
does not work. If the push is rejected because the repository already has files,
run `git pull --rebase origin main` first, then `git push`.

A **private** repository works fine with Cloudflare Pages and is recommended.

## 7. Connect the repository to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Choose GitHub → select `dortoirelaman26-collab/vouche`.
3. Build settings:
   - Framework preset: **None** (or "Other")
   - Build command: **leave empty**
   - Build output directory: **`.`** (a single dot = repository root)
   - Root directory: leave as `/`
4. **Save and Deploy**. Wait 1–2 minutes.

Your site is now at **https://vouche.pages.dev**.

## 8. Set the admin password (important)

1. In the new project: **Settings → Variables and Secrets → Add**.
2. Name: `ADMIN_PASSWORD`
3. Value: a long password (16+ characters).
4. Click **Encrypt**, then **Save**.
5. **Deployments → Redeploy** so the Functions pick it up.

Anyone can open `/admin.html`, but without this password they cannot read,
add, change or delete any record.

## 9. Use it

**Public check:** https://vouche.pages.dev/verify.html?code=DEMO-4X7K-92MQ
(or any code you published)

**Admin:** https://vouche.pages.dev/admin.html
1. Site URL is filled in automatically.
2. Enter the password → **Log in**.
3. **Load records** to see the database.
4. Fill the voucher form → **Publish this voucher**.
5. **Edit** loads a record back into the form; **Delete this voucher** removes it.

Changes are live immediately — the check API sends `Cache-Control: no-store`.

---

## Later: your own domain

1. Buy a domain (Cloudflare Registrar, Porkbun, Namecheap… ~$10/year).
2. Project → **Settings → Custom domains → Set up a domain** → enter e.g.
   `check.yourcompany.com`.
3. Add the DNS record Cloudflare shows at your registrar.
4. Change `siteUrl` in `data/vouchers.js` to `https://check.yourcompany.com`,
   commit and push. Regenerate any QR codes you already printed.
5. Tick **Enforce HTTPS** (free certificate).

## Notes / limits

- Voucher data lives in D1 — **not** in a public JavaScript file anymore.
- Free D1 allowance: 500 MB per database, 10 databases. Thousands of vouchers.
- `maskPassport: false` — the full passport number is shown on the public
  verification page. Change it to `true` in `data/vouchers.js` if you ever need
  the masked form instead.
- Public pages are Russian only; `admin.html` stays in English (private tool).
- To update the site later: edit files in `cloudflare-site`, `git add .`,
  `git commit -m "update"`, `git push`. Cloudflare rebuilds automatically.
- If you change script files, bump `?v=5` to `?v=6` in the three HTML files so
  visitors do not keep a cached copy.
