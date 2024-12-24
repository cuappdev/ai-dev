'use client';

import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle, error } = useAuth();

  return (
    <main className="flex h-svh flex-col items-center justify-center gap-10">
      <div>
        <svg
          width="66"
          height="66"
          viewBox="0 0 66 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#CA4238"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 0C4.02944 0 0 4.02943 0 9V57C0 61.9706 4.02943 66 9 66L11.2437 66V40.7897C11.2437 40.702 11.2656 40.6156 11.3073 40.5385L30.6736 4.7288C31.7721 2.69759 34.6872 2.69902 35.7837 4.73131L55.1034 40.5387C55.145 40.6157 55.1668 40.7019 55.1668 40.7894V66L57 66C61.9706 66 66 61.9706 66 57V9C66 4.02944 61.9706 0 57 0H9ZM52.0859 66V41.9391L34.7992 31.7262V64.284V64.416C34.7992 65.2872 35.5115 65.994 36.3813 66L52.0859 66ZM34.782 28.314V9.43009L49.9026 37.0392L35.508 28.5516C35.508 28.5516 35.2934 28.4338 35.145 28.3866C35.0072 28.3428 34.782 28.314 34.782 28.314ZM44.022 65.076C45.5894 65.076 46.86 63.569 46.86 61.71C46.86 59.851 45.5894 58.344 44.022 58.344C42.4546 58.344 41.184 59.851 41.184 61.71C41.184 63.569 42.4546 65.076 44.022 65.076ZM47.124 44.6245C47.124 43.8179 47.7779 43.1639 48.5845 43.1639C49.3912 43.1639 50.0451 43.8179 50.0451 44.6245V54.8638C50.0451 55.6704 49.3912 56.3243 48.5845 56.3243C47.7779 56.3243 47.124 55.6704 47.124 54.8638V44.6245ZM43.958 40.392C43.1549 40.392 42.504 41.0429 42.504 41.846V52.3188C42.504 53.1218 43.1549 53.7728 43.958 53.7728C44.761 53.7728 45.4119 53.1218 45.4119 52.3188V41.846C45.4119 41.0429 44.761 40.392 43.958 40.392ZM37.9671 39.5584C37.9671 38.743 38.6281 38.082 39.4435 38.082C40.2589 38.082 40.9199 38.743 40.9199 39.5584V50.0749C40.9199 50.8903 40.2589 51.5513 39.4435 51.5513C38.6281 51.5513 37.9671 50.8903 37.9671 50.0749V39.5584Z"
          ></path>
        </svg>
      </div>

      <div className="w-[380px] rounded-lg border border-neutral-200 py-5 text-neutral-950 shadow-sm max-[900px]:mt-10 max-[400px]:w-[95%]">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold">Welcome to AI Dev!</h3>
          <p className="text-sm text-secondaryColor">Login with your Cornell email account</p>
        </div>

        <div className="flex items-center p-6 pt-0">
          <button
            onClick={signInWithGoogle}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-80"
          >
            <svg
              height="20"
              viewBox="0 0 20 20"
              width="20"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <path
                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                fill="#4285F4"
              ></path>
              <path
                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                fill="#34A853"
              ></path>
              <path
                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                fill="#FBBC05"
              ></path>
              <path
                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                fill="#EA4335"
              />
            </svg>
            <span>Login</span>
          </button>
        </div>

        {error && <div className="pl-6 text-sm text-red-600">{error}</div>}
      </div>
    </main>
  );
}
