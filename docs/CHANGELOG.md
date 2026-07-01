# Changelog

## 2026-06 - Fase 3.4-A2/A3/A4 cierre tecnico

### Documentado

- Se documenta ADR-004 para contratos static de catalogo storefront v1.
- Se formaliza que Astro es storefront static v1 de Control Center y no el nucleo del Commerce Engine.
- Se documentan como contratos oficiales temporales:
  - `/api/products/minorista.json`
  - `/api/products/mayorista.json`
- Se documenta `/api/products` como legacy temporal.
- Se agrega checklist de higiene para DevOps preview y deploy.

### Validado

- Baseline historica: `41554ff baseline: official consolidated Control Center storefront v1`.
- Commit local validado: `9a8e273 merge: integrate A3 static catalog contract hygiene`.
- `npm ci` OK.
- `npx tsc --noEmit` OK.
- `npm run build` OK.
- Smoke visual/runtime minimo A4 OK con observacion menor.

### Restricciones vigentes

- Deploy comercial no autorizado.
- D1/R2 no autorizados.
- Mayorista static no tiene auth real y no debe comunicarse como portal seguro o privado.
- `public/r2/`, `r2/`, `.wrangler/` y `template_reference/` no deben contaminar Git ni builds de deploy.
