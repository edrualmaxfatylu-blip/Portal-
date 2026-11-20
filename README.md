# portalab

Página de portalab, demostraciones, simulador público y portales de clientes.
Todo se publica en **https://portalab.com.mx/** con GitHub Pages.

- `index.html`: página principal
- `boda/`, `cuento/`, `juguetes/`, `selva/`: invitaciones de demostración
- `navidad/`: tarjeta navideña o invitación de posada (`modo:"tarjeta"` o `"posada"`). Promoción de temporada: desde $80, impresa con QR y NFC $150 más con envío.
- `logo.svg`, `icono.svg`, `apple-touch-icon.png`: logo e ícono
- `og.png`, `arma/og.png`: imágenes que salen al compartir el enlace en WhatsApp o Facebook
- `404.html`: página para enlaces que no existen
- `robots.txt`, `sitemap.xml`: para que Google encuentre las páginas

## Dominio

- El dominio está en Akky y sus DNS en Cloudflare (plan gratis): 4 registros A `@` a GitHub
  (185.199.108.153, .109.153, .110.153, .111.153) y un CNAME `www` a `edrualmaxfatylu-blip.github.io`,
  todos con la nube gris («DNS only»). HTTPS forzado en Settings → Pages.
- El archivo `CNAME` le dice a GitHub que el sitio es `portalab.com.mx`. No lo borres.
- Las direcciones viejas de `github.io/Portal-/` redirigen solas al dominio.

## Portales de clientes

- `endorfina/`: Endorfina espresso. Antes en el repositorio `Endorfinas-cafe`.
- `casa-maestra/`: Endorfina Casa Maestra. Antes en `endorfina-casa-maestra`. Le faltan horario, WhatsApp y menú.
- `fotografo/`: portal de Edgar Ruiz, fotógrafo, en blanco y negro (portafolio, servicios a cotizar, menú, tarjeta con QR y NFC).
  También sirve de muestra en los anuncios para fotógrafos. Todo se edita en `CONFIG`; las fotos van en `fotografo/fotos/` en WebP.
  El QR se genera dentro de la página (sin librerías) con la dirección de `CONFIG.url`.
- `el-cerdito/`: Carnitas El Cerdito. Antes en el repositorio `index.html`. Sus datos van en `NEGOCIO`
  al final del archivo; lo que está vacío no se muestra.
- Los repositorios viejos ya solo redirigen a estas direcciones y conservan el número de mesa (`#mesa-5`),
  así que los NFC y QR que ya se entregaron siguen funcionando.

## Simulador público

- `arma/`: el visitante arma su invitación o el portal de su negocio, lo ve con marca de agua y lo pide por WhatsApp con «La quiero». No cobra nada en la página.
  - `arma/#invitacion`, `arma/#portal` y `arma/#menu` abren cada pestaña (útil para los anuncios).
  - `arma/` (sin nada) y `arma/#navidad` abren el botón «Tarjetas navideñas interactivas» con el precio desde $80; `arma/#boda`, `#cuento`, `#juguetes` y `#selva` abren ese diseño.
  - La promoción de Navidad sale en la portada (`index.html`, bloque «Promoción de temporada») y en el texto de `arma/`; quítala en enero.
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
- Las invitaciones de `boda/`, `cuento/`, `juguetes/`, `selva/` y `navidad/` también son plantillas de la fábrica.
- En modo demostración (`demo:true`), los botones de WhatsApp con el número de muestra 55 0000 0000
  llevan al WhatsApp de portalab (52 55 3349 7852). Al entregar, desmarca «Demostración» en la fábrica.
- `clientes/<carpeta>/`: aquí va cada portal entregado. Dirección: `https://portalab.com.mx/clientes/<carpeta>/`

## Si cambias el número de WhatsApp de portalab

Está en `index.html` (`whatsapp`), `arma/fuente.html` (`WHATSAPP`), `404.html` y al final de cada plantilla
(bloque «Demostración»). Después corre `node fabrica/generar.js construir`.
