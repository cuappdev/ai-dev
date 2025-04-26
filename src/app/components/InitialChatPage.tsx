import ChatMenu from './chat/ChatMenu';
import ChatHeader from './chat/ChatHeader';
import InputField from './InputField';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { FileComponent } from '@/types/chat';
import Toast from './Toast';

export default function InitialChatPage() {
  const { user } = useAuth();
  const firstName = user!.displayName!.split(' ')[0];
  const router = useRouter();

  const handleInitialSendMessage = async (message: string, files: FileComponent[]) => {
    const chatId = uuidv4();
    localStorage.setItem('initialMessage', message);
    router.push(`/chat/${chatId}`);
  };

  return (
    <>
      <div className="flex h-svh flex-row gap-0">
        <ChatMenu />

        <div className="flex w-full flex-col">
          <ChatHeader />
          <div className="m-auto mt-10 flex w-4/5 flex-grow flex-col gap-3">
            <span className="text-7xl font-semibold">{`Hello, ${firstName}`}</span>
            <span className="text-3xl font-semibold text-primaryColor">
              How can I help you today?
            </span>
          </div>

          <InputField
            onSubmit={handleInitialSendMessage}
            onAbort={() => {}}
            messageStreaming={false}
          />
        </div>
      </div>
      <Toast />
    </>
  );
}
