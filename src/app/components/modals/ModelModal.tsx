import {
  CreateModelRequest,
  CreateModelResponse,
  DeleteModelRequest,
  PullModelRequest,
  PullModelResponse,
} from '@/types/model';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef } from 'react';
import Spinner from '../Spinner';

interface ModelModalProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

type TabOption = 'create' | 'pull' | 'delete';

interface TabOptionConfig {
  value: TabOption;
  label: string;
}

const tabOptions: TabOptionConfig[] = [
  { value: 'create', label: 'Create Model' },
  { value: 'pull', label: 'Pull Model' },
  { value: 'delete', label: 'Delete Model' },
];

export default function ModelModal({ loading, setLoading }: ModelModalProps) {
  const { idToken, refreshToken } = useAuth();
  const [activeTab, setActiveTab] = useState<TabOption>('create');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const createModelNameRef = useRef<HTMLInputElement>(null);
  const createModelfileRef = useRef<HTMLTextAreaElement>(null);
  const pullModelNameRef = useRef<HTMLInputElement>(null);
  const deleteModelNameRef = useRef<HTMLInputElement>(null);

  const clearValues = () => {
    setSuccess(null);
    setError(null);
    setLogs([]);
  }

  const handleTabChange = (tab: TabOption) => {
    if (loading) return;
    setActiveTab(tab);
    clearValues();
  };

  // TODO: Fix stream request
  const sendStreamedRequest = async (
    body: CreateModelRequest | PullModelRequest,
  ) => {
    setLoading(true);
    clearValues();
    try {
      const initialResponse = await fetch(`/api/models/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(body),
      });

      if (initialResponse.status === 401) {
        await refreshToken();
        return sendStreamedRequest(body);
      }

      if (!initialResponse.ok || !initialResponse.body) {
        const data = await initialResponse.json();
        throw new Error(data.error || `Failed to ${activeTab} the model.`);
      }

      const reader = initialResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const response: CreateModelResponse | PullModelResponse =
                JSON.parse(line);
              setLogs((prevLogs) => [...prevLogs, response.status]);

              if (response.status === 'success') {
                setSuccess(getSuccessMessage());
                done = true;
                break;
              }
            } catch (parseError: unknown) {
              if (parseError instanceof Error) {
                setError(parseError.message);
                done = true;
              }
            }
          }
        }
      }

      // Remaining data in the buffer
      if (buffer.trim()) {
        try {
          const response: CreateModelResponse | PullModelResponse =
            JSON.parse(buffer);
          setLogs((prevLogs) => [...prevLogs, response.status]);

          if (response.status === 'success') {
            setSuccess(getSuccessMessage());
          }
        } catch (parseError: unknown) {
          if (parseError instanceof Error) {
            setError(parseError.message);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendDeleteRequest = async (body: DeleteModelRequest) => {
    setLoading(true);
    clearValues();
    try {
      const response = await fetch('/api/models', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        await refreshToken();
        return sendDeleteRequest(body);
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete the model.');
      }

      setSuccess(getSuccessMessage());
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    };
  };

  const createModel = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: CreateModelRequest = {
      model: createModelNameRef.current!.value.trim(),
      modelfile: createModelfileRef.current!.value.trim(),
    };
    await sendStreamedRequest(body);
  };

  const pullModel = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: PullModelRequest = {
      model: pullModelNameRef.current!.value.trim(),
    };
    await sendStreamedRequest(body);
  };

  const deleteModel = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: DeleteModelRequest = {
      model: deleteModelNameRef.current!.value.trim(),
    };
    await sendDeleteRequest(body);
  };
  
  const getSuccessMessage = () => {
    switch (activeTab) {
      case 'create':
        return 'Model created successfully';
      case 'pull':
        return 'Model pulled successfully';
      case 'delete':
        return 'Model deleted successfully';
      default:
        return 'Operation successful';
    }
  }

  const getButtonLabel = () => {
    const getText = () => {
      switch (activeTab) {
        case 'create':
          return loading ? 'Creating' : 'Create Model';
        case 'pull':
          return loading ? 'Pulling' : 'Pull Model';
        case 'delete':
          return loading ? 'Deleting' : 'Delete Model';
        default:
          return loading ? 'Processing' : 'Submit';
      }
    }
    return (loading ?
      <div className='flex justify-center items-center gap-2'>
        <Spinner width='1' height='1' />
        {getText()}
      </div>
      :
      getText()
    );
  };

  const createSubmitButton = () => {
    return (
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-primaryColor text-white py-2 rounded-md hover:opacity-80 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {getButtonLabel()}
      </button>
    )
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between">
          {tabOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTabChange(option.value)}
              className={`py-2 px-4
                ${activeTab === option.value
                  ? 'border-b-2 border-primaryColor text-primaryColor'
                  : 'text-gray-500 dark:text-gray-300'
                }
                ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`
              }
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
                <label className="block mb-2">Model Name</label>
                <input
                  type="text"
                  autoFocus
                  ref={createModelNameRef}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Modelfile</label>
                <textarea
                  ref={createModelfileRef}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                ></textarea>
              </div>
              {createSubmitButton()}
            </form>
          </div>
        )}

        {activeTab === 'pull' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Pull Model</h2>
            <form onSubmit={pullModel}>
              <div className="mb-4">
                <label className="block mb-2">Model Name</label>
                <input
                  type="text"
                  autoFocus
                  ref={pullModelNameRef}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>
              {createSubmitButton()}
            </form>
          </div>
        )}

        {activeTab === 'delete' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Delete Model</h2>
            <form onSubmit={deleteModel}>
              <div className="mb-4">
                <label className="block mb-2">Model Name</label>
                <input
                  type="text"
                  autoFocus
                  ref={deleteModelNameRef}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>
              {createSubmitButton()}
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
    </>
  );
}
