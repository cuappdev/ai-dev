import { ToastContainer, Slide } from 'react-toastify';

export default function ErrorToast() {
  return (
    <ToastContainer
      className={'text-sm'}
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Slide}
    />
  );
}
