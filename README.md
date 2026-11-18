# portalab

Página de portalab y demostraciones de invitaciones digitales.

- `index.html`: página principal
- `boda/`, `cuento/`, `juguetes/`, `selva/`: invitaciones de demostración
- `logo.svg`, `icono.svg`: logo

## Dominio

- El sitio vive en **https://portalab.com.mx/** (archivo `CNAME`). Las direcciones viejas de `github.io/Portal-/` redirigen solas al dominio.
- Los portales de Endorfina están en sus propios repositorios y siguen en `github.io`.

## Simulador público

- `arma/`: el visitante arma su invitación o el portal de su negocio, lo ve con marca de agua y lo pide por WhatsApp con «La quiero». No cobra nada en la página.
  - `arma/#invitacion`, `arma/#portal` y `arma/#menu` abren cada pestaña (útil para los anuncios).
  - `index.html` se arma con `node fabrica/generar.js construir`; se edita `fuente.html`.

## Fábrica de portales

- `_config.yml` deja la fábrica fuera del sitio publicado: se usa desde la cuenta de Claude.

- `fabrica/`: el creador. Eliges plantilla, llenas los datos, subes fotos y descargas el `index.html` listo.
  - `fuente.html` es el código de la fábrica; `index.html` se arma solo con `node fabrica/generar.js construir`.
  - Córrelo cada vez que cambies una plantilla para que la fábrica la tome.
- `plantillas/negocio/`: plantilla de portal para negocios (servicios, galería, horario, ubicación, pagos, redes y preguntas).
- `plantillas/menu/`: menú digital con pedidos por WhatsApp. Con `#mesa=5` al final del enlace, el pedido dice de qué mesa viene.
- `plantillas/salud/`: ficha médica para pulsera NFC (sangre, alergias, medicamentos, contactos y botón al 911).
- `plantillas/mascota/`: placa de mascota con botón para avisar al dueño y mandarle la ubicación.
- En **Publicar**, la fábrica también saca el código QR listo para imprimir (uno por mesa en los menús).
- Las invitaciones de `boda/`, `cuento/`, `juguetes/` y `selva/` también son plantillas de la fábrica.
- `clientes/<carpeta>/`: aquí va cada portal entregado. Dirección: `https://portalab.com.mx/clientes/<carpeta>/`
