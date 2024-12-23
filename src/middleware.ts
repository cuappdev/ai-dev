import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from 'next-firebase-auth-edge';

const { privateKey } = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY!);

export async function middleware(request: NextRequest) {
  // TODO: Cache the middleware
  // TODO: Move check for user in database once Node.js runtime support is added to next middleware (https://github.com/vercel/next.js/discussions/71727)
  return authMiddleware(request, {
    // Sets cookie
    loginPath: '/api/login',
    // Deletes cookie
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
    // Not called on login or logout
    handleValidToken: async ({ decodedToken }, headers) => {
      const uid = decodedToken.uid;

      try {
        if (!decodedToken.email!.toLowerCase().endsWith('@cornell.edu')) {
          throw new Error('Please sign in with your Cornell email');
        }
      } catch (error) {
        const response = NextResponse.json({ message: (error as Error).message }, { status: 401 });
        return response;
      }

      const forwardedHeaders = new Headers(headers);
      forwardedHeaders.set('uid', uid);
      forwardedHeaders.set('email', decodedToken.email!);
      return NextResponse.next({
        request: {
          headers: forwardedHeaders,
        },
      });
    },
    handleInvalidToken: async (message) => {
      const token = request.headers.get('Authorization')?.split('Bearer ')[1];
      if (token === process.env.SPECIAL_TOKEN) {
        return NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
      }
      return NextResponse.json(
        { sucess: false, message: `${message} - please login again` },
        { status: 401 },
      );
    },
    handleError: async (error) => {
      return NextResponse.json(
        { success: false, message: (error as Error).message },
        { status: 500 },
      );
    },
  });
}

export const config = {
  matcher: [
    '/api/login',
    '/api/authenticate',
    '/api/logout',
    '/api/models',
    '/api/models/copy',
    '/api/models/create',
    '/api/models/pull',
    '/api/users/:path',
    '/api/embed',
  ],
};
