import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'

import { getOneCallWeatherForecast } from '../api/weather'
import { getCityGeocoding } from '../api/city'
import { OneCallCity } from '../types/daily'
import { CityGeocoding } from '../types/city'
import WeatherData from '../components/WeatherData'
import Container from '../components/Container'
import { DEFAULT_CITY } from '../utils/constants/city'
import { isSearchCityEqualToCurrentCity } from '../utils/functions/city'

type QueryProps = {
  query: {
    city: string
  }
}

export async function getServerSideProps({ query }: QueryProps) {
  try {
    const city = await getCityGeocoding({
      q: query.city
    })

    const weather = await getOneCallWeatherForecast({
      lat: city[0].lat,
      lon: city[0].lon
    })

    return { props: { city: city, weather, cityFirstLocation: query.city } }
  } catch (error) {
    if (error instanceof AxiosError) {
      return { props: { error: !!error, city: [], weather: {} } }
    }
  }
}

type HomeProps = {
  city: CityGeocoding[]
  weather: OneCallCity
  error?: boolean
  cityFirstLocation: string
}

const renderErrorMessage = () => (
  <Heading color="white">
    Error while fetching weather forecast data. Try again later.
  </Heading>
)

const Home = ({ city, weather, error, cityFirstLocation }: HomeProps) => {
  const cityName = city[0]?.name || DEFAULT_CITY
  const [cityInput, setCityInput] = useState('')
  const [searchCity, setSearchCity] = useState(cityName)
  const [lastSearchedCity, setLastSearchedCity] = useState(cityName)
  const queryClient = useQueryClient()

  const {
    data: cityData,
    status,
    refetch,
    isError
  } = useQuery<CityGeocoding[]>(
    ['city', searchCity],
    () => getCityGeocoding({ q: searchCity }),
    {
      initialData: city,
      enabled: false,
      onSuccess: (data) => {
        if (
          data.length > 0 &&
          !isSearchCityEqualToCurrentCity(data[0].name, searchCity)
        ) {
          setSearchCity(lastSearchedCity)
          toast.error('City not found!')
        }
      },
      select: (data) => {
        const lastCachedCity = queryClient.getQueryData([
          'city',
          lastSearchedCity
        ]) as CityGeocoding[]

        return data.length > 0 ? data : lastCachedCity
      },
      keepPreviousData: true
    }
  )

  useEffect(() => {
    const shouldSearchCity =
      searchCity &&
      cityData &&
      !isSearchCityEqualToCurrentCity(cityData[0]?.name, searchCity)

    if (shouldSearchCity) {
      refetch()
    }
  }, [cityData, searchCity, refetch])

  useEffect(() => {
    if (status === 'success' && cityData.length > 0) {
      setLastSearchedCity(cityData[0].name)
    }
  }, [status, searchCity, cityData])

  const submitSearchCity = () => {
    setSearchCity(cityInput)
  }

  if (error || isError) {
    return (
      <Container>
        <Box pt={100} textAlign="center">
          {renderErrorMessage()}
        </Box>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>Weather Forecast</title>
        <meta name="description" content="Weather Forecast" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Box
          px={8}
          py={16}
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

          {cityData.length === 0 ? (
            renderErrorMessage()
          ) : (
            <WeatherData
              cityFirstLocation={cityFirstLocation}
              weather={weather}
              cityData={cityData}
            />
          )}
        </Box>
      </Container>
    </>
  )
}

export default Home
