/* ==========================================================================
   Portal configuration + voucher records
   --------------------------------------------------------------------------
   This file is the "database" of the static portal. Edit it, save, reload.
   Records added here instantly become verifiable by code and by QR link.

   IMPORTANT
   ----------
   Everything in this file is PUBLIC. Anyone who can open the verification
   page can read this file. Never store full passport numbers, scans or other
   sensitive personal data here. Keep `maskPassport: true` and enter only the
   digits you are willing to disclose.
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
     The QR code encodes:  <siteUrl>/verify.html?code=<VOUCHER CODE>
     Use the real public URL, e.g. https://verify.yourcompany.com        */
  siteUrl: "https://verify.example.com",

  /* ---- Language: "en", "fr" or "ru" (extra keys can be added in app.js) ---- */
  lang: "ru",

  /* ---- Print a small English line under each Russian label ----
     This is the bilingual style used on consular / invitation documents. */
  bilingual: false,

  /* ---- Show the two buttons under the record: "check another" and
     "print / save as PDF".                                          */
  showActions: false,

  /* ---- Show the top bar (company name + menu) on the public pages.
     false = the check page starts directly with the document card.
     The builder (admin.html) always keeps its own bar.              */
  showTopbar: false,

  /* ---- Show the QR code block on the verification page.
     false = the page shows only the record (QR still available for
     printing from admin.html if you ever need it).                 */
  showQr: false,

  /* ---- Show the caption + URL under the QR code.
     false = only the QR image is printed.                          */
  showQrText: false,

  /* ---- Show the extra audit line ("Проверено" + record fingerprint).
     false = footer looks like the printed document, with only the
     publication date.                                              */
  showAuditLine: false,

  /* ---- Show the passport number as  AB*****YZ ----
     Keep true unless you operate the portal on a private server.       */
  maskPassport: true,

  /* ---- Hide the "Demo" banner once you deploy your own data ---- */
  showDemoNotice: false,

  /* ---- Set to false before going live so visitors cannot open the builder ---- */
  showAdminLink: true,
};

/* --------------------------------------------------------------------------
   Voucher records
   status: "valid" | "revoked" | "expired"
   -------------------------------------------------------------------------- */
window.VOUCHERS = [
  {
    code: "DEMO-4X7K-92MQ",
    status: "valid",
    issuedAt: "2026-11-03T18:53:46Z",
    holder: {
      surname: "DOE",
      given: "JOHN",
      passport: "000000000",
      dob: "1990-01-01",
      gender: "M",
      nationality: "United Kingdom",
    },
    trip: {
      multiplicity: "Single entry",
      entry: "2026-11-20",
      exit: "2026-11-28",
      purpose: "Tourism",
      stay: "Moscow, Sample Hotel, 1 Example Street",
    },
    note: "",
  },
  {
    code: "DEMO-8P2V-4LHT",
    status: "revoked",
    issuedAt: "2026-10-14T09:12:05Z",
    holder: {
      surname: "SAMPLE",
      given: "ANNA",
      passport: "111111111",
      dob: "1985-06-12",
      gender: "F",
      nationality: "France",
    },
    trip: {
      multiplicity: "Double entry",
      entry: "2026-12-01",
      exit: "2026-12-15",
      purpose: "Business",
      stay: "Saint Petersburg, Sample Inn, 5 Example Avenue",
    },
    note: "Аннулировано по заявлению принимающей стороны.",
  },
];
