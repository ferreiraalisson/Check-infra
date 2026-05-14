/* =========================================================
 * API — Camada de comunicação
 * Envia os registros ao Apps Script (Google Sheets)
 * Quando a internet volta, sincroniza os registros pendentes do localStorage.
 * ========================================================= */
(function () {
  const KEY_LOCAL = "infra_pred_registros";
  const KEY_CRYPTO = "infra_crypto_key"; 
  let syncing = false;

  /* ----------------------------------------------------------
   * Toast - Notificação
   * ---------------------------------------------------------- */
  function showToast(msg, type) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.className = "toast show " + (type || "");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => (el.className = "toast"), 2800);
  }

  /* ----------------------------------------------------------
   * CIFRAGEM — Web Crypto API (AES-GCM 256 bits)
   * ---------------------------------------------------------- */
  
  async function getOrCreateKey() {
    const stored = localStorage.getItem(KEY_CRYPTO);
    if (stored) {
      const jwk = JSON.parse(stored);
      return crypto.subtle.importKey("jwk", jwk, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
    }
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const jwk = await crypto.subtle.exportKey("jwk", key);
    localStorage.setItem(KEY_CRYPTO, JSON.stringify(jwk));
    return key;
  }
 
  async function encrypt(obj) {
    const key = await getOrCreateKey();
    const iv  = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ct  = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
    // Serializa IV + ciphertext juntos em base64
    const combined = new Uint8Array(iv.byteLength + ct.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ct), iv.byteLength);
    return btoa(String.fromCharCode(...combined));
  }
 
  async function decrypt(b64) {
    const key  = await getOrCreateKey();
    const data = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const iv   = data.slice(0, 12);
    const ct   = data.slice(12);
    const pt   = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(pt));
  }
  
  /* ----------------------------------------------------------
   * FILA LOCAL — leitura/escrita cifrada
   * ---------------------------------------------------------- */
  
  async function getLocalList() {
    const raw = localStorage.getItem(KEY_LOCAL);
    if (!raw) return [];
    try {
      // Suporte à migração: se ainda estiver em JSON puro (sem cifragem),
      // retorna como está e será regravado cifrado na próxima escrita.
      if (raw.startsWith("[")) return JSON.parse(raw);
      return await decrypt(raw);
    } catch (e) {
      console.warn("Falha ao ler fila local:", e);
      return [];
    }
  }
 
  async function setLocalList(list) {
    if (!list.length) {
      localStorage.removeItem(KEY_LOCAL);
      return;
    }
    const ciphertext = await encrypt(list);
    localStorage.setItem(KEY_LOCAL, ciphertext);
  }
 
  function createListId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now() + "-" + Math.random().toString(16).slice(2);
  }
 
  async function saveLocal(payload) {
    const list = await getLocalList();
    const item = {
      ...payload,
      _listId:   payload._listId   || createListId(),
      _localId:  payload._localId  || Date.now(),
      _savedAt:  payload._savedAt  || new Date().toISOString()
    };
    list.push(item);
    await setLocalList(list);
  }

  /* ----------------------------------------------------------
   * ENVIO AO SERVIDOR
   * ---------------------------------------------------------- */

  async function postToServer(payload) {         
    const config = window.APP_CONFIG || {};
    if (!config.SHEETS_WEBAPP_URL) throw new Error("SHEETS_WEBAPP_URL não configurada");
 
    // Usa text/plain para evitar preflight CORS no Apps Script
    const res  = await fetch(config.SHEETS_WEBAPP_URL, {
      method:  "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body:    JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) throw new Error(data.error || ("HTTP " + res.status));
    return data;
  }

  async function send(payload) {
    const cfg = window.APP_CONFIG || {};
 
    const payloadWithId = {
      ...payload,
      _listId: payload._listId || createListId()
    };
 
    if (cfg.OFFLINE_MODE || !cfg.SHEETS_WEBAPP_URL) {
      await saveLocal(payloadWithId);
      showToast("Salvo localmente. Será enviado quando a internet voltar.", "ok");
      return { ok: true, offline: true };
    }
 
    try {
      await postToServer(payloadWithId);
      showToast("✓ Registro enviado", "ok");
      return { ok: true };
    } catch (e) {
      console.error("Falha ao enviar — salvando localmente:", e);
      await saveLocal(payloadWithId);
      showToast("Sem internet — salvo no celular", "err");
      return { ok: false, error: String(e) };
    }
  }

  /* ----------------------------------------------------------
   * syncPending() — sincroniza a fila local quando online
   * ---------------------------------------------------------- */
  async function syncPending() {
    const cfg = window.APP_CONFIG || {};
    if (syncing)               return;
    if (cfg.OFFLINE_MODE)      return;
    if (!cfg.SHEETS_WEBAPP_URL) return;
    if (!navigator.onLine)     return;
 
    const queue = await getLocalList();
    if (!queue.length) return;
 
    syncing = true;
    showToast("Sincronizando registros pendentes...", "ok");
 
    const remaining = [];
    let enviados = 0;
 
    for (const item of queue) {
      try {
        await postToServer(item);
        enviados++;
      } catch (e) {
        console.error("Falha ao sincronizar item:", e);
        remaining.push(item);
      }
    }
 
    await setLocalList(remaining);
    syncing = false;
 
    if (enviados > 0 && remaining.length === 0) {
      showToast("✓ Todos os registros pendentes foram sincronizados", "ok");
    } else if (enviados > 0) {
      showToast(`${enviados} enviado(s), ${remaining.length} ainda pendente(s)`, "err");
    } else if (remaining.length > 0) {
      showToast(`${remaining.length} registro(s) ainda pendente(s)`, "err");
    }
 
    return { ok: remaining.length === 0, enviados, pendentes: remaining.length };
  }

  window.addEventListener("online", () => {
    console.log("Conexão restaurada — sincronizando...");
    API.syncPending();
  });

  async function countPending() {
    return (await getLocalList()).length;
  }
  async function clearPending() {
    await setLocalList([]);
  }
 
  function rememberName(name) {
    if (name) localStorage.setItem("infra_user", name);
  }
  function getRememberedName() {
    return localStorage.getItem("infra_user") || "";
  }

  window.API = { send, showToast, rememberName, getRememberedName, countPending, clearPending, syncPending };
})();
