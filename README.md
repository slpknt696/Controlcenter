# Control Center Astro Storefront

Tienda Astro de Control Center con productos reales, precios minoristas/mayoristas, stock, categorias e imagenes migradas desde la carpeta R2 local.

## Ejecutar local

```bash
npm install
npm run build
npm run dev -- --host 127.0.0.1 --port 4321
```

URL local:

```text
http://127.0.0.1:4321/
```

Catalogos:

```text
http://127.0.0.1:4321/minorista
http://127.0.0.1:4321/mayorista
http://127.0.0.1:4321/catalogo
```

API local:

```text
http://127.0.0.1:4321/api/products
```

## Datos reales

- Productos: `src/data/controlcenter-products.json`
- Compatibilidad template: `src/data/products.json` y `src/data/products.mock.json`
- Imagenes publicas: `public/img/products/`
- Placeholders: `public/assets/placeholders/`
- SQL D1 local: `controlcenter-migration/d1/database.sql`
- Reporte final: `migration-report.json`

## Comandos utiles

```bash
npm run finalize:real-store
npm run db:import
```

No se realiza deploy ni escritura remota en Cloudflare. El carrito usa `localStorage` y el formulario de contacto queda preparado para integrarse despues con un backend.
