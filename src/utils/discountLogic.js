export const COMBO_CHARGER_CABLE_DISCOUNT_RATE = 0.10;

export function isCable(item) {
  const text = `${item?.categoria || ''} ${item?.nombre || ''}`.toLowerCase();
  return text.includes('cable') || text.includes('lightning') || (text.includes('tipo c') && !text.includes('cargador'));
}

export function isCharger(item) {
  const text = `${item?.categoria || ''} ${item?.nombre || ''}`.toLowerCase();
  return text.includes('cargador') || text.includes('charger') || text.includes('carga rapida');
}

export function calculateDiscounts(items) {
  const chargers = [];
  const cables = [];

  for (const item of items) {
    const qty = Math.max(1, Number(item.qty) || 1);
    for (let index = 0; index < qty; index += 1) {
      if (isCharger(item)) chargers.push(Number(item.precio) || 0);
      else if (isCable(item)) cables.push(Number(item.precio) || 0);
    }
  }

  chargers.sort((a, b) => a - b);
  cables.sort((a, b) => a - b);

  const pairs = Math.min(chargers.length, cables.length);
  let chargerCableDiscount = 0;
  for (let index = 0; index < pairs; index += 1) {
    chargerCableDiscount += Math.round((chargers[index] + cables[index]) * COMBO_CHARGER_CABLE_DISCOUNT_RATE);
  }

  return {
    chargerCablePairs: pairs,
    chargerCableDiscount,
    totalDiscount: chargerCableDiscount,
  };
}
