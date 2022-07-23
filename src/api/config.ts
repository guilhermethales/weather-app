import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  params: {
    appId: process.env.NEXT_PUBLIC_API_KEY
  }
})

export default instance
