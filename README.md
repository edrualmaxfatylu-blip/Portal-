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
- `plantillas/menu/`: menú digital con pedidos por WhatsApp. Con `#mesa=5` al final del enlace, el pedido dice de qué mesa viene.
- `plantillas/salud/`: ficha médica para pulsera NFC (sangre, alergias, medicamentos, contactos y botón al 911).
- `plantillas/mascota/`: placa de mascota con botón para avisar al dueño y mandarle la ubicación.
- En **Publicar**, la fábrica también saca el código QR listo para imprimir (uno por mesa en los menús).
- Las invitaciones de `boda/`, `cuento/`, `juguetes/` y `selva/` también son plantillas de la fábrica.
- `clientes/<carpeta>/`: aquí va cada portal entregado. Dirección: `https://edrualmaxfatylu-blip.github.io/Portal-/clientes/<carpeta>/`
