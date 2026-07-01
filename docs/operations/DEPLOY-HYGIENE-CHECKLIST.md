# Deploy Hygiene Checklist - Storefront Astro static v1

Esta checklist aplica antes de cualquier DevOps preview del storefront Astro static v1 de Control Center.

## Identidad de rama y baseline

- [ ] Confirmar rama autorizada para la fase en curso.
- [ ] Confirmar que la baseline oficial relevante es `baseline/official-storefront-v1`.
- [ ] Confirmar commit base o merge local esperado antes de operar.
- [ ] Ejecutar `git status --short --branch` antes y despues de la validacion.

## Higiene Git

- [ ] No usar `git add .`.
- [ ] No incluir archivos fuera del alcance aprobado.
- [ ] No crear tags sin autorizacion CTO.
- [ ] No hacer push sin autorizacion CTO.
- [ ] No hacer deploy desde ramas no aprobadas.
- [ ] Reportar cualquier archivo no trackeado o modificado inesperado.

## Carpetas y artefactos que no deben contaminar deploy

- [ ] `.wrangler/` no debe entrar a Git.
- [ ] `r2/` no debe entrar a Git.
- [ ] `public/r2/` no debe entrar a Git ni al paquete de deploy comercial sin decision explicita.
- [ ] `template_reference/` no debe entrar a Git.
- [ ] Validar que no aparezcan artefactos pesados o locales inesperados.

## Validaciones tecnicas minimas

- [ ] `npm ci` OK.
- [ ] `npx tsc --noEmit` OK.
- [ ] `npm run build` OK.
- [ ] Confirmar salida static.
- [ ] Confirmar generacion de rutas principales.
- [ ] Confirmar generacion de endpoints publicos de catalogo.

## Contratos public-static de catalogo

- [ ] `dist/api/products/minorista.json` existe.
- [ ] `dist/api/products/mayorista.json` existe.
- [ ] `minorista.json` no contiene `precio_mayorista`.
- [ ] `minorista.json` no contiene `precio_costo`, `costo`, `raw`, `flags` ni `keys`.
- [ ] `mayorista.json` no contiene `precio_costo`, `costo`, `raw`, `flags` ni `keys`.
- [ ] `/api/products` queda documentado como legacy temporal.

## Smoke runtime minimo

- [ ] Levantar preview local solo si la fase lo autoriza.
- [ ] Revisar `/`.
- [ ] Revisar `/catalogo`.
- [ ] Revisar `/minorista`.
- [ ] Revisar `/mayorista`.
- [ ] Revisar una pagina real de producto.
- [ ] Revisar `/carrito`.
- [ ] Revisar `/contacto`.
- [ ] Revisar endpoints JSON por HTTP o archivo generado.
- [ ] Verificar ausencia de `undefined`, `NaN`, precio vacio o error visual nuevo.
- [ ] Verificar ausencia de errores de consola relevantes.

## Comunicacion y seguridad

- [ ] Comunicar Astro como storefront static v1, no como nucleo del Commerce Engine.
- [ ] No comunicar mayorista static como portal privado, seguro o autenticado.
- [ ] No anunciar D1/R2 como activos si no fueron autorizados.
- [ ] No anunciar deploy comercial si no fue autorizado.

## Condiciones de detencion

Detenerse y reportar si ocurre cualquiera de estos casos:

- Git no esta limpio antes de iniciar una fase que lo exige.
- Aparecen archivos fuera del alcance autorizado.
- TypeScript falla.
- Build falla.
- El preview no levanta.
- Aparecen campos internos/costo en endpoints publicos.
- Se requiere tocar UI, catalogo fuente, configuracion, assets, D1/R2 o arquitectura.
