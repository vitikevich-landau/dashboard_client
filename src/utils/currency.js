export const toLocalCurrency = (v, options = {}) =>
  v.toLocaleString('ru-RU', {
    style: "currency",
    currency: "RUB",
    ...options
  });