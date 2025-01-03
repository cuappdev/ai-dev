import {
  CreateModelRequest,
  CreateModelResponse,
  DeleteModelRequest,
  PullModelRequest,
  PullModelResponse,
} from '@/types/model';
import { useState, useRef, useEffect } from 'react';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import Toast from '../Toast';

export interface ModelModalProps {
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
  const [activeTab, setActiveTab] = useState<TabOption>('create');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const createModelNameRef = useRef<HTMLInputElement>(null);
  const createModelfileRef = useRef<HTMLTextAreaElement>(null);
  const pullModelNameRef = useRef<HTMLInputElement>(null);
  const deleteModelNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);

  const clearValues = () => {
    setSuccess(null);
    setError(null);
    setLogs([]);
  };

  const handleTabChange = (tab: TabOption) => {
    if (loading) return;
    setActiveTab(tab);
    clearValues();
  };

  const sendStreamedRequest = async (body: CreateModelRequest | PullModelRequest) => {
    setLoading(true);
    clearValues();
    try {
      const initialResponse = await fetchRequest(body);
      const reader = initialResponse.body?.getReader();
      if (!reader) throw new Error('Failed to get reader from response body');

      await processStream(reader);
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequest = async (body: CreateModelRequest | PullModelRequest) => {
    const response = await fetch(`/api/models/${activeTab}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      const data = await response.json();
      throw new Error(data.error || `Failed to ${activeTab} the model`);
    }

    return response;
  };

  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
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
            const response: CreateModelResponse | PullModelResponse = JSON.parse(line);
            setLogs((prevLogs) => [...prevLogs, response.status]);

            if (response.status === 'success') {
              setSuccess(getSuccessMessage());
              done = true;
              break;
            }
          } catch (parseError: unknown) {
            handleError(parseError);
            done = true;
          }
        }
      }
    }

    if (buffer.trim()) {
      try {
        const response: CreateModelResponse | PullModelResponse = JSON.parse(buffer);
        setLogs((prevLogs) => [...prevLogs, response.status]);

        if (response.status === 'success') {
          setSuccess(getSuccessMessage());
        }
      } catch (parseError: unknown) {
        handleError(parseError);
      }
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
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
        },
        body: JSON.stringify(body),
      });

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
    }
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
  };

  const getButtonLabel = () => {
    const getText = () => {
      switch (activeTab) {
        case 'create':
          return loading ? 'Creating...' : 'Create Model';
        case 'pull':
          return loading ? 'Pulling...' : 'Pull Model';
        case 'delete':
          return loading ? 'Deleting...' : 'Delete Model';
        default:
          return loading ? 'Processing...' : 'Submit';
      }
    };
    return loading ? (
      <div className="flex items-center justify-center gap-2">
        <Spinner width="1" height="1" />
        {getText()}
      </div>
    ) : (
      getText()
    );
  };

  const createSubmitButton = () => {
    return (
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-md bg-primaryColor py-2 text-white hover:opacity-80 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {getButtonLabel()}
      </button>
    );
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between">
          {tabOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTabChange(option.value)}
              className={`px-4 py-2 ${
                activeTab === option.value
                  ? 'border-b-2 border-primaryColor text-primaryColor'
                  : 'text-gray-500 dark:text-gray-300'
              } ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'create' && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Create a New Model</h2>
            <form onSubmit={createModel}>
              <div className="mb-4">
                <label className="mb-2 block">Model Name</label>
                <input
                  type="text"
                  autoFocus
                  ref={createModelNameRef}
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block">Modelfile</label>
                <textarea
                  ref={createModelfileRef}
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none"
                ></textarea>
              </div>
              {createSubmitButton()}
            </form>
          </div>
        )}

        {activeTab === 'pull' && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Pull Model</h2>
            <form onSubmit={pullModel}>
              <div className="mb-4">
                <label className="mb-2 block">Model Name</label>
                <input
                  type="text"
                  autoFocus
                  ref={pullModelNameRef}
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none"
                />
              </div>
              {createSubmitButton()}
            </form>
          </div>
        )}

        {activeTab === 'delete' && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Delete Model</h2>
            <form onSubmit={deleteModel}>
              <div className="mb-4">
                <label className="mb-2 block">Model Name</label>
                <input
                  type="text"
                  autoFocus
                  ref={deleteModelNameRef}
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none"
                />
              </div>
              {createSubmitButton()}
            </form>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-4 max-h-60 overflow-y-auto rounded-md bg-black p-4 font-mono text-white">
            <h3 className="mb-2 text-lg font-semibold">Logs</h3>
            <ul className="list-none space-y-1">
              {logs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </div>
        )}
        <Toast />
      </div>
    </>
  );
}
