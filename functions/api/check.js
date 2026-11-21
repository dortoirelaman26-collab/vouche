/* GET /api/check?code=XXXX  — public lookup, reads only from D1. */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const code = norm(new URL(context.request.url).searchParams.get("code"));
  if (!code) return json({ found: false, error: "empty_code" }, 400);
  if (!context.env.DB) return json({ found: false, error: "db_not_bound" }, 503);

  try {
    const row = await context.env.DB.prepare(
      "SELECT * FROM vouchers WHERE code_norm = ? LIMIT 1"
    ).bind(code).first();

    if (!row) return json({ found: false });

    return json({
      found: true,
      record: {
        code: row.code,
        status: row.status,
        issuedAt: row.issued_at,
        holder: {
          surname: row.surname,
          given: row.given,
          passport: row.passport,
          dob: row.dob,
          gender: row.gender,
          nationality: row.nationality,
        },
        trip: {
          multiplicity: row.multiplicity,
          entry: row.entry_date,
          exit: row.exit_date,
          purpose: row.purpose,
          stay: row.stay,
        },
        note: row.note,
      },
    });
  } catch (e) {
    return json({ found: false, error: String((e && e.message) || e) }, 500);
  }
}
