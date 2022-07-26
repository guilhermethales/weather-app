import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Box, Heading, Text } from '@chakra-ui/react'

import { formatDate } from '../../utils/functions/dates'
import { WEATHER_ICONS } from '../../utils/constants/weather'
import { OneCallCity } from '../../types/daily'
import { CityGeocoding } from '../../types/city'
import { getOneCallWeatherForecast } from '../../api/weather'

type WeatherDataProps = {
  weather: OneCallCity
  cityData: CityGeocoding[]
  cityFirstLocation: string
}

const WeatherData = ({
  weather,
  cityData,
  cityFirstLocation
}: WeatherDataProps) => {
  const isFirstCity = cityData[0].name === cityFirstLocation

  const { data, isError } = useQuery<OneCallCity>(
    ['weather', cityData[0].name],
    () =>
      getOneCallWeatherForecast({
        lat: cityData[0].lat,
        lon: cityData[0].lon
      }),
    {
      initialData: isFirstCity ? weather : undefined,
      keepPreviousData: true,
      enabled: !isFirstCity,
      select: (data) => ({ ...data, daily: data.daily.slice(0, 5) })
    }
  )

  if (isError) {
    return (
      <Box mt={4}>
        <Heading color="white">Something went wrong! :(</Heading>
      </Box>
    )
  }

  return data ? (
    <>
      <Box my={20}>
        <Box>
          <Box mb={4}>
            <Box display="flex" alignItems="center">
              <Heading as="h2" color="white" size="4xl">
                {Math.round(data.current.temp)}°
              </Heading>
              <Box pl={4}>
                <Heading as="h1" color="white" size="lg">
                  {`${cityData[0].name}, ${cityData[0].country}`}
                </Heading>
                <Text color="white">{formatDate(data.current.dt)}</Text>
              </Box>
            </Box>
          </Box>

          <Box display="flex" fontWeight="medium" color="white" gap={2}>
            <Text>Min: {Math.round(data.daily[0].temp.min)} °C</Text>
            <Text>Max: {Math.round(data.daily[0].temp.max)} °C</Text>
            <Text>Mean: {Math.round(data.daily[0].temp.day)} °C</Text>
          </Box>
        </Box>
      </Box>

      <Box
        as="section"
        display={{ lg: 'grid' }}
        gap={4}
        gridTemplateColumns="repeat(4, 200px)"
      >
        {[...data.daily.slice(1, data.daily.length)].map((day) => (
          <Box
            key={day.dt}
            mb={4}
            padding={4}
            shadow="md"
            bgColor="#363636"
            color="white"
            position="relative"
            borderRadius={8}
          >
            <Box mb={4}>
              <Heading as="h3" size="sm">
                {formatDate(day.dt)}
              </Heading>
            </Box>

            <Box my={2} mx="auto" maxW={25}>
              <Image src={WEATHER_ICONS[day.weather[0].icon]} alt="sun" />
            </Box>

            <Text>Morning {Math.round(day.temp.morn)}°C</Text>
            <Text>Day {Math.round(day.temp.day)}°C</Text>
            <Text>Night {Math.round(day.temp.night)}°C</Text>
            <Text>Humidity {day.humidity}%</Text>
          </Box>
        ))}
      </Box>
    </>
  ) : null
}

export default WeatherData
