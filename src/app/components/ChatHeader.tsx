import { useModel } from "@/contexts/ModelContext";
import { ListModelResponse } from "@/types/model";
import { useState, useEffect, useRef } from "react";

export default function ChatHeader() {
  const { selectedModel, setSelectedModel } = useModel();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<ListModelResponse>({ models: [
    { name: "model1",
      model: "model1",
      modified_at: "2021-09-01T00:00:00Z",
      size: 1000,
      digest: "1234567890abcdef",
      details: {
        parent_model: "model0",
        format: "onnx",
        family: "transformers",
        families: ["transformers"],
        parameter_size: "1000",
        quantization_level: "0",
      },
     },
  ] });
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const toggleModelDropdown = () => {
    fetchModels();
    setModelDropdownOpen(!modelDropdownOpen);
  }

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
  }

  const fetchModels = async () => {
    const response = await fetch("/api/models/list");
    const data = await response.json();
    setAvailableModels(data);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      modelDropdownRef.current &&
      !modelDropdownRef.current.contains(event.target as Node)
    ) {
      setModelDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-row pt-3 justify-end items-center w-11/12 m-auto">
      <div className="relative" ref={modelDropdownRef}>
        <button onClick={toggleModelDropdown} className="flex flex-row text-black hover:opacity-80 items-center gap-1 p-2">
          <span className="font-semibold text-lg">{selectedModel}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {modelDropdownOpen && (
          <div className="absolute top-full right-0 w-full max-w-xs rounded-md shadow-lg z-10 bg-gray-100">
            {availableModels.models.map((model, index) => (
              <button
                key={index}
                onClick={() => selectModel(model.name)}
                className="block w-full text-left px-4 py-2 text-sm text-secondaryColor hover:bg-gray-200 hover:rounded-md">
                {model.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

}