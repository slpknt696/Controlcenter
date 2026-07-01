import type { CategoryViewModel } from '../contracts/category';
import type { ImageViewModel } from '../contracts/image';

export interface CategoryPresenterInput {
	id?: string | null;
	name: string;
	slug: string;
	href: string;
	image?: ImageViewModel | null;
	productCount?: number | null;
	count?: number | null;
}

const emptyImage: ImageViewModel = {
	src: '',
	alt: '',
	width: null,
	height: null,
	loading: 'lazy',
	isPlaceholder: true,
};

export function toCategoryViewModel(category: CategoryPresenterInput): CategoryViewModel {
	return {
		id: category.id ?? category.slug,
		name: category.name,
		slug: category.slug,
		href: category.href,
		image: category.image ?? emptyImage,
		productCount: Number(category.productCount ?? category.count ?? 0),
	};
}

export function toCategoryViewModels(categories: CategoryPresenterInput[]): CategoryViewModel[] {
	return categories.map(toCategoryViewModel);
}
