import { publicProductsForMode } from '../../../lib/catalog.js';

const mode = 'minorista';
const products = publicProductsForMode(mode);

export function GET() {
	return new Response(
		JSON.stringify({
			ok: true,
			source: 'controlcenter-products.json',
			mode,
			contract: 'public-static',
			count: products.length,
			products,
		}),
		{
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': 'no-store',
			},
		},
	);
}
