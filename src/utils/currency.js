const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatCurrency = (value) => currencyFormatter.format(value);

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
};

// '1.234,50', '1.000', '100,5' ou '100.50' → número; NaN se não for um valor válido.
// Ponto seguido de exatamente 3 dígitos é separador de milhar, como no pt-BR.
export const parseCurrency = (text) => {
  const raw = String(text).trim().replace(/^R\$\s*/, '');
  if (/^\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(raw)) return Number(raw.replace(/\./g, '').replace(',', '.'));
  if (/^\d+([.,]\d{1,2})?$/.test(raw)) return Number(raw.replace(',', '.'));
  return NaN;
};
