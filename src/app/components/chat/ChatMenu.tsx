import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ModelModal, { ModelModalProps } from '../modals/ModelModal';
import EmbedModal, { EmbedModalProps } from '../modals/EmbedModal';
import Modal from '../modals/Modal';
import ChatHistory from './ChatHistory';

export default function ChatMenu() {
  const isMobile = window.innerWidth < 768;
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(!isMobile);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isMobile && menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={menuRef}
        className={`flex-shrink-0 overscroll-none bg-black transition-all duration-300 ${isMenuOpen ? 'w-64' : 'w-0'}`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="m-auto mt-4 flex w-11/12 flex-col text-sm">
            <div className="flex justify-between align-middle">
              <button onClick={toggleNavbar} className="p-2 text-white hover:opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEmbedModalOpen(true)}
                  className="p-2 text-white hover:opacity-80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setIsModelModalOpen(true)}
                  className="p-2 text-white hover:opacity-80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="p-2 text-white hover:opacity-80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <ChatHistory />

          <div className="flex flex-col gap-5 p-5 text-stone-300">
            <div className="flex items-center gap-2">
              <Image
                className="rounded-full"
                src={user!.photoURL!}
                alt={`${user!.displayName}'s avatar`}
                width={25}
                height={25}
              />
              <span>{user!.displayName}</span>
            </div>

            <div className="h-px bg-slate-500"></div>

            <div className="w-full">
              <button
                onClick={() => router.push('/help')}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
                <span>Help</span>
              </button>
            </div>

            <div className="h-px bg-slate-500"></div>

            <div className="w-full">
              <button onClick={signOut} className="flex items-center gap-2 hover:opacity-80">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEmbedModalOpen && (
        <Modal onClose={() => setIsEmbedModalOpen(false)}>
          <EmbedModal {...({} as EmbedModalProps)} />
        </Modal>
      )}

      {isModelModalOpen && (
        <Modal onClose={() => setIsModelModalOpen(false)}>
          <ModelModal {...({} as ModelModalProps)} />
        </Modal>
      )}

      <button
        onClick={toggleNavbar}
        className={`fixed left-8 top-4 -translate-x-1/2 transform p-2 transition-colors duration-300 ${isMenuOpen && 'hidden'}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </>
  );
}
