const JSON_HEADERS = {
	'content-type': 'application/json; charset=utf-8',
	'cache-control': 'no-store',
};

function json(data, init = {}) {
	return new Response(JSON.stringify(data), {
		...init,
		headers: { ...JSON_HEADERS, ...(init.headers || {}) },
	});
}

function notFound(message = 'Not found') {
	return json({ ok: false, error: message }, { status: 404 });
}

function productSelect() {
	return `
		SELECT
			p.id,
			p.sku,
			p.name AS nombre,
			p.brand AS marca,
			COALESCE(c.name, 'Otros') AS categoria,
			p.description AS descripcion,
			p.cost_price AS precio_costo,
			p.retail_price AS precio_minorista,
			p.wholesale_price AS precio_mayorista,
			p.stock,
			p.min_wholesale_qty AS cantidad_minima_mayorista,
			p.wholesale_discount AS descuento_mayorista,
			p.active_retail AS activo_minorista,
			p.active_wholesale AS activo_mayorista,
			p.primary_image_key AS r2_key,
			COALESCE(p.primary_image_url, '') AS imagen
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
	`;
}

async function attachImages(env, products) {
	if (!products.length) return products;
	const ids = products.map((product) => product.id);
	const placeholders = ids.map(() => '?').join(',');
	const images = await env.DB.prepare(
		`SELECT product_id, r2_key, image_url FROM product_images WHERE product_id IN (${placeholders}) ORDER BY product_id, sort_order, id`,
	)
		.bind(...ids)
		.all();
	const grouped = new Map();
	for (const image of images.results || []) {
		const list = grouped.get(image.product_id) || [];
		list.push(image.image_url || (image.r2_key ? `/img/products/${image.r2_key.split('/').pop()}` : ''));
		grouped.set(image.product_id, list.filter(Boolean));
	}
	return products.map((product) => ({
		...product,
		activo_minorista: Boolean(product.activo_minorista),
		activo_mayorista: Boolean(product.activo_mayorista),
		imagenes: grouped.get(product.id) || (product.imagen ? [product.imagen] : []),
	}));
}

async function getProducts(request, env) {
	const url = new URL(request.url);
	const mode = url.searchParams.get('mode') === 'mayorista' ? 'mayorista' : 'minorista';
	const category = url.searchParams.get('categoria');
	const search = url.searchParams.get('q');
	const where = [mode === 'mayorista' ? 'p.active_wholesale = 1' : 'p.active_retail = 1'];
	const values = [];

	if (category) {
		where.push('c.name = ?');
		values.push(category);
	}
	if (search) {
		where.push('(LOWER(p.name) LIKE ? OR LOWER(COALESCE(p.brand, "")) LIKE ? OR LOWER(COALESCE(c.name, "")) LIKE ?)');
		const term = `%${search.toLowerCase()}%`;
		values.push(term, term, term);
	}

	const result = await env.DB.prepare(`${productSelect()} WHERE ${where.join(' AND ')} ORDER BY c.name, p.name`)
		.bind(...values)
		.all();
	const products = await attachImages(env, result.results || []);
	return json({ ok: true, source: 'd1', mode, products });
}

async function getProduct(id, env) {
	const row = await env.DB.prepare(`${productSelect()} WHERE p.id = ? LIMIT 1`).bind(id).first();
	if (!row) return notFound('Producto no encontrado');
	const products = await attachImages(env, [row]);
	return json({ ok: true, source: 'd1', product: products[0] });
}

async function getStats(env) {
	const [total, withoutImage, withoutStock, withoutPrice, categories] = await env.DB.batch([
		env.DB.prepare('SELECT COUNT(*) AS value FROM products'),
		env.DB.prepare('SELECT COUNT(*) AS value FROM products WHERE primary_image_key IS NULL OR primary_image_key = ""'),
		env.DB.prepare('SELECT COUNT(*) AS value FROM products WHERE stock IS NULL OR stock <= 0'),
		env.DB.prepare('SELECT COUNT(*) AS value FROM products WHERE retail_price IS NULL AND wholesale_price IS NULL'),
		env.DB.prepare('SELECT COUNT(*) AS value FROM categories'),
	]);
	return json({
		ok: true,
		source: 'd1',
		stats: {
			total: total.results?.[0]?.value || 0,
			withoutImage: withoutImage.results?.[0]?.value || 0,
			withoutStock: withoutStock.results?.[0]?.value || 0,
			withoutPrice: withoutPrice.results?.[0]?.value || 0,
			categories: categories.results?.[0]?.value || 0,
		},
	});
}

async function serveR2(request, env, key) {
	const decodedKey = decodeURIComponent(key).replace(/^\/+/, '');
	if (!decodedKey) return notFound('Imagen no indicada');

	const object = await env.PRODUCT_IMAGES.get(decodedKey);
	if (object) {
		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);
		headers.set('cache-control', 'public, max-age=31536000, immutable');
		return new Response(object.body, { headers });
	}

	if (env.ASSETS && decodedKey.startsWith('assets/')) {
		const assetUrl = new URL(`/${decodedKey}`, request.url);
		return env.ASSETS.fetch(new Request(assetUrl, request));
	}

	return notFound('Imagen no encontrada en R2 local');
}

async function handleApi(request, env) {
	const url = new URL(request.url);
	if (!env.DB) return json({ ok: false, error: 'Binding DB no disponible' }, { status: 500 });
	if (url.pathname === '/api/products') return getProducts(request, env);
	if (url.pathname.startsWith('/api/products/')) return getProduct(decodeURIComponent(url.pathname.replace('/api/products/', '')), env);
	if (url.pathname === '/api/admin/stats') return getStats(env);
	return notFound('Endpoint no encontrado');
}

export default {
	async fetch(request, env) {
		try {
			const url = new URL(request.url);
			if (url.pathname.startsWith('/api/')) return handleApi(request, env);
			if (url.pathname.startsWith('/api/r2/')) return serveR2(request, env, url.pathname.replace('/api/r2/', ''));
			return env.ASSETS.fetch(request);
		} catch (error) {
			return json({ ok: false, error: error.message || 'Error interno' }, { status: 500 });
		}
	},
};
