import { CityGeocoding } from '../types/city'
import axios from './config'

type GetOneCallWeatherForecast = {
  q: string
}

export const getCityGeocoding = async (
  params: GetOneCallWeatherForecast
): Promise<CityGeocoding[]> => {
  const response = await axios.get('/geo/1.0/direct', {
    params: {
      ...params,
      limit: 1
    }
  })

  return response.data
}
