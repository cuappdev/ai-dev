import { useEffect, useState } from 'react';
import { useModel } from '@/contexts/ModelContext';
import { ModelInfoResponse } from '@/types/model';
import Spinner from './Spinner';

export default function ModelInfoModal() {
  const { selectedModel } = useModel();
  const [modelData, setModelData] = useState<ModelInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`/api/models/show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: selectedModel }),
      })
        .then((res) => res.json())
        .then((data: ModelInfoResponse) => {
          setModelData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError((error as Error).message);
        });
    };
    fetchData();
  }, []);

  const printModelData = (
    modelData: ModelInfoResponse
  ): (JSX.Element | string)[] => {
    if (!modelData) {
      return [];
    }
    return Object.entries(modelData).flatMap(([key, value]) => {
      if (typeof value === 'object') {
        return (
          <div key={key}>
            <span className="font-semibold">{key}</span>:{' '}
            {printModelData(value)}
          </div>
        );
      } else {
        return (
          <div key={key}>
            <span className="font-semibold">{key}</span>: {value}
          </div>
        );
      }
    });
  };

  if (loading) {
    return <Spinner width='4' height='4' />;
  }

  return (
    <>
      <span className="font-semibold text-3xl">{selectedModel} Info</span>
      {modelData ? <h2>{modelData.model}</h2> : <h2>No model data</h2>}
      <pre className="max-h-72 overflow-y-auto mt-2">
        {modelData && printModelData(modelData)}
      </pre>
      {error && <span className="text-red-500">{error}</span>}
    </>
  );
}
