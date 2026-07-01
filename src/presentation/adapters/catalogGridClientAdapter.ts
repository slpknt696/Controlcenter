import type { LegacyCartPayload, LegacyProductCardInput, LegacyProductCardMode } from './productCardLegacyAdapter';

export interface CatalogGridClientAdapterDependencies {
	withBase: (path: string) => string;
	resolveProductImage: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => string;
	resolveProductPrice: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => number | null | undefined;
	formatPriceLabel: (value: number | null | undefined) => string;
	calculateLegacyDiscountPercent: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => number;
	buildLegacyCartPayload: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => LegacyCartPayload;
}

export interface CatalogGridClientProductCardViewModel {
	href: string;
	imageSrc: string;
	priceLabel: string;
	discountPercent: number;
	cartPayload: LegacyCartPayload;
	dataName: string;
	dataCategory: string;
	name: string | null | undefined;
	brand: string;
	stock: number | string;
	category: string | null | undefined;
}

export function toCatalogGridClientProductCardViewModel(
	product: LegacyProductCardInput,
	mode: LegacyProductCardMode,
	dependencies: CatalogGridClientAdapterDependencies,
): CatalogGridClientProductCardViewModel {
	const price = dependencies.resolveProductPrice(product, mode);

	return {
		href: dependencies.withBase(`/producto/${encodeURIComponent(product.id)}`),
		imageSrc: dependencies.resolveProductImage(product, mode),
		priceLabel: dependencies.formatPriceLabel(price),
		discountPercent: dependencies.calculateLegacyDiscountPercent(product, mode),
		cartPayload: dependencies.buildLegacyCartPayload(product, mode),
		dataName: `${product.nombre} ${product.marca || ''} ${product.categoria || ''}`.toLowerCase(),
		dataCategory: product.categoria || '',
		name: product.nombre,
		brand: product.marca || 'Marca pendiente',
		stock: product.stock ?? 'pendiente',
		category: product.categoria,
	};
}
