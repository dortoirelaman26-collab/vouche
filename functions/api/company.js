/* GET /api/company — public, read-only company settings. */

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

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

function rowToCompany(row) {
  if (!row) {
    return {
      brand: "", brandSub: "", operatorName: "",
      operatorLicence: "", operatorTaxId: "", operatorContact: "",
    };
  }
  return {
    brand: row.brand,
    brandSub: row.brand_sub,
    operatorName: row.operator_name,
    operatorLicence: row.operator_licence,
    operatorTaxId: row.operator_tax_id,
    operatorContact: row.operator_contact,
  };
}

export async function onRequestGet(context) {
  if (!context.env.DB) return json({ ok: false, error: "db_not_bound" }, 503);

  try {
    const row = await context.env.DB.prepare(
      "SELECT brand, brand_sub, operator_name, operator_licence, operator_tax_id, operator_contact FROM company WHERE id = 1"
    ).first();

    return json({
      ok: true,
      company: rowToCompany(row),
    });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) }, 500);
  }
}
