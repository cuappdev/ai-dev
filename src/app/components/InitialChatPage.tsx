import ChatMenuNavbar from './chat/ChatMenuNavbar';
import ChatHeader from './chat/ChatHeader';
import InputField from './InputField';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { FileComponent } from '@/types/chat';

export default function InitialChatPage() {
  const { user } = useAuth();
  const firstName = user!.displayName!.split(' ')[0];
  const router = useRouter();

  const createChat = async (uuid: string, message: string, files: FileComponent[]) => {
    const response = await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: uuid,
        summary: message,
        message: {
          content: message,
          images: files,
          sender: 'user',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }
  };

  const handleInitialSendMessage = async (message: string, files: FileComponent[]) => {
    const chatId = uuidv4();
    await createChat(chatId, message, files);
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="flex h-svh flex-row gap-0">
      <ChatMenuNavbar />

      <div className="flex w-full flex-col">
        <ChatHeader />
        <div className="m-auto mt-10 flex w-4/5 flex-grow flex-col gap-3">
          <span className="text-7xl font-semibold">{`Hello, ${firstName}`}</span>
          <span className="text-3xl font-semibold text-primaryColor">
            How can I help you today?
          </span>
        </div>

        <div className="mb-5">
          <InputField onSubmit={handleInitialSendMessage} messageStreaming={false} />
        </div>
      </div>
    </div>
  );
}
