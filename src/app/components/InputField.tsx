import { useModel } from '@/contexts/ModelContext';
import { useState, useRef, FormEvent } from 'react';

interface InputFieldProps {
  onSubmit: (message: string) => void;
  messageStreaming: boolean;
}

export default function InputField({ onSubmit, messageStreaming }: InputFieldProps) {
  const { selectedModel } = useModel();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    if (message.trim() === '' || messageStreaming) return;
    e.preventDefault();
    onSubmit(message.trim());
    setMessage('');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex w-4/6 items-center rounded-lg border border-secondaryColor bg-white px-4 py-2 shadow-sm"
    >
      {/* // TODO: Implement file upload */}
      {/* <button className="mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-black">
          <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
        </svg>
      </button> */}

      <textarea
        autoFocus
        ref={textareaRef}
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={`Message ${selectedModel}`}
        className="max-h-[150px] flex-1 resize-none border-none text-gray-700 placeholder-gray-400 outline-none"
        rows={1}
      />

      <button type="submit" className="ml-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`size-6 text-primaryColor ${message.trim().length === 0 ? 'opacity-60' : ''}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </form>
  );
}
