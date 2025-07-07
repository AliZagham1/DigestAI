// components/ChatMessage.tsx

"use client";

import Typewriter from "typewriter-effect";

export default function ChatMessage({ message }: { message: string }) {
  return (
    <div className="bg-gray-100 p-4 rounded-md shadow">
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString(message.replace(/\*\*/g, "")) 
            .pauseFor(2000)
            .start();
        }}
        options={{
          delay: 25,
          cursor: "|",
          autoStart: false,
        }}
      />
    </div>
  );
}
