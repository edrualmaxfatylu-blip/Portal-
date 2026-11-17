# portalab

Página de portalab y demostraciones de invitaciones digitales.

- `index.html`: página principal
- `boda/`, `cuento/`, `juguetes/`, `selva/`: invitaciones de demostración
- `logo.svg`, `icono.svg`: logo

## Fábrica de portales

- `fabrica/`: el creador. Eliges plantilla, llenas los datos, subes fotos y descargas el `index.html` listo.
  - `fuente.html` es el código de la fábrica; `index.html` se arma solo con `node fabrica/generar.js construir`.
  - Córrelo cada vez que cambies una plantilla para que la fábrica la tome.
- `plantillas/negocio/`: plantilla de portal para negocios (servicios, galería, horario, ubicación, pagos, redes y preguntas).
- Las invitaciones de `boda/`, `cuento/`, `juguetes/` y `selva/` también son plantillas de la fábrica.
- `clientes/<carpeta>/`: aquí va cada portal entregado. Dirección: `https://edrualmaxfatylu-blip.github.io/Portal-/clientes/<carpeta>/`
