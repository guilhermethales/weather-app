export const isSearchCityEqualToCurrentCity = (
  currentCity: string,
  searchCity: string
) => {
  const isEqual =
    currentCity.localeCompare(searchCity, 'en', { sensitivity: 'base' }) === 0

  return isEqual
}
