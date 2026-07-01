export type ChannelId = 'retail' | 'wholesale';

export interface ChannelViewModel {
	id: ChannelId;
	label: string;
	description?: string;
	isWholesale: boolean;
}
