import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from 'next-firebase-auth-edge';

const { privateKey } = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY!);

export async function middleware(request: NextRequest) {
  // TODO: Move check for user in database once Node.js runtime support is added to Next middleware (https://github.com/vercel/next.js/discussions/71727)
  // TODO: Create 1 endpoint for authContext to hit after ^
  return authMiddleware(request, {
    // Dummy endpoint (no route function), validates token in header and sets cookie
    loginPath: '/api/login',
    // Dummy endpoint (no route function), deletes cookie
    logoutPath: '/api/logout',
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: process.env.AUTH_COOKIE_NAME!,
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: process.env.USE_SECURE_COOKIES === 'true',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7 * 4, // 4 weeks
    },
    cookieSignatureKeys: [
      process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT!,
      process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!,
    ],
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey,
    },
    handleValidToken: async ({ decodedToken }, headers) => {
      // Ensures Cornell email
      if (!decodedToken.email!.toLowerCase().endsWith('@cornell.edu')) {
        return NextResponse.json(
          { message: 'Please sign in with your Cornell email.' },
          { status: 403, headers: headers },
        );
      }

      // Pass along headers to be used by the routes
      const forwardedHeaders = new Headers(headers);
      forwardedHeaders.set('uid', decodedToken.uid);
      forwardedHeaders.set('email', decodedToken.email!);
      return NextResponse.next({
        request: {
          headers: forwardedHeaders,
        },
      });
    },
    handleInvalidToken: async (errorMessage) => {
      // Special authentication for apps
      const token = request.headers.get('Authorization')?.split('Bearer ')[1];
      if (token === process.env.SPECIAL_TOKEN) {
        return NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
      }
      return NextResponse.json(
        { message: `Please login again - ${errorMessage}` },
        { status: 401 },
      );
    },
    handleError: async (error) => {
      return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    },
  });
}

export const config = {
  matcher: [
    '/api/authenticate',
    '/api/models',
    '/api/models/copy',
    '/api/models/create',
    '/api/models/pull',
    '/api/chats',
    '/api/chats/:path',
    '/api/embed',
    '/api/chats',
    // Dummy auth routes - used by library for cookie management
    '/api/login',
    '/api/logout',
  ],
};
