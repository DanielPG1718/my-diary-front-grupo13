// 🔥 EXCEPCIONES (monedas que no siguen regla ISO directa)
const exceptions: Record<string, string> = {
  EUR: 'eu',

  // importantes
  GBP: 'gb',
  JPY: 'jp',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',

  // LATAM
  PEN: 'pe',
  MXN: 'mx',
  ARS: 'ar',
  CLP: 'cl',
  COP: 'co',
  BRL: 'br',

  // África / regionales
  XOF: 'sn',
  XAF: 'cm',

  // especiales
  XPF: 'pf',
  XCD: 'ag',
  XDR: 'un',
  CNH: 'cn',
}

// 🔥 FUNCIÓN PRINCIPAL
export const getFlagUrl = (currencyCode?: string): string => {
  if (!currencyCode) return '/flags/default.png'

  const code = currencyCode.toUpperCase()

  // 1. excepción
  if (exceptions[code]) {
    return `https://flagcdn.com/w40/${exceptions[code]}.png`
  }

  // 2. automático
  const countryCode = code.slice(0, 2).toLowerCase()

  return `https://flagcdn.com/w40/${countryCode}.png`
}