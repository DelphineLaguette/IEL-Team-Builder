import { NextResponse, type NextRequest } from 'next/server'

// Firebase Admin SDK doesn't run in the Edge runtime, so the proxy only
// checks for cookie presence. Full token verification happens in the
// protected layout via the Admin SDK on the Node.js runtime.
export function proxy(request: NextRequest) {
  const session = request.cookies.get('__session')?.value
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'

  if (!session && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (session && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
