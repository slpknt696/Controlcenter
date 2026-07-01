import type { ChannelViewModel } from './channel';

export interface PriceViewModel {
	amount: number | null;
	formatted: string;
	currency: string;
	label: string;
	isPending: boolean;
	channel?: ChannelViewModel;
	compareAtAmount?: number | null;
	compareAtFormatted?: string | null;
	discountPercent?: number | null;
}
