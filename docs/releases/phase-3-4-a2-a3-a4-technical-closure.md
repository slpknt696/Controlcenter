# Cierre tecnico Fase 3.4-A2/A3/A4

## Alcance

Este documento cierra tecnicamente las fases A2, A3 y A4 del storefront static v1 de Control Center antes de abrir una etapa DevOps preview.

El alcance fue auditoria, higiene minima de contratos publicos y smoke test runtime. No se autorizo deploy comercial, migracion D1/R2, auth, pagos, POS, SaaS, multiempresa, admin avanzado, redisenos ni cambios de branding.

## Estado base

- Rama oficial: `baseline/official-storefront-v1`
- Baseline historica: `41554ff baseline: official consolidated Control Center storefront v1`
- Commit local validado: `9a8e273 merge: integrate A3 static catalog contract hygiene`

## Fase 3.4-A2 - Auditoria

Resultado: aprobada con observaciones.

Se verifico que el proyecto instala, tipa y construye correctamente como salida static. Se revisaron rutas principales y endpoints generados:

- `/api/products/minorista.json`
- `/api/products/mayorista.json`
- `/api/products`

Hallazgos principales:

- `/api/products` debia quedar como legacy temporal.
- El canal mayorista static no representa seguridad real.
- Las carpetas locales o ignoradas vinculadas a R2/Wrangler no debian contaminar Git ni deploys.

## Fase 3.4-A3 - Higiene de contratos

Resultado: aplicada, commiteada y mergeada localmente.

Se limpio la proyeccion publica por canal para evitar exponer el objeto completo del catalogo fuente.

Decisiones implementadas:

- `minorista.json` no expone `precio_mayorista`.
- `mayorista.json` expone solo campos necesarios para el canal mayorista static.
- `/api/products` queda identificado como `legacy-temporary`.
- No se toco UI, branding, catalogo fuente, dependencias, assets, D1/R2 ni configuracion.

## Fase 3.4-A4 - Smoke visual/runtime

Resultado: aprobado con observacion menor.

Validaciones ejecutadas:

- `npm ci`: OK, sin vulnerabilidades reportadas.
- `npx tsc --noEmit`: OK.
- `npm run build`: OK, `1541 page(s) built`.
- `npm run preview`: OK con Wrangler local en `127.0.0.1:8787`.

Rutas revisadas:

- `/`
- `/catalogo`
- `/minorista`
- `/mayorista`
- `/producto/cabezal-iph-certificado-tipo-c-20w-94/`
- `/carrito`
- `/contacto`
- `/api/products/minorista.json`
- `/api/products/mayorista.json`
- `/api/products`

Resultado runtime:

- Las paginas HTML cargaron sin errores de consola detectados.
- `/minorista` mostro productos y precios minoristas.
- `/mayorista` mostro productos y precios mayoristas/comparacion.
- No se detecto `undefined`, `NaN`, precio vacio ni error visual nuevo.
- No se detectaron imagenes rotas nuevas en el smoke.
- La pagina de producto real cargo correctamente.
- Carrito y contacto cargaron sin error.

Observacion menor:

El navegador interno bloqueo navegacion directa a endpoints `.json` con `ERR_BLOCKED_BY_CLIENT`; se valido por HTTP local y archivos `dist` con resultado correcto.

## Contratos confirmados

`/api/products/minorista.json`:

- Existe en build static.
- `contract=public-static`.
- `products=1530`.
- No contiene `precio_mayorista`.
- No contiene campos internos/costo `precio_costo`, `costo`, `raw`, `flags` ni `keys`.

`/api/products/mayorista.json`:

- Existe en build static.
- `contract=public-static`.
- `products=1530`.
- No contiene campos internos/costo `precio_costo`, `costo`, `raw`, `flags` ni `keys`.
- No tiene auth real y no debe comunicarse como portal seguro o privado.

`/api/products`:

- Responde como legacy temporal.
- `legacy=true`.
- `contract=legacy-temporary`.

## Riesgos remanentes

- Mayorista static es publico; cualquier promesa de privacidad o seguridad seria incorrecta.
- D1/R2 no estan autorizados para esta etapa y no deben activarse por deploy incidental.
- `public/r2/`, `r2/`, `.wrangler/` y `template_reference/` deben seguir excluidos de Git y del paquete de deploy.
- El deploy comercial sigue pendiente de autorizacion explicita.

## Recomendacion

Aprobar cierre tecnico A2/A3/A4 con observaciones y habilitar preparacion de DevOps preview en una fase separada, sin deploy comercial automatico.
