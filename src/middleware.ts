import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const allowedOrigins = [
    process.env.HOST
  ];

  /* Get the origin header from the request */
  const origin = req.headers.get('host') || req.headers.get(':authority')  || '' 

  /* Check if the request comes from the allowed origin */
  if (allowedOrigins.includes(origin)) {
    const response = NextResponse.next(); // Proceed to the next middleware or request handler

    /* Set the CORS headers */
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');

    /* Handle OPTIONS preflight request */
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization',
        },
      });
    }

    return response;
  }

  /* If the origin is not allowed, return 403 Forbidden */
  return new Response(JSON.stringify({ message: 'Forbidden: Access is restricted' }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/* This ensures the middleware is applied only to API routes under /api */
export const config = {
  matcher: '/api/:path*',
};