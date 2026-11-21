# Visa Voucher Verification Portal

A small static site that lets someone check a visa voucher / invitation by
**voucher number** or by **scanning a QR code**, and shows whether the record is
valid, revoked or expired.

It is an original implementation built for your own organisation — it is **not**
a copy of, and is not affiliated with, any other operator's website. Do not put
another company's name, registration numbers or branding on it.

---

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Public entry point: enter a voucher number |
| `verify.html` | Public result page — `/verify.html?code=XXXX` (this is what the QR points to) |
| `admin.html` | **Private** voucher builder: fills the form, makes the QR + the record JSON |
| `data/vouchers.js` | Portal settings (your company) + the list of voucher records |
| `app.js` | Rendering and page logic |
| `qrcode.js` | Vendored QR generator (MIT, Kazuhiko Arase) |
| `assets/style.css` | Theme |
| `robots.txt` | Keeps the portal out of search engines |

No build step, no npm, no server code. Plain HTML/CSS/JS.

## Run locally

```powershell
cd "C:\Users\user\Downloads\Nouveau dossier"
python -m http.server 8765
```

Then open <http://localhost:8765/>. Demo records:

- `DEMO-4X7K-92MQ` → valid
- `DEMO-8P2V-4LHT` → revoked

Use a local server rather than double-clicking the files, so the SHA-256 record
fingerprint works (browsers only expose it on `http://localhost` or HTTPS).

## 1. Put your own company on it

Open `data/vouchers.js` and edit the `VC_CONFIG` block:

```js
brand: "ООО «ВАША КОМПАНИЯ»",
operatorName: "ООО «ВАША КОМПАНИЯ»",
operatorLicence: "РТО № ______",
operatorTaxId: "ИНН __________",
operatorContact: "verify@yourcompany.com",
siteUrl: "https://verify.yourcompany.com",   // public address of this portal
lang: "ru",                                   // "ru" | "en" | "fr"
bilingual: false,                             // true = small English line under each Russian label
showActions: false,                           // false = no "check another" / "print" buttons
showTopbar: false,                            // false = no company/menu bar on public pages
showQr: false,                                // false = no QR block on the page
showQrText: false,                            // false = only the QR image, no caption / URL
showAuditLine: false,                         // true = adds "Проверено" + record fingerprint
showDemoNotice: false,                        // once real data is in
showAdminLink: false,                         // hides the builder link
```

The page is **Russian only** by default. Set `bilingual: true` to add a small
English equivalent under each label (`Фамилия / Surname`), the style used on
invitation documents.

`siteUrl` is important: the QR code encodes
`<siteUrl>/verify.html?code=<VOUCHER NUMBER>`, so it must be the real public
address (HTTPS) once the site is online.

## 2. Add a voucher

Fastest way: open `admin.html`, fill the form, then use **Copy record JSON**,
**Download QR (SVG)** and **Print voucher**. Paste the JSON into the
`window.VOUCHERS` array in `data/vouchers.js`:

```js
{
  code: "GV-7K4M-9XQ2",
  status: "valid",                       // valid | revoked | expired
  issuedAt: "2026-11-03T18:53:46Z",
  holder: {
    surname: "BENALI",
    given: "KARIM",
    passport: "123456789",
    dob: "1994-07-02",
    gender: "M",
    nationality: "Algeria"
  },
  trip: {
    multiplicity: "Single entry",
    entry: "2026-11-20",
    exit: "2026-11-28",
    purpose: "Tourism",
    stay: "Moscow, Example Hotel, 1 Example Street"
  },
  note: ""
}
```

Reload the page — the voucher is instantly checkable and the QR link works.

To **revoke** a voucher later, change `status` to `"revoked"` (and refresh the
hosted files). The verification page then turns red for that record.

To change the language of the whole portal, set `lang: "fr"` or `"en"`
(the builder page `admin.html` stays in English on purpose — it is your internal tool).

## 3. Publish

Any static host works: Netlify Drop, Cloudflare Pages, GitHub Pages, or your own
web space. Upload the whole folder as-is (the `data/` folder included).

After deploying:

1. Set `siteUrl` to the live HTTPS address.
2. Set `showDemoNotice: false` and delete the two demo records.
3. Set `showAdminLink: false` and **do not upload `admin.html`** to the public
   server — the builder is an internal tool.
4. Download the QR for each voucher from the builder and print it on the document.

## After an update the page still looks old

Browsers cache `app.js` and `data/vouchers.js`, so a change can take a while to
appear. The project already handles this:

- script tags load with a version: `app.js?v=3`, `data/vouchers.js?v=3` —
  **change the number** (`?v=4`, `?v=5`…) whenever you upload new versions;
- `_headers` (Netlify / Cloudflare Pages) and `.htaccess` (Apache) tell browsers
  to revalidate instead of keeping an old copy.

On GitHub Pages you cannot set headers — bump the `?v=` number. To force a
refresh while testing on your own PC: **Ctrl + F5**.

## Important limits (read this)

- **Everything in `data/vouchers.js` is public.** Anyone who opens the portal can
  read the file and see every record. That is why `maskPassport: true` is on and
  why you should never store full passport numbers, scans or ID photos there.
- This is a **verification page, not a secure registry.** A static site cannot
  truly prove authenticity: whoever can edit the files can edit the records.
  The fingerprint shown on each page (SHA-256 of the record) only helps you spot
  a *locally altered* copy when you compare it with your own register.
- If you need real access control, private data, audit logs or "revoke
  instantly without redeploying", the same front end can be pointed at a small
  backend (e.g. one API endpoint `GET /api/voucher/:code` + an admin login).
  Ask and it can be added.
- Only publish records for documents **you** issued, and keep the data you show
  to the minimum needed to confirm the document.
