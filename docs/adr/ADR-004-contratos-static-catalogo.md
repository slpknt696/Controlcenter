# ADR-004 - Contratos static de catalogo storefront v1

## Estado

Aceptado para storefront static v1 de Control Center.

## Contexto

La rama `baseline/official-storefront-v1` consolida el storefront Astro de Control Center como una salida static validada. La baseline historica es `41554ff baseline: official consolidated Control Center storefront v1`.

Las fases A2, A3 y A4 revisaron el catalogo static, sus endpoints generados y el smoke test visual/runtime minimo posterior al merge local `9a8e273 merge: integrate A3 static catalog contract hygiene`.

## Decision

Astro se mantiene como storefront static v1 de Control Center.

Astro no es el nucleo del Commerce Engine. No contiene ni debe asumir responsabilidades de core transaccional, POS, pagos, SaaS, multiempresa, auth, admin avanzado, D1/R2 productivo ni gobierno de datos.

Los contratos oficiales temporales del catalogo public-static son:

- `/api/products/minorista.json`
- `/api/products/mayorista.json`

`/api/products` queda como legacy temporal para compatibilidad y no debe promoverse como contrato oficial nuevo.

## Reglas de contrato

`/api/products/minorista.json` no debe exponer `precio_mayorista`.

`/api/products/mayorista.json` puede exponer campos necesarios del canal mayorista, pero sigue siendo `public-static`. No tiene auth real y no debe comunicarse como portal seguro, privado o restringido.

Los endpoints publicos no deben exponer campos internos o de costo como `precio_costo`, `costo`, `raw`, `flags` o `keys`.

## Restricciones vigentes

D1/R2 siguen no autorizados para esta etapa.

El deploy comercial sigue no autorizado.

`public/r2/`, `r2/`, `.wrangler/` y `template_reference/` no deben contaminar commits ni builds de deploy.

No se autoriza redisenar UI, cambiar branding ni ampliar arquitectura desde esta ADR.

## Consecuencias

El storefront puede seguir validandose como salida static con contratos JSON publicos y temporales.

Cualquier cambio futuro sobre seguridad mayorista, origen de datos, persistencia, deploy comercial o migracion D1/R2 requiere una fase separada y aprobacion explicita.

La comunicacion funcional debe aclarar que mayorista static es una vista publica de catalogo y no un portal autenticado.

## Evidencia relacionada

- Baseline historica: `41554ff baseline: official consolidated Control Center storefront v1`
- Merge local validado: `9a8e273 merge: integrate A3 static catalog contract hygiene`
- Fase A2: auditoria real de build y contratos static.
- Fase A3: limpieza minima de contratos publicos de catalogo.
- Fase A4: smoke test visual/runtime minimo sobre preview local.
