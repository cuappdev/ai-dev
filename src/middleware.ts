import { NextRequest, NextResponse} from 'next/server';
import { authMiddleware } from 'next-firebase-auth-edge';

const { privateKey } = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY!);

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: process.env.AUTH_COOKIE_NAME!,
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: process.env.USE_SECURE_COOKIES === "true",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7 * 4, // 4 weeks
    },
    cookieSignatureKeys: [process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT!, process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!],
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey,
    },
    // Not called on login or logout
    handleValidToken: async ({ decodedToken }, headers) => {
      const uid = decodedToken.uid;

      // TODO: Check if user is in the database
      // if (true) {
      //   const response = NextResponse.json({ error: 'You must be part of Cornell AppDev to use this app' }, { status: 401 });
      //   response.cookies.set(process.env.AUTH_COOKIE_NAME!, '', {
      //     expires: new Date(0),
      //   });
      //   return response;
      // }

      const forwardedHeaders = new Headers(headers);
      forwardedHeaders.set('uid', uid);
      // TODO: Forward along the user's role
      return NextResponse.next({
        request: {
          headers: forwardedHeaders,
        }
      });
    },
    handleInvalidToken: async (message) => {
      const token = request.headers.get('Authorization')?.split('Bearer ')[1];
      if (token === process.env.SPECIAL_TOKEN) {
        return NextResponse.next({
          request: {
            headers: request.headers,
          }
        });
      }
      return NextResponse.json({ error: `${message} - please login again` }, { status: 401 });
    },
    handleError: async (error) => {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  });
}

export const config = {
  matcher: ['/api/login', '/api/authenticate', '/api/logout', '/api/models', '/api/models/copy','/api/models/create', '/api/models/pull', '/api/users/:path', '/api/embed'],
};
