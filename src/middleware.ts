import { NextRequest, NextResponse} from 'next/server';
import { authMiddleware } from 'next-firebase-auth-edge';

const { privateKey } = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY!);

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/authenticate',
    logoutPath: '/api/logout',
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: process.env.AUTH_COOKIE_NAME!,
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: process.env.USE_SECURE_COOKIES === "true",
      sameSite: "lax" as const,
      maxAge: 12 * 60 * 60 * 24,
    },
    cookieSignatureKeys: [process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT!, process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!],
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey,
    },
    handleValidToken: async ({token, decodedToken, customToken}, headers) => {
      // TODO: Check if user is in the database

      return NextResponse.next({
        request: {
          headers
        }
      });
    },
    handleInvalidToken: async (_reason) => {
      return NextResponse.json({ error: 'Invalid token - please login again' }, { status: 401 });
    },
    handleError: async (error) => {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  });
}

export const config = {
  matcher: ['/api/authenticate', '/api/logout', '/api/models', '/api/models/copy','/api/models/create', '/api/models/pull', '/api/users/:path', '/api/embed'],
};
