export type ImageLoadingMode = 'eager' | 'lazy';

export interface ImageViewModel {
	src: string;
	alt: string;
	width?: number | null;
	height?: number | null;
	loading?: ImageLoadingMode;
	isPlaceholder: boolean;
}
