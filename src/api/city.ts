import axios from './config'

type GetOneCallWeatherForecast = {
  q: string
  limit: number
}

export const getCityGeocoding = async (params: GetOneCallWeatherForecast) => {
  const response = await axios.get('/geo/1.0/direct', { params })

  return response.data
}
