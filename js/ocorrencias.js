/* Controller — Ocorrências */
(function () {
  const nowValue = document.getElementById("nowValue");
  const form = document.getElementById("ocoForm");
  const nomeEl = document.getElementById("ocoNome");
  const fotoInput = document.getElementById("ocoFoto");
  const fotoPreview = document.getElementById("ocoFotoPreview");
  let photoBase64 = null;

  nomeEl.value = API.getRememberedName();

  // ===== Relógio ao vivo =====
  function tick() {
    const d = new Date();
    const date = d.toLocaleDateString("pt-BR");
    const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (nowValue) nowValue.textContent = `${date} · ${time}`;
  }
  tick();
  setInterval(tick, 30 * 1000);

  /* Compressão de image */

  const MAX_FOTO_BYTES = 150 * 1024; // 150 KB em base64 — limite seguro para o payload
  const IMG_MAX_DIM    = 640;        // largura/altura máxima em pixels
  const IMG_QUALITY    = 0.5;        // qualidade JPEG (0–1) — suficiente para reconhecer a ocorrência
 
  function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round(height * maxDim / width); width = maxDim;
          } else if (height > maxDim) {
            width = Math.round(width * maxDim / height); height = maxDim;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  fotoInput?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      photoBase64 = null;
      fotoPreview.classList.remove("show");
      return;
    }
    try {
      const compressed = await compressImage(file, IMG_MAX_DIM, IMG_QUALITY);
 
      // CORRIGIDO: verificação de tamanho pós-compressão
      // Base64 tem overhead de ~33% sobre o binário; o tamanho real em bytes
      // pode ser estimado pelo comprimento da string × 0,75.
      const estimatedBytes = Math.round(compressed.length * 0.75);
      if (estimatedBytes > MAX_FOTO_BYTES) {
        API.showToast(
          `Foto ainda grande (${Math.round(estimatedBytes / 1024)} KB). Tente uma imagem menor.`,
          "err"
        );
        fotoInput.value = "";
        photoBase64 = null;
        fotoPreview.classList.remove("show");
        return;
      }
 
      photoBase64 = { dataUrl: compressed, name: file.name, mime: "image/jpeg" };
      fotoPreview.src = compressed;
      fotoPreview.classList.add("show");
    } catch (err) {
      console.error(err);
      API.showToast("Não foi possível processar a foto", "err");
    }
  });
 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome      = nomeEl.value.trim();
    const local     = document.getElementById("ocoLocal").value.trim();
    const tipo      = document.getElementById("ocoTipo").value;
    const descricao = document.getElementById("ocoDescricao").value.trim();
 
    if (!nome || !local || !tipo || !descricao) {
      API.showToast("Preencha todos os campos", "err");
      return;
    }
    if (descricao.length > 500) {
      API.showToast("Descrição muito longa (máx. 500 caracteres)", "err");
      return;
    }
 
    API.rememberName(nome);
 
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Enviando...";
 
    await API.send({
      sheet:     "Ocorrencias",
      timestamp: new Date().toISOString(),
      nome,
      local,
      tipo,
      descricao,
      foto:      photoBase64 ? photoBase64.dataUrl : "",
      fotoNome:  photoBase64 ? photoBase64.name    : ""
    });
 
    btn.disabled = false;
    btn.textContent = "ENVIAR OCORRÊNCIA";
    form.reset();
    photoBase64 = null;
    fotoPreview.classList.remove("show");
    nomeEl.value = API.getRememberedName();
  });
})();