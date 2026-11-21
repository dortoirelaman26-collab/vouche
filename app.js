/* ==========================================================================
   Visa Voucher Verification Portal
   Shared rendering + page logic. No build step, no dependencies except
   qrcode.js (MIT, vendored).
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- config */

  var cfg = window.VC_CONFIG || {};
  var records = Array.isArray(window.VOUCHERS) ? window.VOUCHERS : [];

  /* ---------------------------------------------------------------- i18n */

  var I18N = {
    en: {
      docTitle: "Visa voucher",
      docSub: "Verification record",
      h1: "Voucher verification",
      issuedInline: "Issued",
      footTextAlt: "Data is provided by the inviting party and matches the issued document.",
      statusValid: "Voucher is valid",
      statusValidSub: "Authentic document",
      statusRevoked: "Voucher has been revoked",
      statusRevokedSub: "Not valid for travel",
      statusExpired: "Voucher has expired",
      statusExpiredSub: "Validity period ended",
      statusNotFound: "No voucher found",
      statusNotFoundSub: "Unknown reference",
      secDocument: "Document",
      secHolder: "Traveller",
      secTrip: "Trip",
      lblVoucherNo: "Voucher number",
      lblIssuedBy: "Issuing organisation",
      lblLicence: "Register / licence no.",
      lblTaxId: "Tax ID",
      lblSurname: "Surname",
      lblGiven: "Given name",
      lblPassport: "Passport number",
      lblDob: "Date of birth",
      lblGender: "Gender",
      lblNationality: "Nationality",
      lblMultiplicity: "Entry type",
      lblEntry: "Planned entry",
      lblExit: "Planned exit",
      lblPurpose: "Purpose of trip",
      lblStay: "Accommodation",
      lblNote: "Remark",
      lblIssuedAt: "Issued",
      lblVerifiedAt: "Checked",
      lblFingerprint: "Record fingerprint",
      qrNote: "Scan with a phone camera to open this record.",
      footText: "This page is generated from the issuer's register and reflects the record as published. A record can be revoked at any time; always trust the result shown here rather than a printed copy.",
      backToLookup: "Check another voucher",
      printBtn: "Print / save as PDF",
      searchTitle: "Verify a visa voucher",
      searchLead: "Enter the voucher number printed on the document, or scan the QR code on it.",
      searchLabel: "Voucher number",
      searchPlaceholder: "XXXX-XXXX-XXXX",
      searchBtn: "Verify",
      searchError: "Please enter a voucher number.",
      searchHint: "The number is case-insensitive. Dashes are optional.",
      notFoundBody: "The number entered does not match any record in the register. Check the number and try again, or contact the organisation that issued the document.",
      verifiedLine: "Checked on %s",
      demoBanner: "Demo portal — replace the placeholder data in data/vouchers.js with your own records before going live.",
      step1t: "Scan or type", step1b: "Use the QR code on the document or enter its voucher number.",
      step2t: "Read the status", step2b: "The register answers instantly: valid, revoked or expired.",
      step3t: "Compare details", step3b: "Name, passport and dates must match the printed document.",
      navCheck: "Check",
      openAdmin: "Voucher builder",
    },
    fr: {
      docTitle: "Bon de visa",
      docSub: "Fiche de vérification",
      h1: "Vérification du bon",
      issuedInline: "Émis le",
      footTextAlt: "Les données sont fournies par la partie invitante et correspondent au document délivré.",
      statusValid: "Le bon est valide",
      statusValidSub: "Document authentique",
      statusRevoked: "Le bon a été annulé",
      statusRevokedSub: "Non valable pour le voyage",
      statusExpired: "Le bon a expiré",
      statusExpiredSub: "Période de validité terminée",
      statusNotFound: "Aucun bon trouvé",
      statusNotFoundSub: "Référence inconnue",
      secDocument: "Document",
      secHolder: "Voyageur",
      secTrip: "Voyage",
      lblVoucherNo: "Numéro du bon",
      lblIssuedBy: "Organisme émetteur",
      lblLicence: "N° de registre / licence",
      lblTaxId: "N° d'identification fiscale",
      lblSurname: "Nom",
      lblGiven: "Prénom",
      lblPassport: "Numéro de passeport",
      lblDob: "Date de naissance",
      lblGender: "Sexe",
      lblNationality: "Nationalité",
      lblMultiplicity: "Type d'entrée",
      lblEntry: "Entrée prévue",
      lblExit: "Sortie prévue",
      lblPurpose: "Motif du voyage",
      lblStay: "Hébergement",
      lblNote: "Remarque",
      lblIssuedAt: "Émis le",
      lblVerifiedAt: "Vérifié le",
      lblFingerprint: "Empreinte du dossier",
      qrNote: "Scannez avec l'appareil photo du téléphone pour ouvrir cette fiche.",
      footText: "Cette page est générée à partir du registre de l'émetteur et reflète le dossier tel que publié. Un dossier peut être annulé à tout moment ; faites toujours foi au résultat affiché ici plutôt qu'à une copie papier.",
      backToLookup: "Vérifier un autre bon",
      printBtn: "Imprimer / enregistrer en PDF",
      searchTitle: "Vérifier un bon de visa",
      searchLead: "Saisissez le numéro imprimé sur le document ou scannez son QR code.",
      searchLabel: "Numéro du bon",
      searchPlaceholder: "XXXX-XXXX-XXXX",
      searchBtn: "Vérifier",
      searchError: "Veuillez saisir un numéro de bon.",
      searchHint: "Le numéro n'est pas sensible à la casse. Les tirets sont facultatifs.",
      notFoundBody: "Le numéro saisi ne correspond à aucun dossier du registre. Vérifiez le numéro et réessayez, ou contactez l'organisme qui a délivré le document.",
      verifiedLine: "Vérifié le %s",
      demoBanner: "Portail de démonstration — remplacez les données d'exemple dans data/vouchers.js avant la mise en ligne.",
      step1t: "Scanner ou saisir", step1b: "Utilisez le QR code du document ou saisissez son numéro.",
      step2t: "Lire le statut", step2b: "Le registre répond immédiatement : valide, annulé ou expiré.",
      step3t: "Comparer les données", step3b: "Nom, passeport et dates doivent correspondre au document imprimé.",
      navCheck: "Vérifier",
      openAdmin: "Créateur de bons",
    },
    ru: {
      docTitle: "Визовый ваучер",
      docSub: "Запись проверки",
      h1: "Проверка ваучера",
      issuedInline: "Опубликовано",
      footTextAlt: "Data is provided by the inviting party and matches the issued document.",
      statusValid: "Ваучер действителен",
      statusValidSub: "Подлинный документ",
      statusRevoked: "Ваучер отозван",
      statusRevokedSub: "Недействителен для поездки",
      statusExpired: "Срок действия ваучера истёк",
      statusExpiredSub: "Период действия завершён",
      statusNotFound: "Ваучер не найден",
      statusNotFoundSub: "Неизвестная ссылка",
      secDocument: "Документ",
      secHolder: "Путешественник",
      secTrip: "Поездка",
      lblVoucherNo: "Номер ваучера",
      lblIssuedBy: "Принимающая организация",
      lblLicence: "Реестровый номер",
      lblTaxId: "ИНН",
      lblSurname: "Фамилия",
      lblGiven: "Имя",
      lblPassport: "Серия и номер паспорта",
      lblDob: "Дата рождения",
      lblGender: "Пол",
      lblNationality: "Гражданство",
      lblMultiplicity: "Кратность поездки",
      lblEntry: "Дата въезда",
      lblExit: "Дата выезда",
      lblPurpose: "Цель поездки",
      lblStay: "Место пребывания",
      lblNote: "Примечание",
      lblIssuedAt: "Опубликовано",
      lblVerifiedAt: "Проверено",
      lblFingerprint: "Отпечаток записи",
      qrNote: "Отсканируйте камерой телефона, чтобы открыть запись.",
      footText: "Страница сформирована из реестра эмитента и отражает опубликованную запись. Запись может быть отозвана в любой момент; доверяйте результату на этой странице, а не бумажной копии.",
      backToLookup: "Проверить другой ваучер",
      printBtn: "Печать / сохранить PDF",
      searchTitle: "Проверка визового ваучера",
      searchLead: "Введите номер ваучера, указанный в документе, или отсканируйте QR-код.",
      searchLabel: "Номер ваучера",
      searchPlaceholder: "XXXX-XXXX-XXXX",
      searchBtn: "Проверить",
      searchError: "Введите номер ваучера.",
      searchHint: "Регистр не важен. Дефисы можно не вводить.",
      notFoundBody: "Введённый номер не найден в реестре. Проверьте номер или обратитесь в организацию, выдавшую документ.",
      verifiedLine: "Проверено %s",
      demoBanner: "Демо-портал — замените тестовые данные в data/vouchers.js перед публикацией.",
      step1t: "Сканируйте или введите", step1b: "Используйте QR-код с документа или введите номер ваучера.",
      step2t: "Смотрите статус", step2b: "Реестр отвечает сразу: действителен, отозван или просрочен.",
      step3t: "Сверьте данные", step3b: "Имя, паспорт и даты должны совпадать с документом.",
      navCheck: "Проверка",
      openAdmin: "Конструктор ваучеров",
    },
  };

  var lang = I18N[cfg.lang] ? cfg.lang : "en";

  /* Bilingual presentation: primary language + small English line under each
     label, the way consular / invitation documents are usually printed. */
  var bilingual = cfg.bilingual !== false && lang !== "en";

  function t(key) {
    var dict = I18N[lang] || I18N.en;
    return dict[key] != null ? dict[key] : I18N.en[key] != null ? I18N.en[key] : key;
  }

  /* Secondary (English) line, or "" when the page is already English. */
  function tAlt(key) {
    if (!bilingual) return "";
    return I18N.en[key] != null ? I18N.en[key] : "";
  }

  function tSub(key) {
    return bilingual ? tAlt(key) || t(key) : t(key);
  }

  /* -------------------------------------------------------------- helpers */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }

  function clean(v) { return String(v == null ? "" : v).trim(); }

  function normCode(v) { return clean(v).toUpperCase().replace(/[^A-Z0-9]/g, ""); }

  function dash(v) { return clean(v) || "\u2014"; }

  function fmtDate(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(clean(v));
    return m ? m[3] + "." + m[2] + "." + m[1] : dash(v);
  }

  function fmtStamp(v) {
    var s = clean(v);
    if (!s) return "\u2014";
    var d = new Date(s);
    if (isNaN(d.getTime())) return s;
    function p(n) { return String(n).padStart(2, "0"); }
    return d.getUTCFullYear() + "-" + p(d.getUTCMonth() + 1) + "-" + p(d.getUTCDate()) +
      " " + p(d.getUTCHours()) + ":" + p(d.getUTCMinutes()) + " UTC";
  }

  function maskPassport(v) {
    var s = clean(v).replace(/\s+/g, "");
    if (!cfg.maskPassport) return dash(v);
    if (!s) return "\u2014";
    if (s.length <= 4) return s.replace(/.(?=.{1})/g, "\u2022");
    var keepEnd = Math.min(2, Math.floor((s.length - 2) / 2));
    var head = s.slice(0, 2);
    var tail = keepEnd > 0 ? s.slice(-keepEnd) : "";
    return head + new Array(Math.max(1, s.length - head.length - tail.length) + 1).join("\u2022") + tail;
  }

  function findRecord(code) {
    var target = normCode(code);
    if (!target) return null;
    for (var i = 0; i < records.length; i++) {
      if (normCode(records[i].code) === target) return records[i];
    }
    return null;
  }

  function verifyUrl(code) {
    var base = clean(cfg.siteUrl).replace(/\/+$/, "");
    var file = /\.html?$/i.test(base) ? base : base + "/verify.html";
    return file + "?code=" + encodeURIComponent(code);
  }

  function statusMeta(status) {
    if (status === "valid") return { cls: "valid", icon: "\u2713", title: t("statusValid"), sub: tSub("statusValidSub") };
    if (status === "expired") return { cls: "expired", icon: "!", title: t("statusExpired"), sub: tSub("statusExpiredSub") };
    if (status === "revoked") return { cls: "revoked", icon: "\u2715", title: t("statusRevoked"), sub: tSub("statusRevokedSub") };
    return { cls: "notfound", icon: "?", title: t("statusNotFound"), sub: tSub("statusNotFoundSub") };
  }

  /* ------------------------------------------------------------------ QR */

  function buildQr(text) {
    if (typeof qrcode !== "function") return null;
    var qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    return qr;
  }

  function qrSvg(text) {
    var qr = buildQr(text);
    if (!qr) return '<p class="qr-note">QR generator unavailable.</p>';
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }

  function qrCanvas(text, scale) {
    var qr = buildQr(text);
    if (!qr) return null;
    scale = scale || 8;
    var margin = 4;
    var n = qr.getModuleCount();
    var px = (n + margin * 2) * scale;
    var canvas = document.createElement("canvas");
    canvas.width = px;
    canvas.height = px;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "#000000";
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (qr.isDark(y, x)) ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
      }
    }
    return canvas;
  }

  /* ---------------------------------------------------------- rendering */

  function row(labelKey, value, opts) {
    opts = opts || {};
    var alt = tAlt(labelKey);
    return "<div><dt>" + esc(t(labelKey)) + (alt ? "<em>" + esc(alt) + "</em>" : "") + "</dt><dd" +
      (opts.mono ? ' class="mono"' : "") + ">" + (opts.raw ? value : esc(dash(value))) + "</dd></div>";
  }

  function fingerprint(rec) {
    var canonical = JSON.stringify([
      rec.code, rec.status, rec.issuedAt || "",
      rec.holder || {}, rec.trip || {},
    ]);
    function fnv(str) {
      var h1 = 0x811c9dc5, h2 = 0x1000193;
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        h1 = (h1 ^ c) * 0x01000193 >>> 0;
        h2 = (h2 + c * (i + 1)) >>> 0;
      }
      return (h1.toString(16) + h2.toString(16)).toUpperCase().padEnd(16, "0").slice(0, 16);
    }
    function group(h) { return h.replace(/(.{4})(?=.)/g, "$1-"); }
    return new Promise(function (resolve) {
      var subtle = window.crypto && window.crypto.subtle;
      if (!subtle || typeof TextEncoder === "undefined") return resolve(group(fnv(canonical)));
      subtle.digest("SHA-256", new TextEncoder().encode(canonical)).then(function (buf) {
        var bytes = Array.prototype.slice.call(new Uint8Array(buf)).slice(0, 8);
        var hex = bytes.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("").toUpperCase();
        resolve(group(hex));
      }).catch(function () { resolve(group(fnv(canonical))); });
    });
  }

  /* Renders one voucher card. rec === null -> "not found" card. */
  function renderCard(rec, opts) {
    opts = opts || {};
    var meta = statusMeta(rec ? rec.status : "notfound");
    var url = rec ? verifyUrl(rec.code) : clean(cfg.siteUrl);

    var html = '<article class="card' + (opts.compact ? " preview-card" : "") + '">';

    html += '<div class="status status--' + meta.cls + '">' +
      '<div class="status-icon" aria-hidden="true">' + meta.icon + "</div>" +
      '<div class="status-text"><strong>' + esc(meta.title) + "</strong><span>" + esc(meta.sub) + "</span></div>" +
      "</div>";

    var h1Alt = tAlt("h1");
    html += '<div class="doc-head">' +
      '<p class="doc-org">' + esc(cfg.operatorName) + "</p>" +
      '<h1 class="doc-title">' + esc(t("h1")) +
      (h1Alt ? '<span class="doc-title-sub">' + esc(h1Alt) + "</span>"
             : '<span class="doc-title-sub">' + esc(t("docSub")) + "</span>") +
      "</h1></div>";

    if (!rec) {
      html += '<div class="form-body"><p style="margin:0 0 16px;color:var(--muted);font-size:14.5px">' +
        esc(t("notFoundBody")) + "</p>" + lookupFormHtml(opts.code || "", true) + "</div>";
    } else {
      var H = rec.holder || {};
      var T = rec.trip || {};

      html += '<dl class="rows">';
      html += row("lblVoucherNo", rec.code, { mono: true });
      html += row("lblIssuedBy", cfg.operatorName);
      html += row("lblLicence", cfg.operatorLicence);
      html += row("lblTaxId", cfg.operatorTaxId, { mono: true });
      html += row("lblSurname", H.surname);
      html += row("lblGiven", H.given);
      html += row("lblPassport", maskPassport(H.passport), { mono: true });
      html += row("lblDob", fmtDate(H.dob));
      html += row("lblGender", H.gender);
      html += row("lblNationality", H.nationality);
      html += row("lblMultiplicity", T.multiplicity);
      html += row("lblEntry", fmtDate(T.entry));
      html += row("lblExit", fmtDate(T.exit));
      html += row("lblPurpose", T.purpose);
      html += row("lblStay", T.stay);
      if (clean(rec.note)) html += row("lblNote", rec.note);
      html += "</dl>";

      if (cfg.showQr !== false) {
        var showQrText = cfg.showQrText !== false;
        html += '<div class="qr-block' + (showQrText ? "" : " qr-block--solo") + '">' +
          '<div class="qr-frame" aria-label="QR code" data-qr>' + qrSvg(url) + "</div>" +
          (showQrText
            ? '<div><p class="qr-note">' + esc(t("qrNote")) + "</p>" +
              '<div class="qr-url">' + esc(url) + "</div></div>"
            : "") +
          "</div>";
      }

      var footAlt = tAlt("footText");
      html += '<footer class="doc-foot">' +
        "<p>" + esc(t("footText")) +
        (footAlt ? '<br><span lang="en">' + esc(footAlt) + "</span>" : "") + "</p>" +
        '<p class="verify-meta">' + esc(t("issuedInline")) + (bilingual ? " / issued" : "") + ": " + esc(fmtStamp(rec.issuedAt)) + "</p>" +
        (cfg.showAuditLine === true
          ? '<div class="meta-row">' +
            '<span data-checked>' + esc(t("lblVerifiedAt")) + ": \u2014</span>" +
            '<span data-fp>' + esc(t("lblFingerprint")) + ": \u2014</span>" +
            "</div>"
          : "") +
        "</footer>";
    }

    html += "</article>";
    return html;
  }

  /* After inserting a card, fill live values (only when the optional
     audit line is enabled in the config). */
  function hydrateCard(container, rec) {
    if (!rec || cfg.showAuditLine !== true) return;
    var stamp = $("[data-checked]", container);
    if (stamp) {
      var now = new Date();
      var iso = now.toISOString().slice(0, 16).replace("T", " ") + " UTC";
      stamp.textContent = t("lblVerifiedAt") + ": " + iso;
    }
    fingerprint(rec).then(function (fp) {
      var node = $("[data-fp]", container);
      if (node) node.textContent = t("lblFingerprint") + ": " + fp;
    });
  }

  /* ------------------------------------------------------------- markup */

  function topbarHtml(active) {
    function link(href, label, key) {
      return '<a href="' + href + '"' + (active === key ? ' aria-current="page"' : "") + ">" + esc(label) + "</a>";
    }
    return '<header class="topbar no-print"><div class="topbar-inner">' +
      '<a class="brand" href="index.html">' +
      '<span class="brand-mark" aria-hidden="true">' +
      '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 2.5 4.5 5.5v6c0 4.7 3.2 8.8 7.5 10 4.3-1.2 7.5-5.3 7.5-10v-6L12 2.5Z"/><path d="m8.8 11.8 2.3 2.3 4.3-4.4"/></svg>' +
      "</span>" +
      '<span class="brand-name">' + esc(cfg.brand || "Verification portal") +
      '<span class="brand-sub">' + esc(cfg.brandSub || "") + "</span></span></a>" +
      '<nav class="topbar-links">' + link("index.html", t("navCheck"), "check") +
      (cfg.showAdminLink === false ? "" : link("admin.html", t("openAdmin"), "admin")) + "</nav>" +
      "</div></header>";
  }

  function lookupFormHtml(prefill, inline) {
    return '<form class="lookup" data-lookup novalidate>' +
      '<div class="field"><label for="code">' + esc(t("searchLabel")) + "</label>" +
      '<input id="code" name="code" type="text" class="code-input" autocomplete="off" spellcheck="false" ' +
      'placeholder="' + esc(t("searchPlaceholder")) + '" value="' + esc(prefill || "") + '">' +
      '<span class="hint">' + esc(t("searchHint")) + "</span></div>" +
      '<button class="btn btn--block" type="submit">' + esc(t("searchBtn")) + "</button>" +
      '<p class="alert" data-error hidden>' + esc(t("searchError")) + "</p>" +
      (inline ? "" : "") +
      "</form>";
  }

  function demoNoticeHtml() {
    if (!cfg.showDemoNotice) return "";
    return '<p class="no-print" style="margin:0 0 16px;padding:11px 14px;border:1px solid var(--warn-line);' +
      'background:var(--warn-bg);color:var(--warn);border-radius:10px;font-size:13px">' +
      esc(t("demoBanner")) + "</p>";
  }

  /* ----------------------------------------------------------- page: home */

  function initHome() {
    var app = $("#app");
    document.title = t("searchTitle");
    app.innerHTML = demoNoticeHtml() +
      '<section class="card">' +
      '<div class="hero"><h1>' + esc(t("searchTitle")) + "</h1><p>" + esc(t("searchLead")) + "</p>" +
      lookupFormHtml(new URLSearchParams(location.search).get("code") || "", false) +
      "</div></section>" +
      '<div class="steps">' +
      '<div class="step"><div class="step-num">1</div><h3>' + esc(t("step1t")) + "</h3><p>" + esc(t("step1b")) + "</p></div>" +
      '<div class="step"><div class="step-num">2</div><h3>' + esc(t("step2t")) + "</h3><p>" + esc(t("step2b")) + "</p></div>" +
      '<div class="step"><div class="step-num">3</div><h3>' + esc(t("step3t")) + "</h3><p>" + esc(t("step3b")) + "</p></div>" +
      "</div>";

    wireLookup(app, function (code) {
      location.href = "verify.html?code=" + encodeURIComponent(code);
    });
  }

  function wireLookup(root, onCode) {
    var form = $("[data-lookup]", root);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("input[name=code]", form);
      var err = $("[data-error]", form);
      var code = clean(input.value);
      if (!normCode(code)) {
        if (err) err.hidden = false;
        input.focus();
        return;
      }
      if (err) err.hidden = true;
      onCode(code.toUpperCase());
    });
  }

  /* --------------------------------------------------------- page: verify */

  function initVerify() {
    var app = $("#app");
    var code = new URLSearchParams(location.search).get("code") || "";
    var rec = findRecord(code);

    if (!clean(code)) {
      app.innerHTML = demoNoticeHtml() +
        '<section class="card"><div class="hero"><h1>' + esc(t("searchTitle")) + "</h1><p>" +
        esc(t("searchLead")) + "</p>" + lookupFormHtml("", false) + "</div></section>";
      wireLookup(app, function (c) {
        location.href = "verify.html?code=" + encodeURIComponent(c);
      });
      return;
    }

    app.innerHTML = demoNoticeHtml() + renderCard(rec, { code: clean(code) });

    if (rec) {
      document.title = rec.code + " \u00b7 " + t("h1");
      hydrateCard(app, rec);
    } else {
      document.title = t("statusNotFound") + " \u00b7 " + t("h1");
      wireLookup(app, function (c) {
        location.href = "verify.html?code=" + encodeURIComponent(c);
      });
    }

    if (cfg.showActions === true) {
      var actions = document.createElement("div");
      actions.className = "btn-row no-print";
      actions.style.marginTop = "18px";
      actions.innerHTML = '<a class="btn btn--ghost" href="index.html">' + esc(t("backToLookup")) + "</a>" +
        (rec ? '<button class="btn btn--ghost" type="button" data-print>' + esc(t("printBtn")) + "</button>" : "");
      app.appendChild(actions);
      var printBtn = $("[data-print]", actions);
      if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
    }
  }

  /* ---------------------------------------------------------- page: admin */

  var ADMIN_FIELDS = [
    {
      legend: "Voucher",
      items: [
        { key: "code", label: "Voucher number", placeholder: "GV-7K4M-9XQ2", upper: true, half: true },
        { key: "status", label: "Status", type: "select", options: ["valid", "revoked", "expired"], half: true },
        { key: "issuedAt", label: "Issued (UTC)", type: "datetime-local" },
      ],
    },
    {
      legend: "Traveller",
      items: [
        { key: "surname", label: "Surname", upper: true, half: true },
        { key: "given", label: "Given name", upper: true, half: true },
        { key: "passport", label: "Passport number", half: true },
        { key: "dob", label: "Date of birth", type: "date", half: true },
        { key: "gender", label: "Gender", type: "select", options: ["M", "F", "X"], half: true },
        { key: "nationality", label: "Nationality", half: true },
      ],
    },
    {
      legend: "Trip",
      items: [
        { key: "multiplicity", label: "Entry type", type: "select", options: ["Single entry", "Double entry", "Multiple entry"], half: true },
        { key: "purpose", label: "Purpose of trip", half: true },
        { key: "entry", label: "Planned entry", type: "date", half: true },
        { key: "exit", label: "Planned exit", type: "date", half: true },
        { key: "stay", label: "Accommodation" },
        { key: "note", label: "Internal remark (optional)", type: "textarea" },
      ],
    },
  ];

  function fieldHtml(f) {
    var id = "f-" + f.key;
    var label = '<label for="' + id + '">' + esc(f.label) + "</label>";
    var input;
    if (f.type === "select") {
      input = '<select id="' + id + '" name="' + f.key + '">' +
        f.options.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("") +
        "</select>";
    } else if (f.type === "textarea") {
      input = '<textarea id="' + id + '" name="' + f.key + '" rows="2" style="min-height:64px;font-family:inherit;font-size:14px"></textarea>';
    } else {
      input = '<input id="' + id + '" name="' + f.key + '" type="' + (f.type || "text") + '"' +
        (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") +
        (f.upper ? ' style="text-transform:uppercase"' : "") + ">";
    }
    return '<div class="field">' + label + input + "</div>";
  }

  function initAdmin() {
    var app = $("#app");
    var form = '<form data-builder><div class="grid-2">';
    ADMIN_FIELDS.forEach(function (group) {
      form += '<fieldset style="grid-column:1/-1"><legend>' + esc(group.legend) + "</legend>";
      form += '<div class="grid-2">';
      group.items.forEach(function (f) {
        form += '<div' + (f.half || f.type === "textarea" ? "" : ' style="grid-column:1/-1"') + ">" + fieldHtml(f) + "</div>";
      });
      form += "</div></fieldset>";
    });
    form += "</div></form>";

    app.innerHTML = demoNoticeHtml() +
      '<section class="card"><div class="doc-head"><h1 class="doc-title">Voucher builder' +
      '<span class="doc-title-sub">Runs entirely in this browser \u2014 nothing is uploaded</span></h1></div>' +
      '<div class="form-body">' +
      '<p style="margin:0 0 18px;color:var(--muted);font-size:13.5px">Fill the fields, then copy the generated record into ' +
      "<code>data/vouchers.js</code> and share the QR code or the verify link. This page is the issuer-side tool: " +
      "do not publish <code>admin.html</code> on a public server.</p>" +
      '<div class="split"><div class="no-print">' + form +
      '<div class="btn-row"><button class="btn" type="button" data-json-copy>Copy record JSON</button>' +
      '<button class="btn btn--ghost" type="button" data-json-download>Download JSON</button>' +
      '<button class="btn btn--ghost" type="button" data-qr-download>Download QR (SVG)</button>' +
      '<button class="btn btn--ghost" type="button" data-qr-png>Download QR (PNG)</button>' +
      '<button class="btn btn--ghost" type="button" data-print>Print voucher</button></div></div>' +
      '<div class="sticky" data-preview></div></div>' +
      "</div></section>";

    var builder = $("[data-builder]", app);
    var preview = $("[data-preview]", app);

    function readForm() {
      var data = {};
      $$("input, select, textarea", builder).forEach(function (el) { data[el.name] = clean(el.value); });
      return data;
    }

    function toRecord(d) {
      var issued = d.issuedAt ? new Date(d.issuedAt) : new Date();
      var iso = isNaN(issued.getTime()) ? new Date().toISOString() : issued.toISOString();
      return {
        code: d.code ? d.code.toUpperCase() : "",
        status: d.status || "valid",
        issuedAt: iso.replace(/\.\d{3}Z$/, "Z"),
        holder: {
          surname: d.surname || "",
          given: d.given || "",
          passport: d.passport || "",
          dob: d.dob || "",
          gender: d.gender || "",
          nationality: d.nationality || "",
        },
        trip: {
          multiplicity: d.multiplicity || "",
          entry: d.entry || "",
          exit: d.exit || "",
          purpose: d.purpose || "",
          stay: d.stay || "",
        },
        note: d.note || "",
      };
    }

    function refresh() {
      var rec = toRecord(readForm());
      preview.innerHTML = rec.code
        ? renderCard(rec, { compact: true })
        : '<div class="card"><div class="form-body"><p style="margin:0;color:var(--muted);font-size:13.5px">' +
          "Enter a voucher number to preview the verification page.</p></div></div>";
      if (rec.code) hydrateCard(preview, rec);
      return rec;
    }

    function toast(msg) {
      var el = document.createElement("div");
      el.className = "toast";
      el.textContent = msg;
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add("is-on"); });
      setTimeout(function () {
        el.classList.remove("is-on");
        setTimeout(function () { el.remove(); }, 220);
      }, 1600);
    }

    function download(name, mime, content) {
      var blob = new Blob([content], { type: mime });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    builder.addEventListener("input", refresh);
    builder.addEventListener("change", refresh);

    $$("[data-json-copy]", app).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var rec = refresh();
        if (!rec.code) return toast("Add a voucher number first");
        var text = JSON.stringify(rec, null, 2) + ",";
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
          .then(function () { toast("Record copied"); })
          .catch(function () {
            var ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
            toast("Record copied");
          });
      });
    });

    $$("[data-json-download]", app).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var rec = refresh();
        if (!rec.code) return toast("Add a voucher number first");
        download((rec.code || "voucher") + ".json", "application/json", JSON.stringify(rec, null, 2));
      });
    });

    $$("[data-qr-download]", app).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var rec = refresh();
        if (!rec.code) return toast("Add a voucher number first");
        download((rec.code || "voucher") + "-qr.svg", "image/svg+xml", qrSvg(verifyUrl(rec.code)));
      });
    });

    $$("[data-qr-png]", app).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var rec = refresh();
        if (!rec.code) return toast("Add a voucher number first");
        var canvas = qrCanvas(verifyUrl(rec.code), 12);
        if (!canvas) return toast("QR generator unavailable");
        canvas.toBlob(function (blob) {
          if (!blob) return;
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = rec.code + "-qr.png";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        }, "image/png");
      });
    });

    $$("[data-print]", app).forEach(function (btn) {
      btn.addEventListener("click", function () { window.print(); });
    });

    /* seed the form with a sensible demo record */
    var seed = records[0];
    if (seed) {
      var flat = {
        code: seed.code,
        status: seed.status,
        issuedAt: (seed.issuedAt || "").slice(0, 16),
        surname: seed.holder && seed.holder.surname,
        given: seed.holder && seed.holder.given,
        passport: seed.holder && seed.holder.passport,
        dob: seed.holder && seed.holder.dob,
        gender: seed.holder && seed.holder.gender,
        nationality: seed.holder && seed.holder.nationality,
        multiplicity: seed.trip && seed.trip.multiplicity,
        purpose: seed.trip && seed.trip.purpose,
        entry: seed.trip && seed.trip.entry,
        exit: seed.trip && seed.trip.exit,
        stay: seed.trip && seed.trip.stay,
        note: seed.note || "",
      };
      $$("input, select, textarea", builder).forEach(function (el) {
        if (flat[el.name] != null) el.value = String(flat[el.name]);
      });
    }

    refresh();
  }

  /* ------------------------------------------------------------------ boot */

  function boot() {
    var page = document.body.getAttribute("data-page");
    document.documentElement.lang = lang;
    var bar = $("[data-topbar]");
    var showBar = page === "admin" || cfg.showTopbar === true;
    if (bar) {
      if (showBar) bar.outerHTML = topbarHtml(page === "admin" ? "admin" : "check");
      else bar.remove();
    }

    if (typeof qrcode !== "function") {
      console.warn("[portal] qrcode.js missing - QR codes will not render.");
    }

    if (page === "home") initHome();
    else if (page === "verify") initVerify();
    else if (page === "admin") initAdmin();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
