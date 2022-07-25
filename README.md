## Weather App

> A simple weather app to show 5 day forecast for given city

## Getting start

The application is deployed and can be accessed [here](https://weather-forecast-next-app.netlify.app/).

To run the application in development mode, it's necessary to have a `.env.local` file with some keys:

```sh
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_API_URL=https://api.openweathermap.org
NEXT_PUBLIC_BACKGROUND=https://images.unsplash.com/photo-1542065029-be403c4fb94b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
```

Install dependencies 

```sh
npm install
```

Run application

```sh
npm run dev
```

Run tests

```sh
npm run test
```

Watching tests

```sh
npm run test:watch
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

## Technologies

- Typescript
- NextJS
- Chakra UI
- React Query
- Testing Library