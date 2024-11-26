export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5 border-r border-gray-300 p-4 overflow-y-auto">
        {/* Historic chats content */}
        <h2 className="text-xl font-bold mb-4">Historic Chats</h2>
        <ul>
          <li className="mb-2">Chat 1</li>
          <li className="mb-2">Chat 2</li>
          <li className="mb-2">Chat 3</li>
        </ul>
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        {/* Chat window content */}
        <h2 className="text-xl font-bold mb-4">Chat Window</h2>
        <div className="flex-grow overflow-y-auto mb-4">
          <div className="mb-2">
            <p className="font-semibold">User:</p>
            <p>Hi</p>
          </div>
          <div className="mb-2">
            <p className="font-semibold">Bot:</p>
            <p>Hello! How can I help you today?</p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
}
