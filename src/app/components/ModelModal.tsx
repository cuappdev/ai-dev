import { CreateModelRequest, CreateModelResponse, PullModelRequest, PullModelResponse } from '@/types/model';
import { useState, useRef } from 'react';

type TabOption = 'create' | 'pull' | 'delete';

interface TabOptionConfig {
  value: TabOption;
  label: string;
}

const tabOptions: TabOptionConfig[] = [
  { value: 'create', label: 'Create Model' },
  { value: 'pull', label: 'Pull Model' },
  { value: 'delete', label: 'Delete Model' }
];

export default function ModelModal() {
  const [activeTab, setActiveTab] = useState<TabOption>('create');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const createModelNameRef = useRef<HTMLInputElement>(null);
  const createModelfileRef = useRef<HTMLTextAreaElement>(null);
  const pullModelNameRef = useRef<HTMLInputElement>(null);
  const deleteModelNameRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: TabOption) => {
    setActiveTab(tab);
    setLoading(false);
    setSuccess(null);
    setError(null);
    setLogs([]);
  }

  const sendStreamedRequest = async (body: CreateModelRequest | PullModelRequest, option: TabOption) => {
    if (loading) return;
    
    setSuccess(null);
    setError(null);
    setLogs([]);
    try {
      const initialResponse = await fetch(`/api/models/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!initialResponse.ok || !initialResponse.body) {
        const data = await initialResponse.json();
        throw new Error(data.error || `Failed to ${option} the model.`);
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
              const response: CreateModelResponse | PullModelResponse = JSON.parse(line);
              setLogs((prevLogs) => [...prevLogs, response.status]);

              if (response.status === 'success') {
                setSuccess('Operation successful');
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
          const response: CreateModelResponse | PullModelResponse = JSON.parse(buffer);
          setLogs((prevLogs) => [...prevLogs, response.status]);

          if (response.status === 'success') {
            setSuccess('Operation successful');
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
    }
  };

  const createModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const model = createModelNameRef.current!.value.trim();
    const modelfile = createModelfileRef.current!.value.trim();

    if (!model || !modelfile) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const body: CreateModelRequest = {
      model: model,
      modelfile: modelfile
    };

    await sendStreamedRequest(body, 'create');
    setLoading(false);
  };

  const pullModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const model = pullModelNameRef.current!.value.trim();

    if (!model) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const body: PullModelRequest = {
      model: model
    };

    await sendStreamedRequest(body, 'pull');
    setLoading(false);
  };

  const deleteModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
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
      setSuccess('Operation successful');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = () => {
    switch (activeTab) {
      case 'create':
        return (loading ? 'Creating...' : 'Create Model');
      case 'pull':
        return (loading ? 'Pulling...' : 'Pull Model');
      case 'delete':
        return (loading ? 'Deleting...' : 'Delete Model');
      default:
        return (loading ? 'Processing...' : 'Submit');
    }
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between">
          {tabOptions.map((option) => (
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
                className={`w-full bg-primaryColor text-white py-2 rounded-md hover:opacity-80 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                className={`w-full bg-primaryColor text-white py-2 rounded-md hover:opacity-80 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                className={`w-full bg-primaryColor text-white py-2 rounded-md hover:opacity-80 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    </>
  );
};
