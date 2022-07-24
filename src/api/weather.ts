import axios from './config'

export type GetOneCallWeatherForecast = {
  lat?: number
  lon?: number
}

export const getOneCallWeatherForecast = async (
  params: GetOneCallWeatherForecast
) => {
  const response = await axios.get('/data/2.5/onecall', {
    params: {
      ...params,
      exclude: 'minutely,hourly,alerts',
      units: 'metric'
    }
  })

  return response.data
}
