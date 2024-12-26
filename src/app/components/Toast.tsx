import { ToastContainer, Slide } from 'react-toastify';

export default function ErrorToast() {
  return (
    <ToastContainer
      className={'p-2 text-sm'}
      closeButton={false}
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnHover
      theme="colored"
      transition={Slide}
    />
  );
}
