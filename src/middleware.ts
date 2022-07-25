import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_CITY } from './utils/constants/city'

export function middleware(req: NextRequest) {
  const { nextUrl: url } = req
  const city = req.geo?.city || DEFAULT_CITY

  url.searchParams.set('city', city)
  return NextResponse.rewrite(url)
}
