import type { ChannelViewModel } from '../contracts/channel';
import type { PriceViewModel } from '../contracts/price';

export interface PricePresenterInput {
	amount: number | null;
	formatted?: string | null;
	currency?: string | null;
	label?: string | null;
	isPending?: boolean | null;
	channel?: ChannelViewModel | null;
	compareAtAmount?: number | null;
	compareAtFormatted?: string | null;
	discountPercent?: number | null;
}

export interface PricePresenterOptions {
	channel?: ChannelViewModel;
	currency?: string;
	label?: string;
	pendingLabel?: string;
	formatPrice?: (amount: number | null) => string;
}

const DEFAULT_CURRENCY = 'ARS';
const DEFAULT_PRICE_LABEL = 'Precio';
const DEFAULT_PENDING_LABEL = 'pendiente';

function normalizeAmount(value: number | null): number | null {
	if (value === null) return null;
	return Number.isFinite(value) ? value : null;
}

export function toPriceViewModel(price: PricePresenterInput, options: PricePresenterOptions = {}): PriceViewModel {
	const amount = normalizeAmount(price.amount);
	const channel = price.channel ?? options.channel;

	return {
		amount,
		formatted:
			price.formatted ??
			options.formatPrice?.(amount) ??
			(amount === null ? (options.pendingLabel ?? DEFAULT_PENDING_LABEL) : String(amount)),
		currency: price.currency ?? options.currency ?? DEFAULT_CURRENCY,
		label: price.label ?? options.label ?? channel?.label ?? DEFAULT_PRICE_LABEL,
		isPending: price.isPending ?? amount === null,
		channel,
		compareAtAmount: price.compareAtAmount ?? null,
		compareAtFormatted: price.compareAtFormatted ?? null,
		discountPercent: price.discountPercent ?? null,
	};
}
