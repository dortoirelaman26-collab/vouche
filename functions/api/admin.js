/* /api/admin — password-protected voucher management.
   GET  ?action=list              -> all records
   GET  ?action=company-get       -> company details
   POST { action: "login", password }
   POST { action: "save", token, record, oldCode }
   POST { action: "delete", token, code }
   POST { action: "company-save", token, company }
   The only secret needed is ADMIN_PASSWORD (set as an encrypted variable).
*/

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const HOURS = 12;

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign(
      { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
      CORS
    ),
  });
}

function norm(v) {
  return String(v == null ? "" : v).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function text(v) { return String(v == null ? "" : v).trim(); }

function b64url(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(str) {
  const s = String(str).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(s + "=".repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function hmacKey(secret, purpose) {
  return crypto.subtle.importKey(
    "raw", new TextEncoder().encode(purpose + "::" + secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
}

async function digestOf(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return b64url(new Uint8Array(buf));
}

async function safeEqual(a, b) {
  const da = await digestOf(String(a));
  const db = await digestOf(String(b));
  if (da.length !== db.length) return false;
  let diff = 0;
  for (let i = 0; i < da.length; i++) diff |= da.charCodeAt(i) ^ db.charCodeAt(i);
  return diff === 0;
}

async function makeToken(secret) {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({
    exp: Date.now() + HOURS * 3600 * 1000,
  })));
  const key = await hmacKey(secret, "session");
  const sig = b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))));
  return payload + "." + sig;
}

async function tokenOk(token, secret) {
  try {
    const parts = String(token).split(".");
    if (parts.length !== 2) return false;
    const key = await hmacKey(secret, "session");
    const sig = b64url(new Uint8Array(
      await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(parts[0]))
    ));
    if (!(await safeEqual(sig, parts[1]))) return false;
    const payload = JSON.parse(new TextDecoder().decode(unb64url(parts[0])));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch (e) {
    return false;
  }
}

function rowToRecord(row) {
  return {
    code: row.code,
    status: row.status,
    issuedAt: row.issued_at,
    holder: {
      surname: row.surname, given: row.given, passport: row.passport,
      dob: row.dob, gender: row.gender, nationality: row.nationality,
    },
    trip: {
      multiplicity: row.multiplicity, entry: row.entry_date, exit: row.exit_date,
      purpose: row.purpose, stay: row.stay,
    },
    note: row.note,
  };
}

function rowToCompany(row) {
  if (!row) return {};
  return {
    brand: row.brand,
    brandSub: row.brand_sub,
    operatorName: row.operator_name,
    operatorLicence: row.operator_licence,
    operatorTaxId: row.operator_tax_id,
    operatorContact: row.operator_contact,
    siteUrl: row.site_url || "",
  };
}

export async function onRequest(context) {
  const method = context.request.method;
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  const env = context.env;
  if (!env.DB) return json({ ok: false, error: "D1 database is not bound." }, 503);

  const secret = text(env.ADMIN_PASSWORD);
  const url = new URL(context.request.url);
  let body = {};
  if (method === "POST") {
    try { body = await context.request.json(); }
    catch (e) { return json({ ok: false, error: "Invalid JSON." }, 400); }
  }
  const action = text(url.searchParams.get("action") || body.action);

  /* ---- login: no token required ---- */
  if (action === "login") {
    if (!secret) return json({ ok: false, error: "Set ADMIN_PASSWORD first (see DEPLOY.md)." }, 503);
    if (!(await safeEqual(text(body.password), secret))) {
      return json({ ok: false, error: "Wrong password." }, 401);
    }
    return json({ ok: true, token: await makeToken(secret), hours: HOURS });
  }

  /* ---- everything else requires a signed, expiring token ---- */
  const auth = context.request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : text(body.token);
  if (!secret || !(await tokenOk(token, secret))) {
    return json({ ok: false, error: "Not authorised. Log in again." }, 401);
  }

  try {
    if (action === "list" && method === "GET") {
      const res = await env.DB.prepare("SELECT * FROM vouchers ORDER BY updated_at DESC").all();
      return json({ ok: true, records: (res.results || []).map(rowToRecord) });
    }

    if (action === "company-get" && method === "GET") {
      const row = await env.DB.prepare(
        "SELECT brand, brand_sub, operator_name, operator_licence, operator_tax_id, operator_contact, site_url FROM company WHERE id = 1"
      ).first();
      return json({ ok: true, company: rowToCompany(row) });
    }

    if (action === "company-save" && method === "POST") {
      const c = body.company || {};
      await env.DB.prepare(
        "INSERT INTO company (id, brand, brand_sub, operator_name, operator_licence, operator_tax_id, operator_contact, site_url, updated_at) " +
        "VALUES (1,?,?,?,?,?,?,?, strftime('%Y-%m-%dT%H:%M:%SZ','now')) " +
        "ON CONFLICT(id) DO UPDATE SET " +
        "brand=excluded.brand, brand_sub=excluded.brand_sub, operator_name=excluded.operator_name, " +
        "operator_licence=excluded.operator_licence, operator_tax_id=excluded.operator_tax_id, " +
        "operator_contact=excluded.operator_contact, site_url=excluded.site_url, updated_at=excluded.updated_at"
      ).bind(
        text(c.brand), text(c.brandSub), text(c.operatorName),
        text(c.operatorLicence), text(c.operatorTaxId), text(c.operatorContact), text(c.siteUrl)
      ).run();
      return json({ ok: true });
    }

    if (action === "save" && method === "POST") {
      const rec = body.record || {};
      const code = norm(rec.code);
      if (!code) return json({ ok: false, error: "Voucher number is required." }, 400);

      const h = rec.holder || {};
      const tr = rec.trip || {};
      const status = ["valid", "revoked", "expired"].indexOf(rec.status) >= 0 ? rec.status : "valid";
      const old = norm(body.oldCode);
      if (old && old !== code) {
        await env.DB.prepare("DELETE FROM vouchers WHERE code_norm = ?").bind(old).run();
      }

      await env.DB.prepare(
        "INSERT INTO vouchers (code, code_norm, status, issued_at, surname, given, passport, dob, gender, nationality, multiplicity, entry_date, exit_date, purpose, stay, note, updated_at) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, strftime('%Y-%m-%dT%H:%M:%SZ','now')) " +
        "ON CONFLICT(code_norm) DO UPDATE SET " +
        "code=excluded.code, status=excluded.status, issued_at=excluded.issued_at, " +
        "surname=excluded.surname, given=excluded.given, passport=excluded.passport, " +
        "dob=excluded.dob, gender=excluded.gender, nationality=excluded.nationality, " +
        "multiplicity=excluded.multiplicity, entry_date=excluded.entry_date, " +
        "exit_date=excluded.exit_date, purpose=excluded.purpose, stay=excluded.stay, " +
        "note=excluded.note, updated_at=excluded.updated_at"
      ).bind(
        code, code, status, text(rec.issuedAt),
        text(h.surname), text(h.given), text(h.passport), text(h.dob),
        text(h.gender), text(h.nationality),
        text(tr.multiplicity), text(tr.entry), text(tr.exit), text(tr.purpose), text(tr.stay),
        text(rec.note)
      ).run();

      return json({ ok: true, code: code });
    }

    if (action === "delete" && method === "POST") {
      const code = norm(body.code);
      if (!code) return json({ ok: false, error: "Voucher number is required." }, 400);
      await env.DB.prepare("DELETE FROM vouchers WHERE code_norm = ?").bind(code).run();
      return json({ ok: true, code: code });
    }

    return json({ ok: false, error: "Unknown action." }, 400);
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) }, 500);
  }
}
