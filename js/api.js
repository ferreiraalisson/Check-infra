/* =========================================================
 * API — Camada de comunicação (Model do MVC)
 * Envia os registros ao Apps Script (Google Sheets)
 * ou guarda em localStorage quando OFFLINE_MODE = true.
 * ========================================================= */
(function () {
  const KEY_LOCAL = "infra_pred_registros";

  function showToast(msg, type) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.className = "toast show " + (type || "");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => (el.className = "toast"), 2800);
  }

  function saveLocal(payload) {
    const list = JSON.parse(localStorage.getItem(KEY_LOCAL) || "[]");
    list.push({ ...payload, _localId: Date.now() });
    localStorage.setItem(KEY_LOCAL, JSON.stringify(list));
  }

  async function send(payload) {
    const cfg = window.APP_CONFIG || {};
    if (cfg.OFFLINE_MODE || !cfg.SHEETS_WEBAPP_URL) {
      saveLocal(payload);
      showToast("Salvo localmente (modo offline)", "ok");
      return { ok: true, offline: true };
    }
    try {
      // Usa text/plain p/ evitar preflight CORS no Apps Script
      const res = await fetch(cfg.SHEETS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || ("HTTP " + res.status));
      }
      showToast("✓ Registro enviado", "ok");
      return { ok: true };
    } catch (e) {
      console.error(e);
      saveLocal(payload);
      showToast("Sem internet — salvo no celular", "err");
      return { ok: false, error: String(e) };
    }
  }

  function rememberName(name) {
    if (name) localStorage.setItem("infra_user", name);
  }
  function getRememberedName() {
    return localStorage.getItem("infra_user") || "";
  }

  window.API = { send, showToast, rememberName, getRememberedName };
})();
