import { useModel } from '@/contexts/ModelContext';
import { useState, useEffect, useRef } from 'react';
import Modal from '../modals/Modal';
import ModelInfoModal from '../modals/ModelInfoModal';
import ModelConfigModal from '../modals/ModelConfigModal';
import Spinner from '../Spinner';

export default function ChatHeader() {
  const { selectedModel, setSelectedModel, fetchAllModels, fetchActiveModels } = useModel();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const [isModelInfoModalOpen, setIsModelInfoModalOpen] = useState(false);
  const [isModelConfigModalOpen, setIsModelConfigModalOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const openModelDropdown = async () => {
    if (modelDropdownOpen) return;
    setLoading(true);
    try {
      const [allModels, activeModels] = await Promise.all([fetchAllModels(), fetchActiveModels()]);
      setActiveModels(activeModels);
      setAvailableModels(allModels);
    } catch (error) {
      setActiveModels([]);
      setAvailableModels([`Error fetching models - ${(error as Error).message}`]);
    }
    setModelDropdownOpen(true);
    setLoading(false);
  };

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
      setModelDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="m-auto flex w-11/12 flex-row items-center justify-end pt-3">
      <div className="relative" ref={modelDropdownRef}>
        <div className="flex flex-row items-center gap-2">
          <div className={`${loading ? 'flex items-center' : 'hidden'} mr-2`}>
            <Spinner width="1" height="1" />
          </div>

          <button onClick={() => setIsModelInfoModalOpen(true)}>
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
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </button>

          <button
            onClick={openModelDropdown}
            className="flex flex-row items-center gap-1 p-2 text-black hover:opacity-80"
          >
            <span className="text-lg font-semibold">{selectedModel}</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <button onClick={() => setIsModelConfigModalOpen(true)}>
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
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>
        </div>
        {modelDropdownOpen && (
          <div className="absolute right-0 top-full z-10 w-40 rounded-md bg-gray-100 shadow-lg">
            {availableModels &&
              availableModels.map((model, index) => (
                <button
                  key={index}
                  onClick={() => selectModel(model)}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-secondaryColor hover:rounded-md hover:bg-gray-200"
                >
                  {activeModels.includes(model) && (
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  )}
                  <span
                    className={`flex-1 truncate ${selectedModel === model ? 'font-semibold' : ''}`}
                  >
                    {model}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {isModelInfoModalOpen && (
        <Modal onClose={() => setIsModelInfoModalOpen(false)}>
          <ModelInfoModal />
        </Modal>
      )}

      {isModelConfigModalOpen && (
        <Modal onClose={() => setIsModelConfigModalOpen(false)}>
          <ModelConfigModal />
        </Modal>
      )}
    </div>
  );
}
