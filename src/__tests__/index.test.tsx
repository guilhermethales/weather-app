import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Daily, OneCallCity } from '../types/daily'
import Home from '../pages/index'

const cityData = [
  {
    country: 'FR',
    lat: 48.8588897,
    local_names: { eu: 'Paris' },
    lon: 2.3200410217200766,
    name: 'Paris',
    state: 'Ile-de-France'
  }
]

const day: Daily = {
  clouds: 58,
  dew_point: 10.39,
  dt: 1658746800,
  feels_like: { day: 26.63, night: 20.94, eve: 27.34, morn: 20.9 },
  humidity: 36,
  moon_phase: 0.9,
  moonrise: 1658710140,
  moonset: 1658771760,
  pop: 0,
  pressure: 1013,
  sunrise: 1658722475,
  sunset: 1658777975,
  temp: {
    day: 26.93,
    eve: 28.62,
    max: 29.07,
    min: 15.02,
    morn: 20.07,
    night: 23.34
  },
  uvi: 6.32,
  weather: [
    {
      description: 'broken clouds',
      icon: '04d',
      id: 803,
      main: 'Clouds'
    }
  ],
  wind_deg: 312,
  wind_gust: 9.57,
  wind_speed: 6.36
}

const weather: OneCallCity = {
  current: {
    clouds: 0,
    dew_point: 15.67,
    dt: 1658746800,
    feels_like: 21.62,
    humidity: 69,
    pressure: 1010,
    sunrise: 1658722475,
    sunset: 1658777975,
    temp: 21.1,
    uvi: 0,
    visibility: 10000,
    weather: [
      {
        description: 'clear sky',
        icon: '01n',
        id: 800,
        main: 'Clear'
      }
    ],
    wind_deg: 320,
    wind_speed: 4.12
  },
  daily: [
    day,
    { ...day, dt: 1658833200 },
    { ...day, dt: 1658919600 },
    { ...day, dt: 1659006000 },
    { ...day, dt: 1659092400 },
    { ...day, dt: 1659178800 },
    { ...day, dt: 1659265200 },
    { ...day, dt: 1659351600 }
  ],
  lat: 48.8589,
  lon: 2.32,
  timezone: 'Europe/Paris',
  timezone_offset: 7200
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

describe('Home', () => {
  it('renders the Paris city by default', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home city={cityData} weather={weather} />
      </QueryClientProvider>
    )

    expect(screen.getByText(/Paris/i)).toBeInTheDocument()
    expect(screen.getByText(/21°/i)).toBeInTheDocument()
    expect(screen.getByText(/Monday, July 25/i)).toBeInTheDocument()
    expect(screen.getByText(/Tuesday, July 26/i)).toBeInTheDocument()
    expect(screen.getByText(/Wednesday, July 27/i)).toBeInTheDocument()
    expect(screen.getByText(/Thursday, July 28/i)).toBeInTheDocument()
    expect(screen.getByText(/Friday, July 29/i)).toBeInTheDocument()
  })

  it('renders a error message when the server side returns an error', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home city={cityData} weather={weather} error />
      </QueryClientProvider>
    )

    expect(
      screen.queryByText(
        'Error while fetching weather forecast data. Try again later.'
      )
    ).toBeInTheDocument()

    expect(screen.queryByText(/Paris/i)).not.toBeInTheDocument()
  })
})
