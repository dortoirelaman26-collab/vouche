# Putting the site on GitHub

The folder **`github-site/`** is ready. It contains only the public site:
`index.html`, `verify.html`, `app.js`, `qrcode.js`, `assets/`, `data/`,
`robots.txt`, `.nojekyll` plus the two cache files.

`admin.html` is **not** there — never publish the voucher builder.
`.nojekyll` tells GitHub Pages not to skip files whose names start with `_`.

---

## 1. Check Git is installed

In PowerShell:

```powershell
git --version
```

If it says "not recognised", install Git from <https://git-scm.com/download/win>
and restart PowerShell.

## 2. Create an empty repository on GitHub

1. Go to <https://github.com/new>.
2. Repository name: for example `voucher-check`.
3. Choose **Public** (GitHub Pages is only free for public repositories).
4. **Do not** tick "Add a README", ".gitignore" or a licence — leave it empty.
5. Click **Create repository**. GitHub shows a URL like
   `https://github.com/YOURNAME/voucher-check.git` — copy it.

## 3. Upload from PowerShell

Replace `YOURNAME` and `voucher-check` with yours:

```powershell
cd "C:\Users\user\Downloads\Nouveau dossier\github-site"
git init
git add .
git commit -m "Voucher verification site"
git branch -M main
git remote add origin https://github.com/YOURNAME/voucher-check.git
git push -u origin main
```

If GitHub asks you to sign in, choose **Sign in with browser**. A password alone
does not work anymore — you need a Personal Access Token or browser sign-in.

Refresh the repository page — the files should be there.

## 4. Turn on GitHub Pages (free website)

1. In your repository: **Settings → Pages**.
2. **Build and deployment → Source: Deploy from a branch**.
3. Branch: **main**, folder: **/(root)** → **Save**.
4. Wait 1–2 minutes. Your site is now at:

```
https://YOURNAME.github.io/voucher-check/
```

Test it: open `https://YOURNAME.github.io/voucher-check/verify.html?code=DEMO-4X7K-92MQ`

## 5. Set your real address in the config

In `data/vouchers.js` (line 27 of the **`github-site`** copy):

```js
siteUrl: "https://YOURNAME.github.io/voucher-check",
```

Write the repository name at the end, and **no trailing slash**. If you later
add a custom domain, change it to `https://check.yourcompany.com`.

Also raise the script version in `index.html` and `verify.html` to `?v=5`, so
visitors don't keep an old cached copy, then:

```powershell
git add .
git commit -m "Set public URL"
git push
```

## 6. Custom domain (optional)

1. Buy the domain at Cloudflare Registrar, Porkbun, Namecheap, OVH…
2. In `github-site/`, create a file named **`CNAME`** (no extension) containing
   one line: `check.yourcompany.com`
3. At the registrar, add DNS: `CNAME` → `check` → `YOURNAME.github.io`
4. In GitHub **Settings → Pages → Custom domain**, type the domain and Save.
5. Tick **Enforce HTTPS**. Certificates are free.

DNS can take up to 24 hours.

---

## Important

- Everything in `data/vouchers.js` is **public**. Keep `maskPassport: true` and
  never put ID scans there.
- `_headers` and `.htaccess` are ignored by GitHub Pages. After each update,
  change `?v=4` to `?v=5`, `?v=6`… in the two HTML files before pushing.
- To update the site later: copy the changed files from `Nouveau dossier` into
  `github-site`, bump `?v=`, then `git add . && git commit -m "update" && git push`.
- If you only want to back up the code (private repo) and **not** publish a
  website, skip steps 4–6.
