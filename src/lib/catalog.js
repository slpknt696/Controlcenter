import controlCenterProducts from '../data/controlcenter-products.json';
import { assetUrl } from './asset-base.js';

function toCatalogProduct(product) {
  return {
    ...product,
    nombre: product.name,
    marca: product.brand,
    categoria: product.category,
    descripcion: product.description || product.name,
    precio_costo: product.costPrice,
    precio_minorista: product.retailPrice,
    precio_mayorista: product.wholesalePrice,
    cantidad_minima_mayorista: null,
    descuento_mayorista: product.retailPrice && product.wholesalePrice
      ? Math.max(0, Math.round((1 - product.wholesalePrice / product.retailPrice) * 100))
      : null,
    imagen: product.imageUrl,
    imagenes: product.imageUrl ? [product.imageUrl] : [],
    r2_key: product.imageKey,
    activo_minorista: Boolean(product.active),
    activo_mayorista: Boolean(product.active),
  };
}

export const allProducts = controlCenterProducts.map(toCatalogProduct);

export function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'pendiente';
  return '$' + new Intl.NumberFormat('es-AR').format(Math.round(Number(value)));
}

export function slug(value) {
  return String(value || 'otros')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'otros';
}

export function categories() {
  return [...new Set(allProducts.map((product) => product.categoria || 'Otros'))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export function productPrice(product, mode = 'minorista') {
  return mode === 'mayorista'
    ? product.precio_mayorista ?? product.precio_minorista
    : product.precio_minorista;
}

export function productsForMode(mode = 'minorista') {
  return allProducts.filter((product) =>
    mode === 'mayorista' ? product.activo_mayorista : product.activo_minorista,
  );
}

function toPublicProduct(product, mode = 'minorista') {
  const publicProduct = {
    id: product.id,
    sku: product.sku,
    nombre: product.nombre,
    marca: product.marca,
    categoria: product.categoria,
    descripcion: product.descripcion,
    stock: product.stock,
    imagen: productImage(product),
    imagenes: product.imagenes?.length ? product.imagenes : [productImage(product)],
  };

  if (mode === 'mayorista') {
    return {
      ...publicProduct,
      precio_mayorista: product.precio_mayorista,
      precio_minorista: product.precio_minorista,
      descuento_mayorista: product.descuento_mayorista,
    };
  }

  return {
    ...publicProduct,
    precio_minorista: product.precio_minorista,
  };
}

export function publicProductsForMode(mode = 'minorista') {
  return productsForMode(mode).map((product) => toPublicProduct(product, mode));
}

export function productsByCategory(category, mode = 'minorista') {
  return productsForMode(mode).filter((product) => product.categoria === category);
}

export function featuredProducts(limit = 8, mode = 'minorista') {
  return productsForMode(mode).slice(0, limit);
}

export function findProduct(id) {
  return allProducts.find((product) => product.id === id);
}

export function productImage(product) {
  if (product.imageUrl) return assetUrl(product.imageUrl);
  if (product.imageKey) return assetUrl(`/img/products/${String(product.imageKey).split('/').pop()}`);
  if (product.image_url) return assetUrl(product.image_url);
  if (product.imagen) return assetUrl(product.imagen);
  if (product.r2_key) return assetUrl(`/img/products/${String(product.r2_key).split('/').pop()}`);
  if (product.primary_image_key) return assetUrl(`/img/products/${String(product.primary_image_key).split('/').pop()}`);
  return placeholderForCategory(product.categoria);
}

export function placeholderForCategory(category) {
  const key = slug(category);
  const known = {
    'power-bank': 'power-bank',
    'herramientas-e-insumos': 'herramientas-e-insumos',
    'vidrios-y-templados': 'vidrios-y-templados',
  };
  return assetUrl(`/assets/placeholders/${known[key] || key || 'otros'}.svg`);
}

export function catalogStats() {
  const withoutImage = allProducts.filter((product) => !product.imagen || product.imagen.includes('/placeholders/'));
  const withoutStock = allProducts.filter((product) => product.stock === null || Number(product.stock) <= 0);
  const withoutPrice = allProducts.filter((product) => !product.precio_minorista && !product.precio_mayorista);
  return {
    total: allProducts.length,
    withoutImage: withoutImage.length,
    withoutStock: withoutStock.length,
    withoutPrice: withoutPrice.length,
  };
}

export function asCartProduct(product, mode = 'minorista') {
  return {
    id: `${product.id}:${mode}`,
    productId: product.id,
    sku: product.sku,
    nombre: product.nombre,
    marca: product.marca,
    categoria: product.categoria,
    precio: productPrice(product, mode),
    imagen: productImage(product),
    mode,
  };
}

export function categoryCards() {
  return categories().map((category) => {
    const first = productsByCategory(category)[0];
    return {
      name: category,
      slug: slug(category),
      imageUrl: first ? productImage(first) : placeholderForCategory(category),
      count: productsByCategory(category).length,
    };
  });
}
