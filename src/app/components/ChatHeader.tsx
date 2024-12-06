import { useModel } from "@/contexts/ModelContext";
import { AllModelsResponse } from "@/types/model";
import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import ModelInfoModal from "./ModelInfoModal";
import Spinner from "./Spinner";

export default function ChatHeader() {
  const { selectedModel, setSelectedModel } = useModel();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModelInfoModalOpen, setIsModelInfoModalOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<AllModelsResponse>({ models: [] });
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const openModelDropdown = async () => {
    setLoading(true);
    await fetchAllModels();
    await fetchActiveModels();
    setModelDropdownOpen(true);
    setLoading(false);
  }

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
  }

  const fetchAllModels = async () => {
    await fetch("/api/models/all")
    .then(response => response.json())
    .then((data: AllModelsResponse) => setAvailableModels(data))
    .catch(error => console.error(error));
  }

  const fetchActiveModels = async () => {
    await fetch("/api/models/active")
    .then(response => response.json())
    .then((data: AllModelsResponse) => {
      setActiveModels(data.models.map(model => model.name));
    })
    .catch(error => console.error(error));
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
        <div className="flex flex-row items-center">
          <div className={`size-6 ${loading ? "block" : "hidden"}`}>
            <Spinner />
          </div>
          
          <button onClick={() => setIsModelInfoModalOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>
          
          <button onClick={openModelDropdown} className="flex flex-row text-black hover:opacity-80 items-center gap-1 p-2">
            <span className="font-semibold text-lg">{selectedModel}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        {modelDropdownOpen && (
          <div className="absolute top-full right-0 w-40 rounded-md shadow-lg z-10 bg-gray-100">
            {availableModels.models.map((model, index) => (
              <button
                key={index}
                onClick={() => selectModel(model.name)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-secondaryColor hover:bg-gray-200 hover:rounded-md">
                {activeModels.includes(model.name)  && (
                  <div className="mr-2 h-2 w-2 bg-green-500 rounded-full"></div>
                )}
                <span className="flex-1 truncate">{model.name}</span>
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
  )

}