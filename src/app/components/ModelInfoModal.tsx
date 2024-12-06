import { useEffect, useState } from "react";
import { useModel } from "@/contexts/ModelContext";
import { ModelInfoResponse } from "@/types/model";
import Spinner from "./Spinner";

export default function ModelInfoModal() {
  const { selectedModel } = useModel();
  const [modelData, setModelData] = useState<ModelInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [flattened, setFlattened] = useState<Record<string, string>>({});

  const flattenJSON = (json: Record<string, string>, parentKey = '') => {
    const flattened: Record<string, string> = {};
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof json[key] === 'object' && json[key] !== null) {
          Object.assign(flattened, flattenJSON(json[key], newKey));
        } else {
          flattened[newKey] = json[key];
        }
      }
    }
    return flattened;
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`/api/models/show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: selectedModel })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setModelData(data);
          setLoading(false);
          setFlattened(flattenJSON(data));
      }).catch((error) => {
        console.error(error);
      })
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Spinner />
    )
  }


  return (
    <>
      <h1>Modal</h1>
      {modelData ? <h2>{modelData.model}</h2> : <h2>No model data</h2>}
      <pre>
        {JSON.stringify(flattened, null, 2)}
      </pre>
    </>
  );
}