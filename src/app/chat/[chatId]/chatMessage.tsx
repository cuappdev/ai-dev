import { useEffect, useState } from "react";

export default function ChatMessage() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("/api/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt: "Why is the sky blue",
        stream: false
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
      // .then((data) => setData(data));
      setData("Hi");
  }, []);

  return (
    <div>
      <h1>Chat Message</h1>
      <p>Message: {data}</p>
    </div>
  );
}
