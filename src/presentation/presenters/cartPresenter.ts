import type { CartItemViewModel } from '../contracts/cart';
import type { ChannelViewModel } from '../contracts/channel';
import type { ImageViewModel } from '../contracts/image';
import { toPriceViewModel, type PricePresenterInput, type PricePresenterOptions } from './pricePresenter';

export interface CartItemPresenterInput {
	id: string | number;
	productId?: string | number | null;
	sku?: string | null;
	name: string;
	brand?: string | null;
	category?: string | null;
	quantity: number | string;
	price: PricePresenterInput;
	image?: ImageViewModel | null;
	channel?: ChannelViewModel | null;
}

export interface CartPresenterOptions {
	channel?: ChannelViewModel;
	priceOptions?: PricePresenterOptions;
	resolveImage?: (item: CartItemPresenterInput) => ImageViewModel;
	fallbacks?: {
		name?: string;
		category?: string;
		brand?: string;
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

function numeric(value: unknown, fallback: number | null = null): number | null {
	if (value === null || value === undefined || value === '') return fallback;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function text(value: unknown, fallback = '') {
	return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function resolveChannel(item: CartItemPresenterInput, options: CartPresenterOptions): ChannelViewModel {
	const channel = options.channel ?? item.channel;
	if (!channel) {
		throw new Error('Cart presenter requires a resolved channel view model.');
	}
	return channel;
}

export function toCartItemViewModel(item: CartItemPresenterInput, options: CartPresenterOptions = {}): CartItemViewModel {
	const channel = resolveChannel(item, options);
	const image = options.resolveImage?.(item) ?? item.image ?? emptyImage;

	return {
		id: String(item.id),
		productId: String(item.productId ?? item.id),
		sku: item.sku ?? null,
		name: text(item.name, options.fallbacks?.name ?? 'Producto pendiente'),
		brand: text(item.brand, options.fallbacks?.brand) || null,
		category: text(item.category, options.fallbacks?.category ?? 'Otros'),
		quantity: numeric(item.quantity, 1) ?? 1,
		price: toPriceViewModel(item.price, {
			channel,
			...options.priceOptions,
		}),
		image,
		channel,
	};
}

export function toCartItemViewModels(items: CartItemPresenterInput[], options: CartPresenterOptions = {}): CartItemViewModel[] {
	return items.map((item) => toCartItemViewModel(item, options));
}
