const formatter = new Intl.NumberFormat('es-AR', {
	style: 'currency',
	currency: 'ARS',
	maximumFractionDigits: 0,
});

/**
 * Formats a Control Center price already stored as a final ARS amount.
 */
export function formatProductPrice(value: number) {
	return formatter.format(value);
}
