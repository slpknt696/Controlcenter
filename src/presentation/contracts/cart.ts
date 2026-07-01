import type { ChannelViewModel } from './channel';
import type { ImageViewModel } from './image';
import type { PriceViewModel } from './price';

export interface CartItemViewModel {
	id: string;
	productId: string;
	sku: string | null;
	name: string;
	brand: string | null;
	category: string;
	quantity: number;
	price: PriceViewModel;
	image: ImageViewModel;
	channel: ChannelViewModel;
}

export interface AddToCartPayloadViewModel {
	id: string;
	productId: string;
	sku: string | null;
	name: string;
	brand: string | null;
	category: string;
	price: PriceViewModel;
	image: ImageViewModel;
	channel: ChannelViewModel;
}
