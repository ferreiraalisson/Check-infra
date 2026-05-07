/* Controller — Ocorrências */
(function () {
  const form = document.getElementById("ocoForm");
  const nomeEl = document.getElementById("ocoNome");
  const fotoInput = document.getElementById("ocoFoto");
  const fotoPreview = document.getElementById("ocoFotoPreview");
  let photoBase64 = null;

  nomeEl.value = API.getRememberedName();

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
          canvas.width = width; canvas.height = height;
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
    if (!file) { photoBase64 = null; fotoPreview.classList.remove("show"); return; }
    try {
      const compressed = await compressImage(file, 1024, 0.7);
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
    const nome = nomeEl.value.trim();
    const local = document.getElementById("ocoLocal").value.trim();
    const tipo = document.getElementById("ocoTipo").value;
    const descricao = document.getElementById("ocoDescricao").value.trim();
    if (!nome || !local || !tipo || !descricao) {
      API.showToast("Preencha todos os campos", "err"); return;
    }
    if (descricao.length > 500) {
      API.showToast("Descrição muito longa (máx. 500)", "err"); return;
    }
    API.rememberName(nome);

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Enviando...";

    await API.send({
      sheet: "Ocorrencias",
      timestamp: new Date().toISOString(),
      nome, local, tipo, descricao,
      foto: photoBase64 ? photoBase64.dataUrl : "",
      fotoNome: photoBase64 ? photoBase64.name : ""
    });

    btn.disabled = false; btn.textContent = "Enviar ocorrência";
    form.reset();
    photoBase64 = null;
    fotoPreview.classList.remove("show");
    nomeEl.value = API.getRememberedName();
  });
})();
