import { useAuth } from "@/contexts/AuthContext";
import { useModel } from "@/contexts/ModelContext";
import { ListModelResponse } from "@/types/model";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function ChatHeader() {
  const { user, signOut } = useAuth();
  const { selectedModel, setSelectedModel } = useModel();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<ListModelResponse>({ models: [] });
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const toggleModelDropdown = () => {
    fetchModels();
    setModelDropdownOpen(!modelDropdownOpen);
  }

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
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
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(event.target as Node)
    ) {
      setUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-row p-2 pt-3 justify-between m-auto items-center w-11/12">
      <div className="relative" ref={modelDropdownRef}>
        <button onClick={toggleModelDropdown} className="flex flex-row items-center gap-1 rounded-md p-2 hover:bg-slate-800">
          <span className="font-bold text-xl">{selectedModel}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {modelDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            {availableModels.models.map((model, index) => (
              <button
                key={index}
                onClick={() => selectModel(model.name)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {model.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative" ref={userDropdownRef}>
        <button onClick={toggleUserDropdown} className="flex flex-row rounded-md p-2 items-center gap-2 hover:bg-slate-800">
          <Image className="rounded-full" src={user!.photoURL!} alt={`${user!.displayName}'s avatar`} width={30} height={30} />
          <h1>{user!.displayName}</h1>
        </button>
        {userDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              onClick={signOut}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 10v1m0-10V5"></path>
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )

}