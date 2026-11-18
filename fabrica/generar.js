// Fábrica portalab: arma un portal a partir de una plantilla y sus datos.
//
//   node fabrica/generar.js construir [copia-para-claude.html]
//       Vuelve a armar fabrica/index.html con las plantillas actuales
//       y el simulador público arma/index.html con las plantillas actuales
//       (córrelo cada vez que cambies una plantilla).
//
//   node fabrica/generar.js portal datos.json [carpeta-de-fotos]
//       datos.json = {"plantilla":"negocio","slug":"estetica-lupita","config":{...}}
//       (el config puede venir como texto JSON, tal como lo guarda la fábrica).
//       Las fotos guardadas en la cuenta vienen como "asset:<id>": se buscan en
//       carpeta-de-fotos/<id>.jpg|png|webp y se incrustan en el archivo.
//       Escribe clientes/<slug>/index.html.

const fs = require("fs"), path = require("path"), vm = require("vm");
const RAIZ = path.join(__dirname, "..");

const PLANTILLAS = {
  negocio:  { nombre: "Portal de negocio",  tipo: "negocio",    ruta: "plantillas/negocio/index.html" },
  menu:     { nombre: "Menú digital",       tipo: "negocio",    ruta: "plantillas/menu/index.html" },
  salud:    { nombre: "Ficha médica",       tipo: "personal",   ruta: "plantillas/salud/index.html" },
  mascota:  { nombre: "Placa de mascota",   tipo: "personal",   ruta: "plantillas/mascota/index.html" },
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

  // Simulador público (arma/): solo las plantillas que el visitante puede armar.
  const pub = {};
  for (const id of ["boda", "cuento", "juguetes", "selva", "negocio", "menu"]) {
    const { nombre, tipo, base, html } = datos[id];
    pub[id] = { nombre, tipo, base, html };
  }
  const sim = leer("arma/fuente.html").replace("/*PLANTILLAS*/", () => JSON.stringify(pub).replace(/</g, "\\u003c"));
  fs.writeFileSync(path.join(RAIZ, "arma/index.html"), sim);
  console.log("arma/index.html listo (" + Math.round(sim.length / 1024) + " KB)");
}

function incrustar(o, dir) {
  if (Array.isArray(o)) return o.map(x => incrustar(x, dir));
  if (o && typeof o === "object") { const r = {}; for (const k in o) r[k] = incrustar(o[k], dir); return r; }
  if (typeof o === "string" && o.startsWith("asset:")) {
    const id = o.slice(6), tipos = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
    for (const ext of Object.keys(tipos)) {
      const f = dir && path.join(dir, id + "." + ext);
      if (f && fs.existsSync(f)) return "data:" + tipos[ext] + ";base64," + fs.readFileSync(f).toString("base64");
    }
    throw new Error("Falta la foto " + id + " en " + dir);
  }
  return o;
}

function portal(archivo, fotos) {
  const d = JSON.parse(fs.readFileSync(archivo, "utf8"));
  if (typeof d.config === "string") d.config = JSON.parse(d.config);
  d.config = incrustar(d.config, fotos);
  const p = PLANTILLAS[d.plantilla];
  if (!p) throw new Error("Plantilla desconocida: " + d.plantilla);
  if (!/^[a-z0-9-]+$/.test(d.slug || "")) throw new Error("slug inválido: " + d.slug);
  const out = path.join(RAIZ, "clientes", d.slug, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, generar(leer(p.ruta), d.config));
  console.log("Escrito " + path.relative(RAIZ, out));
}

if (require.main === module) {
  const [cmd, arg, arg2] = process.argv.slice(2);
  if (cmd === "construir") construir();
  else if (cmd === "portal" && arg) portal(arg, arg2);
  else console.log("Uso: node fabrica/generar.js construir | portal datos.json [fotos]");
}
module.exports = { generar, bloque, PLANTILLAS };
