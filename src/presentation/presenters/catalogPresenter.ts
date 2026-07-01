import type { ProductListViewModel } from '../contracts/catalog';
import type { CategoryViewModel } from '../contracts/category';
import type { ChannelViewModel } from '../contracts/channel';
import type { ProductCardViewModel } from '../contracts/product';

export interface CatalogPresenterInput {
	title: string;
	description?: string;
	channel: ChannelViewModel;
	products: ProductCardViewModel[];
	categories: CategoryViewModel[];
	emptyStateTitle?: string;
	emptyStateDescription?: string;
}

export function toProductListViewModel(catalog: CatalogPresenterInput): ProductListViewModel {
	return {
		title: catalog.title,
		description: catalog.description,
		channel: catalog.channel,
		products: catalog.products,
		categories: catalog.categories,
		totalCount: catalog.products.length,
		emptyState: {
			title: catalog.emptyStateTitle ?? 'No hay productos para ese filtro.',
			description: catalog.emptyStateDescription,
		},
	};
}
