import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
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

import { formatDate } from '../utils/functions/dates'
import { WEATHER_ICONS } from '../utils/constants/weather'
import { getOneCallWeatherForecast } from '../api/weather'
import { OneCallCity } from '../types/daily'
import { getCityGeocoding } from '../api/city'
import { CityGeocoding } from '../types/city'

export async function getServerSideProps() {
  const city = await getCityGeocoding({
    q: 'Paris',
    limit: 1
  })

  const weather = await getOneCallWeatherForecast({
    lat: city[0].lat,
    lon: city[0].lon
  })

  return { props: { city: city, weather } }
}

type HomeProps = {
  city: CityGeocoding[]
  weather: OneCallCity
}

const DEFAULT_CITY = 'Paris'

const Home = ({ city, weather }: HomeProps) => {
  const [cityInput, setCityInput] = useState('')
  const [searchCity, setSearchCity] = useState(DEFAULT_CITY)

  const { data: cityData, refetch } = useQuery<CityGeocoding[]>(
    ['city'],
    () =>
      getCityGeocoding({
        q: searchCity,
        limit: 1
      }),
    {
      initialData: city,
      enabled: false
    }
  )

  const isFirstCity = cityData[0].name === DEFAULT_CITY

  const { data } = useQuery<OneCallCity>(
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

  useEffect(() => {
    if (cityData && cityData[0].name !== searchCity) {
      refetch()
    }
  }, [cityData, searchCity, refetch])

  const submitSearchCity = () => {
    setSearchCity(cityInput)
  }

  const currentDay = data?.current

  return currentDay ? (
    <>
      <Head>
        <title>Weather Forecast</title>
        <meta name="description" content="Weather Forecast" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        as="main"
        backgroundImage={`url(${process.env.NEXT_PUBLIC_BACKGROUND})`}
        backgroundPosition="center"
        backgroundSize="cover"
        height="100%"
        overflow="auto"
      >
        <Box
          p={8}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxW={1000}
          margin="0 auto"
        >
          <Box maxW={400} width={{ base: '100%' }}>
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

          <Box my={20}>
            <Box>
              <Box mb={4}>
                <Box display="flex" alignItems="center">
                  <Heading as="h2" color="white" size="4xl">
                    {Math.round(currentDay?.temp)}°
                  </Heading>
                  <Box pl={4}>
                    <Heading as="h1" color="white" size="lg">
                      {`${cityData[0].name}, ${cityData[0].country}`}
                    </Heading>
                    <Text color="white">{formatDate(currentDay.dt)}</Text>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" fontWeight="medium" color="white" gap={2}>
                <Text>Min: {data.daily[0].temp.min} °C</Text>
                <Text>Max: {data.daily[0].temp.max} °C</Text>
                <Text>Mean: {data.daily[0].temp.day} °C</Text>
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
        </Box>
      </Box>
    </>
  ) : null
}

export default Home
