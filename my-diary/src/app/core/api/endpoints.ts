export const endpoints = {
  auth: '/auth-service/auth',
  users: '/auth-service/users',
  roles: '/auth-service/roles',
  userRoles: '/auth-service/user-roles',
  diary: '/diary-service/diary-entries',
  weather: '/weather-service/weather',
  weatherCities: 'weather-service/cities',
  countries: '/country-service/countries',
  currency: '/currency-service/currency',
  dashboard: '/dashboard-service/dashboard',
} as const
