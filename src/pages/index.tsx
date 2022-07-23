import { useState } from 'react'
import Head from 'next/head'
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from '@chakra-ui/react'
import { formatDate } from '../utils/dates'
import { useCityGeocoding } from '../hooks/city'
import { useQuery } from '@tanstack/react-query'
import { getOneCallWeatherForecast } from '../api/weather'
import { OneCallCity } from '../types/daily'

const Home = () => {
  const [cityInput, setCityInput] = useState('')
  const [searchCity, setSearchCity] = useState('Paris')
  const { data: cityData } = useCityGeocoding(searchCity)

  const { isLoading, isError, data } = useQuery<OneCallCity>(
    ['weather'],
    () =>
      getOneCallWeatherForecast({
        lat: cityData?.lat,
        lon: cityData?.lon,
        exclude: 'minutely,hourly,alerts',
        units: 'metric'
      }),
    {
      enabled: !!cityData?.name,
      select: (data) => ({ ...data, daily: data.daily.slice(0, 5) })
    }
  )

  if (isLoading) return 'Loading...'

  if (isError) return 'Error'

  const currentDay = data?.current

  const submitSearchCity = () => {
    setSearchCity(cityInput)
  }

  return data.daily ? (
    <>
      <Head>
        <title>Weather Forecast</title>
        <meta name="description" content="Weather Forecast" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box
          pt={16}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          maxW={600}
          margin="0 auto"
        >
          <Box display="flex" mb={4}>
            <FormControl
              as="form"
              onSubmit={(e) => {
                e.preventDefault()
                submitSearchCity()
              }}
            >
              <InputGroup size="md">
                <Input
                  autoFocus
                  bg="white"
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Type the city name"
                />
                <InputRightElement width="4.5rem">
                  <Button colorScheme="messenger" onClick={submitSearchCity}>
                    Search
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>

          <Box
            mb={8}
            textAlign="center"
            padding={4}
            shadow="md"
            background="white"
          >
            <Heading as="h1" size="md">
              {cityData?.name}
            </Heading>
            <Box my={2}>
              <Heading as="h2">{currentDay?.temp} °c</Heading>
            </Box>

            <Box gap={2}>
              <Text>Min: {data.daily[0].temp.min} °C</Text>
              <Text>Max: {data.daily[0].temp.max} °C</Text>
              <Text>Mean: {data.daily[0].temp.day} °C</Text>
            </Box>
          </Box>

          {[...data.daily.slice(1, data.daily.length)].map((day) => (
            <Box key={day.dt} mb={4} padding={4} shadow="md" background="white">
              <Box mb={4}>
                <Heading as="h3" size="sm">
                  {formatDate(day.dt)}
                </Heading>
              </Box>

              <Text>Morning {day.temp.morn} °c</Text>
              <Text>Day {day.temp.day} °c</Text>
              <Text>Night {day.temp.night} °c</Text>
              <Text>Humidity {day.humidity} °c</Text>
            </Box>
          ))}
        </Box>
      </main>
    </>
  ) : null
}

export default Home
