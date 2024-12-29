import ChatMenuNavbar from './chat/ChatMenuNavbar';
import ChatHeader from './chat/ChatHeader';
import InputField from './InputField';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { FileComponent } from '@/types/chat';
import Toast from './Toast';
import { toast } from 'react-toastify';

export default function InitialChatPage() {
  const { user } = useAuth();
  const firstName = user!.displayName!.split(' ')[0];
  const router = useRouter();

  const createChat = async (chatId: string, message: string, files: FileComponent[]) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'POST',
        body: JSON.stringify({
          content: message,
          images: files,
          timestamp: new Date(),
          sender: 'user',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      router.push(`/chat/${chatId}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleInitialSendMessage = async (message: string, files: FileComponent[]) => {
    const chatId = uuidv4();
    await createChat(chatId, message, files);
  };

  return (
    <>
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

          <InputField onSubmit={handleInitialSendMessage} messageStreaming={false} />
        </div>
      </div>
      <Toast />
    </>
  );
}
