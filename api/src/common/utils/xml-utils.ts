// ===============================
// FUNÇÕES DE VALIDAÇÃO PARA XML
// ===============================

// Garante string nunca undefined
export function safeString(value: any): string {
  return value ? String(value).trim() : "";
}

// Limita quantidade máxima de caracteres
export function maxLen(value: any, len: number): string {
  const s = safeString(value);
  return s.length > len ? s.substring(0, len) : s;
}

// Converte para integer limitado
export function toInt(value: any, maxDigits: number): string {
  if (value === null || value === undefined || value === "") return "0";
  const n = parseInt(value);
  if (isNaN(n)) return "0";
  return String(n).substring(0, maxDigits);
}

// Converte para float padrão X.YY
export function toFloat(value: any): string {
  const n = Number(value);
  if (isNaN(n)) return "0.00";
  return n.toFixed(2);
}

// Char fixo (1, 2…)
export function toChar(value: any, size: number): string {
  const s = safeString(value).toUpperCase();
  return s.substring(0, size);
}

// Convert DATETIME → AAAA-MM-DD HH:mm:ss
export function toDateTime(value: any): string {
  if (!value) return "";
  const date = new Date(value);

  if (isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// Remove parenteses, hífens, barras → útil para bairro
export function cleanName(value: any): string {
  return safeString(value)
    .replace(/\(.*?\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// CEP máximo 9 caracteres
export function cleanCEP(value: any): string {
  return maxLen(safeString(value), 9);
}

// Limita descrição a 3000 chars
export function cleanDescription(desc: any): string {
  return maxLen(desc, 3000);
}
