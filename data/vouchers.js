/* ==========================================================================
   Cloudflare version — portal configuration (NOT the voucher list)
   --------------------------------------------------------------------------
   Vouchers now live in the D1 database, not in this file.

   The two demo records below are used ONLY when the API is unreachable
   (for example when you open verify.html from your own computer). On the
   live site the database is always the source of truth.
   ========================================================================== */

window.VC_CONFIG = {
  /* ---- Your company (shown on every verification page) ---- */
  brand: "ООО «ВАША КОМПАНИЯ»",
  brandSub: "Проверка визовых ваучеров",
  operatorName: "ООО «ВАША КОМПАНИЯ»",
  operatorLicence: "РТО № ______",
  operatorTaxId: "ИНН __________",
  operatorContact: "verify@example.com",

  /* ---- Public address of this portal (no trailing slash) ----
     Leave empty: the site uses its own address automatically, so it works
     with whatever pages.dev name Cloudflare gives you, and with a custom
     domain later. Set it manually only if records must point elsewhere. */
  siteUrl: "",

  /* ---- Read records from the API instead of this file ---- */
  useApi: true,
  apiBase: "",

  lang: "ru",
  bilingual: false,
  showActions: false,
  showTopbar: false,
  showQr: false,
  showQrText: false,
  showAuditLine: false,
  maskPassport: true,
  showDemoNotice: false,

  /* Admin page is reachable at /admin.html but protected by a password. */
  showAdminLink: false,
};

/* Offline fallback only — never shown when the D1 API answers. */
window.VOUCHERS = [
  {
    code: "DEMO-4X7K-92MQ",
    status: "valid",
    issuedAt: "2026-11-03T18:53:46Z",
    holder: { surname: "DOE", given: "JOHN", passport: "000000000", dob: "1990-01-01", gender: "M", nationality: "United Kingdom" },
    trip: { multiplicity: "Single entry", entry: "2026-11-20", exit: "2026-11-28", purpose: "Tourism", stay: "Moscow, Sample Hotel, 1 Example Street" },
    note: "",
  },
  {
    code: "DEMO-8P2V-4LHT",
    status: "revoked",
    issuedAt: "2026-10-14T09:12:05Z",
    holder: { surname: "SAMPLE", given: "ANNA", passport: "111111111", dob: "1985-06-12", gender: "F", nationality: "France" },
    trip: { multiplicity: "Double entry", entry: "2026-12-01", exit: "2026-12-15", purpose: "Business", stay: "Saint Petersburg, Sample Inn, 5 Example Avenue" },
    note: "Аннулировано по заявлению принимающей стороны.",
  },
];
