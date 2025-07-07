"use client";

import { useState, useEffect, useRef } from "react";

import {Button} from "@/components/ui/button"

import { useRouter } from "next/navigation";

import {Typewriter} from "react-simple-typewriter"

export default function FollowUpPage() {
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const context = typeof window !== "undefined" ? localStorage.getItem("digestai_response") : "";

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendQuestion = async () => {
    if (!question.trim() || !context) return;

    setLoading(true);
    try {
      const res = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });

      const data = await res.json();

      setChatHistory((prev) => [...prev, { question, answer: data.answer }]);
      setQuestion("");
    } catch (err) {
      console.error("Follow-up error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">💬 Ask DigestAI a Follow-Up</h1>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {chatHistory.map((msg, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded shadow">
            <p className="font-semibold text-gray-700 mb-1">You:</p>
            <p>{msg.question}</p>
            <p className="font-semibold text-green-700 mt-3 mb-1">DigestAI:</p>
          <Typewriter
          words={[msg.answer.replace(/\*\*/g, "")]}
          typeSpeed={20}
          deleteSpeed={0}
          delaySpeed={100000} // effectively disables delete
          loop={false}
          cursor
          cursorStyle="|"
          
          
          />

          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      <div className="flex gap-2 pt-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded p-2"
          placeholder="Type your follow-up question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={sendQuestion}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div>
        <Button  onClick={() => router.push("/results")}>Back to Response</Button>

      </div>
    </div>
  );
}
