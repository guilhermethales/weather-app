export type CurrentWeather = {
  clouds: number
  dew_point: number
  dt: number
  feels_like: number
  humidity: number
  pressure: number
  sunrise: number
  sunset: number
  temp: number
  uvi: number
  visibility: number
}

export type WeatherIcon =
  | '01d'
  | '01n'
  | '02d'
  | '02n'
  | '03d'
  | '03n'
  | '04d'
  | '04n'
  | '09d'
  | '09n'
  | '10d'
  | '10n'
  | '11d'
  | '11n'
  | '13d'
  | '13n'
  | '50d'
  | '50n'

export type Weather = {
  id: number
  main: string
  description: string
  icon: WeatherIcon
}

export type Daily = {
  clouds: number
  dew_point: number
  dt: number
  feels_like: { day: number; night: number; eve: number; morn: number }
  humidity: number
  moon_phase: number
  moonrise: number
  moonset: number
  pop: number
  pressure: number
  sunrise: number
  sunset: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  uvi: number
  weather: Weather[]
  wind_deg: number
  wind_gust: number
  wind_speed: number
}

export type OneCallCity = {
  current: CurrentWeather
  daily: Daily[]
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
}
