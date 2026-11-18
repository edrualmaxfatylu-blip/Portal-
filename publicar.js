// Arma la carpeta _site con solo lo que se publica.
// Lo usa Cloudflare Pages:  comando de compilación «node publicar.js» · carpeta de salida «_site».
// GitHub Pages no lo necesita (allá _config.yml deja fuera lo mismo).
const fs = require("fs"), path = require("path");
const RAIZ = __dirname, SALIDA = path.join(RAIZ, "_site");

// Lo que _config.yml deja fuera (la fábrica, fuentes y notas), más archivos internos.
const FUERA = new Set(["CNAME", "node_modules"]);
const yml = fs.readFileSync(path.join(RAIZ, "_config.yml"), "utf8").split("\n");
let enLista = false;
for (const l of yml) {
  if (/^exclude:/.test(l)) { enLista = true; continue; }
  const m = l.match(/^\s+-\s+(.+?)\s*$/);
  if (enLista && m) FUERA.add(m[1].replace(/\/$/, ""));
  else if (enLista && /^\S/.test(l)) enLista = false;
}

function copiar(rel) {
  for (const n of fs.readdirSync(path.join(RAIZ, rel))) {
    const r = rel ? rel + "/" + n : n;
    // Igual que GitHub Pages: lo que empieza con «.» o «_» no se publica.
    if (n.startsWith(".") || n.startsWith("_") || FUERA.has(r)) continue;
    const de = path.join(RAIZ, r), a = path.join(SALIDA, r);
    if (fs.statSync(de).isDirectory()) { fs.mkdirSync(a, { recursive: true }); copiar(r); }
    else fs.copyFileSync(de, a);
  }
}

fs.rmSync(SALIDA, { recursive: true, force: true });
fs.mkdirSync(SALIDA);
copiar("");

// Seguro: si la fábrica se coló, la compilación falla y no se publica nada.
for (const p of ["fabrica", "arma/fuente.html", "README.md"]) {
  if (fs.existsSync(path.join(SALIDA, p))) { console.error("ALTO: " + p + " no debe publicarse"); process.exit(1); }
}
console.log("_site listo: " + FUERA.size + " exclusiones, la fábrica queda fuera.");
