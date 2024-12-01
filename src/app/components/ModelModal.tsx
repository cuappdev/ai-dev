import { CreateModelResponse, PullModelResponse } from '@/types/model';
import { useState, useEffect, useRef } from 'react';

interface ModelModalProps {
  onClose: () => void;
}

type ModalOption = 'create' | 'pull' | 'delete';

interface ModalOptionConfig {
  value: ModalOption;
  label: string;
}

const modalOptions: ModalOptionConfig[] = [
  { value: 'create', label: 'Create Model' },
  { value: 'pull', label: 'Pull Model' },
  { value: 'delete', label: 'Delete Model' }
];

export default function ModelModal({ onClose }: ModelModalProps) {
  const [activeTab, setActiveTab] = useState<ModalOption>('create');
  const modalRef = useRef<HTMLDivElement>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const createModelNameRef = useRef<HTMLInputElement>(null);
  const createModelfileRef = useRef<HTMLTextAreaElement>(null);

  const pullModelNameRef = useRef<HTMLInputElement>(null);

  const deleteModelNameRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabChange = (tab: ModalOption) => {
    setActiveTab(tab);
    setLoading(false);
    setSuccess(null);
    setError(null);
    setLogs([]);
  }

  const createModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    setLogs([]);

    const model = createModelNameRef.current!.value.trim();
    const modelfile = createModelfileRef.current!.value.trim();

    if (!model || !modelfile) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const initialResponse = await fetch('http://localhost:11434/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: model, modelfile: modelfile, stream: true })
      });

      if (!initialResponse.ok || !initialResponse.body) {
        const data = await initialResponse.json();
        throw new Error(data.error || 'Failed to create the model.');
      }

      const reader = initialResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const data = await reader.read();
        const response: CreateModelResponse = JSON.parse(decoder.decode(data.value, { stream: true }));

        setLogs((prevLogs) => [...prevLogs, response.status]);
        if (response.status === 'success') {
          break;
        }
      }

      setSuccess('Model created successfully.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const pullModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    setLogs([]);

    const model = pullModelNameRef.current!.value.trim();

    if (!model) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const initialResponse = await fetch('http://localhost:11434/api/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: model, stream: true })
      });

      if (!initialResponse.ok || !initialResponse.body) {
        const data = await initialResponse.json();
        throw new Error(data.error || 'Failed to pull the model.');
      }

      const reader = initialResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const data = await reader.read();
        const response: PullModelResponse = JSON.parse(decoder.decode(data.value, { stream: true }));

        setLogs((prevLogs) => [...prevLogs, response.status]);
        if (response.status === 'success') {
          break;
        }
      }      

      setSuccess('Model pulled successfully.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    setLogs([]);

    const model = deleteModelNameRef.current!.value.trim();

    if (!model) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/models', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: model })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete the model.');
      }
      setSuccess('Model deleted successfully.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (!loading) {
      switch (activeTab) {
        case 'create':
          return 'Create Model';
        case 'pull':
          return 'Pull Model';
        case 'delete':
          return 'Delete Model';
        default:
          return 'Submit';
      }
    }

    switch (activeTab) {
      case 'create':
        return 'Creating...';
      case 'pull':
        return 'Pulling...';
      case 'delete':
        return 'Deleting...';
      default:
        return 'Submitting...';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white border rounded-lg w-11/12 max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4">
          <div className="flex justify-between">
            {modalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTabChange(option.value)}
                className={`py-2 px-4 ${
                  activeTab === option.value
                    ? 'border-b-2 border-primaryColor text-primaryColor'
                    : 'text-gray-500 dark:text-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {activeTab === 'create' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Create a New Model</h2>
              <form onSubmit={createModel}>
                <div className="mb-4">
                  <label className="block mb-2">
                    Model Name
                  </label>
                  <input
                    type="text"
                    ref={createModelNameRef}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">
                    Modelfile
                  </label>
                  <textarea
                    ref={createModelfileRef}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primaryColor text-white py-2 rounded-md hover:opacity-80"
                >
                  {getButtonLabel()}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'pull' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Pull Model</h2>
              <form onSubmit={pullModel}>
                <div className="mb-4">
                  <label className="block mb-2">
                    Model Name
                  </label>
                  <input
                    type="text"
                    ref={pullModelNameRef}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primaryColor text-white py-2 rounded-md hover:opacity-80"
                >
                  {getButtonLabel()}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'delete' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Delete Model</h2>
              <form onSubmit={deleteModel}>
                <div className="mb-4">
                  <label className="block mb-2">
                    Model Name
                  </label>
                  <input
                    type="text"
                    ref={deleteModelNameRef}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primaryColor text-white py-2 rounded-md hover:opacity-80"
                >
                  {getButtonLabel()}
                </button>
              </form>
            </div>
          )}

          {logs.length > 0 && (
            <div className="mt-4 bg-black text-white font-mono p-4 rounded-md overflow-y-auto max-h-60">
            <h3 className="text-lg font-semibold mb-2">Logs</h3>
            <ul className="list-none space-y-1">
              {logs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </div>
          )}

          {success && (
            <div className="mt-4">
              <p className="text-green-500 text-sm">{success}</p>
            </div>
          )}

          {error && (
            <div className="mt-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
