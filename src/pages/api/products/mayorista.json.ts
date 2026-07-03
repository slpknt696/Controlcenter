const responseBody = {
	ok: true,
	contract: 'public-static-informational',
	channel: 'mayorista',
	mode: 'mayorista',
	security: 'public-static-no-auth',
	count: 0,
	products: [],
	message: 'Canal mayorista sujeto a consulta comercial.',
	commercial_confirmation_required: true,
};

export function GET() {
	return new Response(
		JSON.stringify(responseBody),
		{
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': 'no-store',
			},
		},
	);
}
