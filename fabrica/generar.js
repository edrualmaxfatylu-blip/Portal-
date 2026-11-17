// Fábrica portalab: arma un portal a partir de una plantilla y sus datos.
//
//   node fabrica/generar.js construir [copia-para-claude.html]
//       Vuelve a armar fabrica/index.html con las plantillas actuales
//       (córrelo cada vez que cambies una plantilla).
//
//   node fabrica/generar.js portal datos.json
//       datos.json = {"plantilla":"negocio","slug":"estetica-lupita","config":{...}}
//       Escribe clientes/<slug>/index.html con las fotos ya incrustadas.

const fs = require("fs"), path = require("path"), vm = require("vm");
const RAIZ = path.join(__dirname, "..");

const PLANTILLAS = {
  negocio:  { nombre: "Portal de negocio",  tipo: "negocio",    ruta: "plantillas/negocio/index.html" },
  boda:     { nombre: "Boda o XV años",     tipo: "invitacion", ruta: "boda/index.html" },
  cuento:   { nombre: "Cuento de hadas",    tipo: "invitacion", ruta: "cuento/index.html" },
  juguetes: { nombre: "Juguetes",           tipo: "invitacion", ruta: "juguetes/index.html" },
  selva:    { nombre: "Selva",              tipo: "invitacion", ruta: "selva/index.html" }
};

// Ubica el bloque `const CONFIG={ ... };` de una plantilla.
function bloque(html) {
  const i = html.indexOf("const CONFIG={");
  const j = html.indexOf("\n};", i);
  if (i < 0 || j < 0) throw new Error("La plantilla no tiene un bloque CONFIG");
  return { i, j: j + 3, literal: html.slice(i + "const CONFIG=".length, j + 2) };
}

// Misma función que usa la fábrica en el navegador.
function generar(html, config) {
  const b = bloque(html);
  const json = JSON.stringify(config, null, 1)
    .replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return html.slice(0, b.i) + "// Hecho con la fábrica portalab\nconst CONFIG=" + json + ";" + html.slice(b.j);
}

function leer(r) { return fs.readFileSync(path.join(RAIZ, r), "utf8"); }

function construir() {
  const datos = {};
  for (const [id, p] of Object.entries(PLANTILLAS)) {
    const html = leer(p.ruta);
    const base = vm.runInNewContext("(" + bloque(html).literal + ")");
    datos[id] = { nombre: p.nombre, tipo: p.tipo, ruta: p.ruta, base, html };
  }
  const json = JSON.stringify(datos).replace(/</g, "\\u003c");
  const fuente = leer("fabrica/fuente.html");
  if (!fuente.includes("/*PLANTILLAS*/")) throw new Error("fuente.html sin marcador /*PLANTILLAS*/");
  const cuerpo = fuente.replace("/*PLANTILLAS*/", () => json);
  const salida = '<!DOCTYPE html>\n<html lang="es"><head><meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
    '<meta name="theme-color" content="#171532">\n</head><body>\n' + cuerpo + '\n</body></html>\n';
  fs.writeFileSync(path.join(RAIZ, "fabrica/index.html"), salida);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], cuerpo);   // copia sin <head> para publicarla en claude.ai
  console.log("fabrica/index.html listo (" + Math.round(salida.length / 1024) + " KB)");
}

function portal(archivo) {
  const d = JSON.parse(fs.readFileSync(archivo, "utf8"));
  const p = PLANTILLAS[d.plantilla];
  if (!p) throw new Error("Plantilla desconocida: " + d.plantilla);
  if (!/^[a-z0-9-]+$/.test(d.slug || "")) throw new Error("slug inválido: " + d.slug);
  const out = path.join(RAIZ, "clientes", d.slug, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, generar(leer(p.ruta), d.config));
  console.log("Escrito " + path.relative(RAIZ, out));
}

if (require.main === module) {
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === "construir") construir();
  else if (cmd === "portal" && arg) portal(arg);
  else console.log("Uso: node fabrica/generar.js construir | portal datos.json");
}
module.exports = { generar, bloque, PLANTILLAS };
