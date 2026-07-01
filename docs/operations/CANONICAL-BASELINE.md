# Canonical Baseline — Control Center Storefront v1

## Estado

Este documento registra la base canónica limpia del storefront Astro static v1 de Control Center.

## Decisión CTO

La base canónica futura de trabajo para el storefront es:

```text
baseline/clean-storefront-v1
```

Commit base validado:

```text
6fcd508 snapshot: restore css build config for preview
```

Esta rama reemplaza al repo histórico local como línea activa de trabajo.

## Fuente remota

Repositorio:

```text
https://github.com/slpknt696/Controlcenter.git
```

Rama canónica:

```text
baseline/clean-storefront-v1
```

## Workspace canónico local

El workspace operativo aprobado es:

```text
C:\Users\slpkn\Desktop\Proyecto consolidado\control-center-astro-storefront-canonical
```

## Repo histórico local

El repo histórico local:

```text
C:\Users\slpkn\Desktop\Proyecto consolidado\control-center-astro-storefront
```

queda clasificado como archivo técnico histórico local protegido.

No debe usarse para:

* desarrollo activo;
* push remoto;
* deploy;
* nuevas ramas;
* merge hacia rama limpia;
* uso con agentes IA;
* copia directa de carpetas completas.

## Snapshot previo

El snapshot previo:

```text
C:\Users\slpkn\Desktop\Proyecto consolidado\control-center-astro-storefront-clean-preview
```

queda como referencia de preview validado, no como workspace activo principal.

## Preview técnico

El preview técnico Cloudflare Pages fue aprobado con observaciones menores.

URL:

```text
https://controlcenter-storefront-preview.pages.dev/
```

Rama de preview:

```text
preview/clean-storefront-v1-6fcd508
```

Commit:

```text
6fcd508
```

## Reglas para nuevas ramas

Toda nueva rama de trabajo debe nacer desde:

```text
origin/baseline/clean-storefront-v1
```

No se debe trabajar desde:

```text
main
preview/clean-storefront-v1-6fcd508
repo histórico contaminado
```

## Estado de main

La rama `main` no es canónica por ahora.

Queda bloqueado:

* push a `main`;
* merge a `main`;
* rebase de `main`;
* reset de `main`;
* cambio de default branch;
* uso de `main` para Cloudflare;
* uso de `main` para producción.

## Contratos públicos vigentes

Contratos oficiales temporales:

```text
/api/products/minorista.json
/api/products/mayorista.json
```

Contrato legacy temporal:

```text
/api/products
```

Reglas:

* nuevas integraciones no deben depender de `/api/products`;
* minorista no debe exponer `precio_mayorista`;
* mayorista sigue siendo `public-static-no-auth`;
* mayorista no debe presentarse como portal privado seguro.

## Restricciones vigentes

Sigue bloqueado:

* producción comercial;
* custom domain;
* Cloudflare config;
* Wrangler deploy;
* Direct Upload;
* Workers;
* Pages Functions;
* D1;
* R2;
* KV;
* tags/releases;
* auth real;
* admin;
* POS;
* checkout real;
* pagos;
* migración de catálogo a D1/R2.

## Archivos excluidos

No reincorporar automáticamente:

```text
data/
scripts/
migrations/
controlcenter-migration/
*.bat
migration-report.json
.vscode/
LICENSE
README_FINAL.md
biome.jsonc
prettier.config.js
```

## Regla de ejecución

Codex sigue siendo el único ejecutor autorizado sobre el repo.

Otras IAs solo pueden producir análisis externo no vinculante y no pueden modificar archivos, ejecutar comandos, usar Git ni tocar Cloudflare.

## Veredicto

```text
baseline/clean-storefront-v1 @ 6fcd508 es la base canónica limpia futura del storefront Control Center.

Producción sigue bloqueada.
Cloudflare sigue sin cambios.
main sigue bloqueada.
```
