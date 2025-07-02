import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const publicPaths = ['/', '/login', '/signup'];
  const isPublic = publicPaths.includes(req.nextUrl.pathname);

  if (!session && !isPublic && !req.nextUrl.pathname.startsWith('/_next')) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    console.log('Redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  return res;
}


export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api|.*\\..*).*)'],
};

