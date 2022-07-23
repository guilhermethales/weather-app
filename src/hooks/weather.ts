import { useQuery } from '@tanstack/react-query'
import { getOneCallWeatherForecast } from '../api/weather'
import { OneCallCity } from '../types/daily'

export const useWeatherQuery = () => {
  const query = useQuery<OneCallCity>(['weather'], () =>
    getOneCallWeatherForecast({
      lat: -19.91,
      lon: -43.94,
      exclude: 'minutely,hourly,alerts',
      units: 'metric'
    })
  )

  return {
    ...query,
    data: {
      ...query.data,
      daily: query.data?.daily.slice(0, 5)
    }
  }
}
