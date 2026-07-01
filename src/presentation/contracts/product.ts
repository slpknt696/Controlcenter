import type { AddToCartPayloadViewModel } from './cart';
import type { ChannelViewModel } from './channel';
import type { ImageViewModel } from './image';
import type { PriceViewModel } from './price';

export interface ProductViewModel {
	id: string;
	sku: string | null;
	name: string;
	brand: string | null;
	category: string;
	description: string;
	stock: number | null;
	href: string;
	image: ImageViewModel;
	images: ImageViewModel[];
	price: PriceViewModel;
	channel: ChannelViewModel;
	isActive: boolean;
}

export interface ProductCardViewModel {
	id: string;
	sku: string | null;
	name: string;
	brand: string | null;
	category: string;
	stock: number | null;
	href: string;
	image: ImageViewModel;
	price: PriceViewModel;
	channel: ChannelViewModel;
	badges: string[];
	addToCartPayload: AddToCartPayloadViewModel | null;
}

export interface ProductDetailViewModel extends ProductViewModel {
	longDescription: string;
	specs: Array<{
		label: string;
		value: string;
	}>;
	relatedProducts: ProductCardViewModel[];
	addToCartPayload: AddToCartPayloadViewModel | null;
}
