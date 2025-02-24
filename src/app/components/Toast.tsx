import { ToastContainer, Slide } from 'react-toastify';

export default function Toast() {
  return (
    <ToastContainer
      className={'p-2 text-sm'}
      stacked={true}
      closeButton={false}
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnHover={false}
      theme="colored"
      transition={Slide}
    />
  );
}
