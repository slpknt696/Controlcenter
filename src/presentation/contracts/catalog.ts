import type { CategoryViewModel } from './category';
import type { ChannelViewModel } from './channel';
import type { ProductCardViewModel } from './product';

export interface ProductListViewModel {
	title: string;
	description?: string;
	channel: ChannelViewModel;
	products: ProductCardViewModel[];
	categories: CategoryViewModel[];
	totalCount: number;
	emptyState: {
		title: string;
		description?: string;
	};
}
