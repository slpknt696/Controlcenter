const base = import.meta.env?.BASE_URL || '/';

export function withBase(path = '/') {
	if (!path) return '';
	if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
		return path;
	}

	const cleanBase = base === '/' ? '' : base.replace(/\/$/, '');
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${cleanBase}${cleanPath}` || '/';
}

export const assetUrl = withBase;
export const sitePath = withBase;
