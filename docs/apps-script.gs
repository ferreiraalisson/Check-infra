/**
 * Cole este código no Google Apps Script vinculado à sua planilha.
 *
 * 1) Crie a planilha (qualquer nome) com 2 abas: "Checklist" e "Ocorrencias".
 * 2) Em Extensões → Apps Script, cole este arquivo.
 * 3) (Opcional) Defina FOTO_FOLDER_ID com o ID de uma pasta do Drive
 *    onde as fotos serão salvas. Se deixar vazio, será criada uma pasta
 *    "Infra Predial - Fotos" no seu Drive automaticamente.
 * 4) Implementar → Nova implantação → Tipo: App da Web
 *    - Executar como: Eu mesmo
 *    - Quem tem acesso: Qualquer pessoa
 * 5) Copie a URL (termina em /exec) e cole em js/config.js como SHEETS_WEBAPP_URL.
 *
 * IMPORTANTE: ao reimplantar uma versão nova, marque "Nova versão"
 * para que as mudanças entrem em vigor.
 */

const SHEET_ID = "";        // opcional — vazio usa a planilha vinculada
const FOTO_FOLDER_ID = "";  // opcional — ID de pasta do Drive p/ salvar fotos

function _ss() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function _ensureSheet(name, headers) {
  const ss = _ss();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function _getFotoFolder() {
  if (FOTO_FOLDER_ID) return DriveApp.getFolderById(FOTO_FOLDER_ID);
  const name = "Infra Predial - Fotos";
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

/**
 * Recebe um data URL "data:image/jpeg;base64,...." e salva no Drive.
 * Retorna a URL pública (visualizável) do arquivo.
 */
function _saveFoto(dataUrl, suggestedName) {
  if (!dataUrl || dataUrl.indexOf("base64,") === -1) return "";
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!match) return "";
  const mime = match[1];
  const bytes = Utilities.base64Decode(match[2]);
  const ext = mime.split("/")[1].replace("jpeg", "jpg");
  const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "America/Sao_Paulo", "yyyyMMdd_HHmmss");
  const safeName = (suggestedName || "foto").replace(/[^\w.-]+/g, "_").slice(0, 40);
  const blob = Utilities.newBlob(bytes, mime, `${ts}_${safeName}.${ext}`);
  const file = _getFotoFolder().createFile(blob);
  // Deixa visível para quem tiver o link
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  return file.getUrl();
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheetName = body.sheet === "Ocorrencias" ? "Ocorrencias" : "Checklist";
    delete body.sheet;

    // Se houver foto em base64, salva no Drive e substitui pelo link
    if (body.foto && String(body.foto).indexOf("base64,") !== -1) {
      body.foto = _saveFoto(body.foto, body.fotoNome || (body.itemId || "registro"));
    }
    delete body.fotoNome;

    const sh = _ensureSheet(sheetName, Object.keys(body));
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

    const novas = Object.keys(body).filter(k => headers.indexOf(k) === -1);
    if (novas.length) {
      sh.getRange(1, headers.length + 1, 1, novas.length).setValues([novas]);
      novas.forEach(n => headers.push(n));
    }

    const linha = headers.map(h => body[h] !== undefined ? body[h] : "");
    sh.appendRow(linha);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Infra Predial — endpoint ativo.");
}
