export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-16 h-screen">
      <div>
        <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.02944 0 0 4.02943 0 9V57C0 61.9706 4.02943 66 9 66L11.2437 66V40.7897C11.2437 40.702 11.2656 40.6156 11.3073 40.5385L30.6736 4.7288C31.7721 2.69759 34.6872 2.69902 35.7837 4.73131L55.1034 40.5387C55.145 40.6157 55.1668 40.7019 55.1668 40.7894V66L57 66C61.9706 66 66 61.9706 66 57V9C66 4.02944 61.9706 0 57 0H9ZM52.0859 66V41.9391L34.7992 31.7262V64.284V64.416C34.7992 65.2872 35.5115 65.994 36.3813 66L52.0859 66ZM34.782 28.314V9.43009L49.9026 37.0392L35.508 28.5516C35.508 28.5516 35.2934 28.4338 35.145 28.3866C35.0072 28.3428 34.782 28.314 34.782 28.314ZM44.022 65.076C45.5894 65.076 46.86 63.569 46.86 61.71C46.86 59.851 45.5894 58.344 44.022 58.344C42.4546 58.344 41.184 59.851 41.184 61.71C41.184 63.569 42.4546 65.076 44.022 65.076ZM47.124 44.6245C47.124 43.8179 47.7779 43.1639 48.5845 43.1639C49.3912 43.1639 50.0451 43.8179 50.0451 44.6245V54.8638C50.0451 55.6704 49.3912 56.3243 48.5845 56.3243C47.7779 56.3243 47.124 55.6704 47.124 54.8638V44.6245ZM43.958 40.392C43.1549 40.392 42.504 41.0429 42.504 41.846V52.3188C42.504 53.1218 43.1549 53.7728 43.958 53.7728C44.761 53.7728 45.4119 53.1218 45.4119 52.3188V41.846C45.4119 41.0429 44.761 40.392 43.958 40.392ZM37.9671 39.5584C37.9671 38.743 38.6281 38.082 39.4435 38.082C40.2589 38.082 40.9199 38.743 40.9199 39.5584V50.0749C40.9199 50.8903 40.2589 51.5513 39.4435 51.5513C38.6281 51.5513 37.9671 50.8903 37.9671 50.0749V39.5584Z" fill="#ffffff"></path>
        </svg>
      </div>
      
      <div className="rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 w-[380px] py-5  max-[900px]:mt-10 max-[400px]:w-[95%]">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Welcome
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Login with your Cornell account
          </p>
        </div>
        
        <div className="items-center p-6 pt-0 flex mt-1">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-800 bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:text-neutral-200 dark:hover:bg-neutral-400 h-10 px-4 py-2 w-full">
            Login
          </button>
        </div>
      </div>

    </main>
  );
}