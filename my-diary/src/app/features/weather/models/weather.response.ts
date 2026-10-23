export type WeatherConditionResponse = {
  estado: string,
  icono: string
}

export type WeatherResponse = {
  ubicacion: string,
  clima: WeatherConditionResponse[],
  temperatura: number,
  sensacion_termica: number,
  humedad: number,
  velocidad_viento: number
}
