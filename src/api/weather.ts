import axios from './config'

type GetOneCallWeatherForecast = {
  lat?: number
  lon?: number
  exclude: string
  units: 'standard' | 'metric' | 'imperial'
}

export const getOneCallWeatherForecast = async (
  params: GetOneCallWeatherForecast
) => {
  console.log(params, 'params')
  const response = await axios.get('/data/2.5/onecall', { params })

  return response.data
}
