import { useModel } from '@/contexts/ModelContext';
import { AllModelsResponse } from '@/types/model';
import { useState, useEffect, useRef } from 'react';
import Modal from '../modals/Modal';
import ModelInfoModal from '../modals/ModelInfoModal';
import Spinner from '../Spinner';

export default function ChatHeader() {
  const { selectedModel, setSelectedModel } = useModel();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModelInfoModalOpen, setIsModelInfoModalOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<AllModelsResponse>({
    models: [],
  });
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const openModelDropdown = async () => {
    if (modelDropdownOpen) return;
    setLoading(true);
    await Promise.all([fetchAllModels(), fetchActiveModels()]).catch((error) => {
      console.error(error);
      setAvailableModels({
        models: [
          {
            name: 'Unable to load models',
            modified_at: '',
            size: 0,
            digest: '',
            details: {
              format: '',
              family: '',
              families: null,
              parameter_size: '',
              quantization_level: '',
            },
            expires_at: '',
            size_vram: 0,
          },
        ],
      });
    });
    setModelDropdownOpen(true);
    setLoading(false);
  };

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
  };

  const fetchAllModels = async () => {
    await fetch('/api/models/all')
      .then((response) => response.json())
      .then((data: AllModelsResponse) => setAvailableModels(data));
  };

  const fetchActiveModels = async () => {
    await fetch('/api/models/active')
      .then((response) => response.json())
      .then((data: AllModelsResponse) => {
        setActiveModels(data.models.map((model) => model.name));
      });
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
        <div className="flex flex-row items-center">
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
        </div>
        {modelDropdownOpen && (
          <div className="absolute right-0 top-full z-10 w-40 rounded-md bg-gray-100 shadow-lg">
            {availableModels &&
              availableModels.models.map((model, index) => (
                <button
                  key={index}
                  onClick={() => selectModel(model.name)}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-secondaryColor hover:rounded-md hover:bg-gray-200"
                >
                  {activeModels.includes(model.name) && (
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  )}
                  <span
                    className={`flex-1 truncate ${selectedModel === model.name ? 'font-semibold' : ''}`}
                  >
                    {model.name}
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
    </div>
  );
}
