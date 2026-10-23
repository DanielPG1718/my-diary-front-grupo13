// Diary devuelve las fechas UTC de Docker sin sufijo de zona horaria.
// Las fechas que ya incluyen Z u offset conservan su instante original.
export function parseUtcDate(value: string | Date): Date {
  if (value instanceof Date) return new Date(value.getTime())

  const dateTime = value.trim()
  const withoutTimeZone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(dateTime)
  return new Date(withoutTimeZone ? `${dateTime}Z` : dateTime)
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
) {
  return new Intl.DateTimeFormat('es-PE', {
    ...options,
    timeZone: 'America/Lima',
  }).format(parseUtcDate(value))
}
