import { useQuery } from '@tanstack/react-query'
import { getCityGeocoding } from '../api/city'
import { CityGeocoding } from '../types/city'

export const useCityGeocoding = (city: string) => {
  const query = useQuery<CityGeocoding[]>(['city', city], () =>
    getCityGeocoding({
      q: city,
      limit: 1
    })
  )

  return {
    ...query,
    data: query.data ? query.data[0] : undefined
  }
}
