import type { ImageViewModel } from './image';

export interface CategoryViewModel {
	id: string;
	name: string;
	slug: string;
	href: string;
	image: ImageViewModel;
	productCount: number;
}
