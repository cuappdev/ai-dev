import Image from 'next/image';
import copyTextToClipboard from '@/app/utils/chatUtils';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    copyTextToClipboard(message.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const getName = () => {
    if (message.sender === 'user') {
      return user!.displayName!.split(' ')[0];
    }
    return message.sender;
  };

  const getImage = () => {
    const lowercaseSender = message.sender.toLowerCase();
    if (lowercaseSender.includes('user')) {
      return user!.photoURL!;
    } else if (lowercaseSender.includes('eatery')) {
      return '/eatery.png';
    } else if (lowercaseSender.includes('resell')) {
      return '/resell.png';
    } else if (lowercaseSender.includes('transit')) {
      return '/transit.png';
    } else if (lowercaseSender.includes('uplift')) {
      return '/uplift.png';
    } else if (lowercaseSender.includes('mario')) {
      return '/mario.png';
    } else {
      return '/ollama.png';
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <Image
        src={getImage()}
        width={40}
        height={40}
        alt={message.sender}
        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col overflow-auto">
        <span className="text-lg font-semibold">{getName()}</span>
        <div className="flex flex-row gap-1">
          <span className="text-xs text-gray-400">{message.timestamp}</span>
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 text-green-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg
              onClick={handleCopyClick}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 text-gray-400 hover:cursor-pointer hover:text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          )}
        </div>
        <ReactMarkdown
          className={'whitespace-pre-line'}
          remarkPlugins={[remarkGfm]}
          components={{
            code({
              inline,
              className,
              children,
              ...props
            }: {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
