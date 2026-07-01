import type { AddToCartPayloadViewModel } from '../contracts/cart';
import type { ChannelId, ChannelViewModel } from '../contracts/channel';
import type { ImageViewModel } from '../contracts/image';
import type { ProductCardViewModel, ProductDetailViewModel, ProductViewModel } from '../contracts/product';
import { toPriceViewModel, type PricePresenterInput, type PricePresenterOptions } from './pricePresenter';

export interface ProductPresenterInput {
	id: string | number;
	sku?: string | null;
	name: string;
	brand?: string | null;
	category?: string | null;
	description?: string | null;
	stock?: number | string | null;
	href?: string | null;
	image?: ImageViewModel | null;
	images?: ImageViewModel[] | null;
	price: PricePresenterInput;
	channel?: ChannelViewModel | null;
	isActive: boolean;
	badges?: string[] | null;
	discountPercent?: number | null;
}

export interface ProductPresenterOptions {
	channel?: ChannelViewModel;
	productHref?: (product: ProductPresenterInput) => string;
	resolveImage?: (product: ProductPresenterInput) => ImageViewModel;
	resolveImages?: (product: ProductPresenterInput) => ImageViewModel[];
	price?: PricePresenterInput;
	priceOptions?: PricePresenterOptions;
	isActive?: boolean;
	createAddToCartPayload?: (product: ProductPresenterInput, viewModel: ProductViewModel, channel: ChannelId) => AddToCartPayloadViewModel | null;
	relatedProducts?: ProductCardViewModel[];
	fallbacks?: {
		name?: string;
		category?: string;
		description?: string;
		brand?: string;
		stock?: string;
	};
}

const emptyImage: ImageViewModel = {
	src: '',
	alt: '',
	width: null,
	height: null,
	loading: 'lazy',
	isPlaceholder: true,
};

function text(value: unknown, fallback = '') {
	return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function numeric(value: unknown): number | null {
	if (value === null || value === undefined || value === '') return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function resolveChannel(product: ProductPresenterInput, options: ProductPresenterOptions): ChannelViewModel {
	const channel = options.channel ?? product.channel;
	if (!channel) {
		throw new Error('Product presenter requires a resolved channel view model.');
	}
	return channel;
}

function resolveImage(product: ProductPresenterInput, options: ProductPresenterOptions): ImageViewModel {
	return options.resolveImage?.(product) ?? product.image ?? emptyImage;
}

function resolveImages(product: ProductPresenterInput, options: ProductPresenterOptions, image: ImageViewModel): ImageViewModel[] {
	return options.resolveImages?.(product) ?? product.images ?? [image];
}

function resolvePrice(product: ProductPresenterInput, options: ProductPresenterOptions): PricePresenterInput {
	const price = options.price ?? product.price;

	return {
		...price,
		discountPercent: price.discountPercent ?? product.discountPercent ?? null,
	};
}

export function toProductViewModel(product: ProductPresenterInput, options: ProductPresenterOptions = {}): ProductViewModel {
	const channel = resolveChannel(product, options);
	const image = resolveImage(product, options);
	const name = text(product.name, options.fallbacks?.name ?? 'Producto pendiente');
	const category = text(product.category, options.fallbacks?.category ?? 'Otros');
	const description = text(product.description, options.fallbacks?.description ?? name);
	const price = toPriceViewModel(resolvePrice(product, options), {
		channel,
		...options.priceOptions,
	});

	return {
		id: String(product.id),
		sku: product.sku ?? null,
		name,
		brand: text(product.brand, options.fallbacks?.brand) || null,
		category,
		description,
		stock: numeric(product.stock),
		href: product.href ?? options.productHref?.(product) ?? '',
		image,
		images: resolveImages(product, options, image),
		price,
		channel,
		isActive: options.isActive ?? product.isActive,
	};
}

export function toProductCardViewModel(product: ProductPresenterInput, options: ProductPresenterOptions = {}): ProductCardViewModel {
	const base = toProductViewModel(product, options);

	return {
		id: base.id,
		sku: base.sku,
		name: base.name,
		brand: base.brand,
		category: base.category,
		stock: base.stock,
		href: base.href,
		image: base.image,
		price: base.price,
		channel: base.channel,
		badges: product.badges ?? [],
		addToCartPayload: options.createAddToCartPayload?.(product, base, base.channel.id) ?? null,
	};
}

export function toProductDetailViewModel(product: ProductPresenterInput, options: ProductPresenterOptions = {}): ProductDetailViewModel {
	const base = toProductViewModel(product, options);

	return {
		...base,
		longDescription: base.description,
		specs: [
			{ label: 'Marca', value: base.brand ?? (options.fallbacks?.brand ?? 'pendiente') },
			{ label: 'Stock', value: base.stock === null ? (options.fallbacks?.stock ?? 'pendiente') : String(base.stock) },
		],
		relatedProducts: options.relatedProducts ?? [],
		addToCartPayload: options.createAddToCartPayload?.(product, base, base.channel.id) ?? null,
	};
}
