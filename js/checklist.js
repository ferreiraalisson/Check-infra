/* =========================================================
 * CHECKLIST — Controller + View
 * ========================================================= */
(function () {
  const items = window.CHECKLIST_ITEMS;
  const grid = document.getElementById("checklistGrid");
  const filterBar = document.getElementById("filterBar");
  const userInput = document.getElementById("userName");
  const nowValue = document.getElementById("nowValue");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");

  let activeItem = null;
  let activeFilter = "todos";

  // ===== Relógio ao vivo =====
  function tick() {
    const d = new Date();
    const date = d.toLocaleDateString("pt-BR");
    const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (nowValue) nowValue.textContent = `${date} · ${time}`;
  }
  tick();
  setInterval(tick, 30 * 1000);

  // restaura nome
  userInput.value = API.getRememberedName();
  userInput.addEventListener("change", () => API.rememberName(userInput.value.trim()));

  // ===== Filtros =====
  const periodicidades = ["todos", ...new Set(items.map(i => i.periodicidade))];
  filterBar.innerHTML = periodicidades.map(p =>
    `<button class="chip ${p} ${p === activeFilter ? "active" : ""}" data-p="${p}">${p[0].toUpperCase()+p.slice(1)}</button>`
  ).join("");
  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip"); if (!btn) return;
    activeFilter = btn.dataset.p;
    [...filterBar.children].forEach(c => c.classList.toggle("active", c === btn));
    render();
  });

  // ===== Render dos cards =====
  function render() {
    const filtered = activeFilter === "todos" ? items : items.filter(i => i.periodicidade === activeFilter);
    grid.innerHTML = filtered.map(i => `
      <article class="card" data-id="${i.id}">
        <span class="accent"></span>
        <div class="card-header">
          <h3>${i.local}</h3>
          <span class="badge ${i.periodicidade}">${i.periodicidade}</span>
        </div>
        <p class="desc">${i.desc}</p>
        <div class="card-actions">
          <button class="btn primary" data-action="open">REGISTRAR</button>
        </div>
      </article>
    `).join("");
  }
  render();

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="open"]'); if (!btn) return;
    const id = btn.closest(".card").dataset.id;
    activeItem = items.find(i => i.id === id);
    openModal(activeItem);
  });

  // ===== Form helpers =====
  function radio(name, opts) {
    return `<div class="options">${opts.map((o,idx)=>`
      <input type="radio" id="${name}_${idx}" name="${name}" value="${o}" ${idx===0?"checked":""} />
      <label for="${name}_${idx}">${o}</label>`).join("")}</div>`;
  }
  function field(label, html) {
    return `<div class="field"><label>${label}</label>${html}</div>`;
  }
  function todayISO() {
    const d = new Date();
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d - tz).toISOString().slice(0, 10);
  }
  function buildForm(item) {
    let html = "";
    // Campo data — sempre presente, pré-preenchido com hoje
    html += field("Data do registro", `<input type="date" name="data" value="${todayISO()}" />`);

    switch (item.tipo) {
      case "ok_nok":
        html += field("Condição", radio("condicao", ["OK", "Atenção", "Problema"]));
        break;
      case "portas":
        html += field("Condição", radio("condicao", ["OK", "Atenção", "Problema"]));
        html += field("Portas fechadas?", radio("fechado", ["Sim", "Não"]));
        break;
      case "condicao":
        html += field("Condição do ambiente/equipamento", radio("condicao", ["Boa", "Regular", "Ruim"]));
        html += field("Estações fechadas?", radio("fechado", ["Sim", "Não"]));
        break;
      case "bomba":
        html += field("Condição da bomba", radio("condicao", ["Boa", "Regular", "Ruim"]));
        html += field("Modo", radio("modo", ["Automático", "Manual"]));
        html += field("Bomba ativa", radio("bomba", ["Bomba 1", "Bomba 2", "Nenhuma"]));
        break;
      case "hidrometro":
        html += field("Registro", radio("registro", ["Aberto", "Fechado"]));
        html += field("Numeração (m³)", `<input type="text" inputmode="decimal" name="numeracao" placeholder="Ex.: 12345,678" />`);
        break;
      case "nivel":
        html += field("Nível de água", radio("nivel", ["Cheio", "Alto (≈75%)", "Médio (≈50%)", "Baixo (≈25%)", "Vazio"]));
        html += field("Condição da estrutura", radio("condicao", ["Boa", "Regular", "Ruim"]));
        break;
      case "limpeza":
        html += field("Condição", radio("condicao", ["Boa", "Suja", "Crítica"]));
        html += field("Limpeza realizada?", radio("limpeza", ["Sim", "Não", "Parcial"]));
        break;
      case "cpd":
        html += field("Ar-condicionado", radio("ar", ["Funcionando", "Com falha", "Desligado"]));
        html += field("Câmeras", radio("cameras", ["Funcionando", "Com falha"]));
        break;
      default:
        html += field("Status", radio("status", ["OK", "Problema"]));
    }
    html += field("Observação (opcional)", `<textarea name="obs" rows="3" placeholder="Algo a anotar?"></textarea>`);
    return html;
  }

  function openModal(item) {
    modalTitle.innerHTML = item.local;
    modalBody.innerHTML = buildForm(item);
    modal.hidden = false;
  }
  function closeM() { modal.hidden = true; }
  closeModal.addEventListener("click", closeM);
  cancelBtn.addEventListener("click", closeM);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeM(); });

  // ===== Salvar =====
  saveBtn.addEventListener("click", async () => {
    const nome = userInput.value.trim();
    if (!nome) { API.showToast("Informe seu nome", "err"); userInput.focus(); return; }
    API.rememberName(nome);

    const data = {};
    modalBody.querySelectorAll('input[type="radio"]:checked').forEach(r => data[r.name] = r.value);
    modalBody.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(t => data[t.name] = t.value.trim());

    const payload = {
      sheet: "Checklist",
      timestamp: new Date().toISOString(),
      nome,
      local: activeItem.local,
      itemId: activeItem.id,
      periodicidade: activeItem.periodicidade,
      ...data
    };

    saveBtn.disabled = true; saveBtn.textContent = "Enviando...";
    await API.send(payload);
    saveBtn.disabled = false; saveBtn.textContent = "Salvar registro";
    closeM();
  });
})();
