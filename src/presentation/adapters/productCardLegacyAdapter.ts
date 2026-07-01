import type { AddToCartPayloadViewModel } from '../contracts/cart';
import type { ChannelViewModel } from '../contracts/channel';
import type { ImageViewModel } from '../contracts/image';
import type { PriceViewModel } from '../contracts/price';
import type { ProductCardViewModel } from '../contracts/product';

export type LegacyProductCardMode = 'minorista' | 'mayorista';

export interface LegacyProductCardInput {
	id: string | number;
	sku?: string | null;
	nombre?: string | null;
	name?: string | null;
	marca?: string | null;
	brand?: string | null;
	categoria?: string | null;
	category?: string | null;
	stock?: number | string | null;
	[key: string]: unknown;
}

export interface LegacyCartPayload {
	id: string;
	productId?: string | number | null;
	sku?: string | null;
	nombre?: string | null;
	marca?: string | null;
	categoria?: string | null;
	precio?: number | null;
	imagen?: string | null;
	mode?: LegacyProductCardMode;
	[key: string]: unknown;
}

export interface ProductCardLegacyViewModel extends ProductCardViewModel {
	legacy: {
		mode: LegacyProductCardMode;
		cartPayload: LegacyCartPayload;
		dataName: string;
		dataCategory: string;
	};
}

export interface ProductCardLegacyAdapterDependencies {
	productPrice: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => number | null;
	formatMoney: (value: number | null) => string;
	productImage: (product: LegacyProductCardInput) => string;
	asCartProduct: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => LegacyCartPayload;
	sitePath: (path: string) => string;
	resolveBadges?: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => string[];
	resolveDiscountPercent?: (product: LegacyProductCardInput, mode: LegacyProductCardMode) => number | null;
	isPlaceholderImage?: (src: string, product: LegacyProductCardInput) => boolean;
	currency?: string;
}

function text(value: unknown, fallback = '') {
	return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function numeric(value: unknown): number | null {
	if (value === null || value === undefined || value === '') return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function channelForMode(mode: LegacyProductCardMode): ChannelViewModel {
	const isWholesale = mode === 'mayorista';

	return {
		id: isWholesale ? 'wholesale' : 'retail',
		label: isWholesale ? 'Mayorista' : 'Minorista',
		isWholesale,
	};
}

function toImageViewModel(product: LegacyProductCardInput, src: string, isPlaceholder: boolean): ImageViewModel {
	const name = text(product.nombre ?? product.name, 'Producto pendiente');

	return {
		src,
		alt: name,
		width: 290,
		height: 290,
		loading: 'lazy',
		isPlaceholder,
	};
}

function toLegacyDataName(product: LegacyProductCardInput) {
	return `${product.nombre} ${product.marca} ${product.categoria}`.toLowerCase();
}

export function toProductCardViewModelFromLegacy(
	product: LegacyProductCardInput,
	mode: LegacyProductCardMode,
	dependencies: ProductCardLegacyAdapterDependencies,
): ProductCardLegacyViewModel {
	const channel = channelForMode(mode);
	const amount = dependencies.productPrice(product, mode);
	const imageSrc = dependencies.productImage(product);
	const image = toImageViewModel(product, imageSrc, dependencies.isPlaceholderImage?.(imageSrc, product) ?? false);
	const name = text(product.nombre ?? product.name, 'Producto pendiente');
	const brand = text(product.marca ?? product.brand) || null;
	const category = text(product.categoria ?? product.category, 'Otros');
	const price: PriceViewModel = {
		amount,
		formatted: dependencies.formatMoney(amount),
		currency: dependencies.currency ?? 'ARS',
		label: channel.label,
		isPending: amount === null,
		channel,
		discountPercent: dependencies.resolveDiscountPercent?.(product, mode) ?? null,
	};
	const legacyCartPayload = dependencies.asCartProduct(product, mode);
	const addToCartPayload: AddToCartPayloadViewModel = {
		id: String(legacyCartPayload.id),
		productId: String(legacyCartPayload.productId ?? product.id),
		sku: product.sku ?? null,
		name,
		brand,
		category,
		price,
		image,
		channel,
	};

	return {
		id: String(product.id),
		sku: product.sku ?? null,
		name,
		brand,
		category,
		stock: numeric(product.stock),
		href: dependencies.sitePath(`/producto/${product.id}`),
		image,
		price,
		channel,
		badges: dependencies.resolveBadges?.(product, mode) ?? [],
		addToCartPayload,
		legacy: {
			mode,
			cartPayload: legacyCartPayload,
			dataName: toLegacyDataName(product),
			dataCategory: text(product.categoria, ''),
		},
	};
}
