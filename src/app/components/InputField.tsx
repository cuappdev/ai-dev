import { useModel } from '@/contexts/ModelContext';
import { useState, useRef, FormEvent } from 'react';
import { FileComponent } from '@/types/chat';
import { toast } from 'react-toastify';
import Toast from './Toast';
import Image from 'next/image';

interface InputFieldProps {
  onSubmit: (message: string, files: FileComponent[]) => void;
  onAbort: () => void;
  messageStreaming: boolean;
}

export default function InputField({ onSubmit, onAbort, messageStreaming }: InputFieldProps) {
  const { selectedModel } = useModel();
  const [files, setFiles] = useState<FileComponent[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = textareaRef.current?.value.trim();
    if (!message || messageStreaming) return;
    onSubmit(message, files);
    textareaRef.current!.value = '';
    setFiles([]);
    resetTextareaHeight();
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const base64 = await toBase64(file);
      console.log(base64);
      if (files.find((f) => f.name === file.name)) {
        toast.error('Cannot upload duplicate files');
        continue;
      }

      setFiles((prevFiles) => [
        ...prevFiles,
        {
          name: file.name,
          base64: base64 as string,
          extension: file.name.split('.').pop() as string,
        },
      ]);
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <form
        onSubmit={handleSubmit}
        className="m-auto w-5/6 rounded-lg border border-secondaryColor bg-white px-4 py-2 shadow-sm"
      >
        {/* TODO: If '.png,.jpg,.jpeg,.heif', display image */}
        <div className="flex gap-2">
          {files.map((file, index) => (
            <div key={index}>
              <div className="relative mb-5 mt-1 h-12 w-12 rounded-lg">
                <Image src={file.base64} alt={file.name} layout="fill" objectFit="cover" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
                  }}
                  className="absolute -right-2 -top-2 rounded-full border border-black bg-white hover:opacity-60"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <textarea
            autoFocus
            ref={textareaRef}
            onChange={autoResizeTextarea}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedModel}`}
            className="max-h-[150px] flex-1 resize-none border-none text-gray-700 placeholder-gray-400 outline-none"
            rows={1}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            className="ml-3 mr-3 text-black hover:opacity-60"
          >
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
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              />
            </svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          {messageStreaming ? (
            // TODO: Handle aborting message streaming

            <button className="ml-3" onClick={() => onAbort()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-primaryColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                />
              </svg>
            </button>
          ) : (
            <button type="submit" className="ml-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-primaryColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          )}
        </div>
      </form>
      <span className="m-auto w-4/6 text-center text-xs text-gray-500">
        LLMs can make mistakes. Check important info. View the source code{' '}
        <a
          className="text-primaryColor"
          target="_blank"
          href={'https://github.com/cuappdev/ai-dev'}
        >
          here
        </a>
        .
      </span>
      <Toast />
    </div>
  );
}
