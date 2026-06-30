"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";

// Suggestion options to guide user queries
const SUGGESTIONS = [
  "Pricing for Single Bed plans",
  "How do you clean the sheets?",
  "Tell me about the monthly swaps",
  "Can I cancel or pause anytime?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! 🙏 I'm **Rushy**, your ClosetRush assistant. Ask me anything about our premium bedding rental plans, clean sheets washing standards, or how monthly delivery swaps work!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unread, setUnread] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto scroll to the bottom of the message container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (unread) {
        setUnread(false);
      }
    }
  }, [messages, isOpen]);

  // Handle opening/closing the chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnread(false);
    }
  };

  // Process sending a user message
  const handleSendMessage = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    // Add user message to conversation list
    const updatedMessages = [...messages, { role: "user", content: trimmedText }];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // API request to next.js backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to receive response from assistant.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Simple Markdown-like Renderer for bold formatting, backticks, and bullet points
  const renderMessageContent = (text) => {
    if (!text) return "";

    // Escape HTML tags to prevent XSS
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Format bold markdown **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>');
    
    // Format inline code/tags \`text\`
    escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-linen-gold/5 px-1 py-0.5 rounded text-linen-gold font-mono text-xs border border-linen-gold/10">$1</code>');

    // Split text into lines to process lists
    const lines = escaped.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-1">
            <span className="text-linen-gold mt-1.5 font-bold text-xs leading-none">•</span>
            <span
              className="text-xs sm:text-sm text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: trimmed.substring(2) }}
            />
          </div>
        );
      }
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2 last:mb-0"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          aria-label="Open support chat"
          className="relative group w-14 h-14 rounded-none bg-linen-gold hover:bg-linen-gold/90 text-charcoal-ink flex items-center justify-center shadow-xl hover:shadow-linen-gold/20 active:scale-95 transition-all duration-300 hover:rotate-3"
        >
          {/* Pulsing notification indicator */}
          {unread && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-none h-4 w-4 bg-red-500 text-[9px] text-white font-black items-center justify-center">
                1
              </span>
            </span>
          )}
          {/* Animated pulsing glow */}
          <div className="absolute inset-0 bg-linen-gold rounded-none scale-100 opacity-0 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300 -z-10" />
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Main Chat Dialog Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] sm:h-[600px] bg-white/95 backdrop-blur-md rounded-none border border-charcoal-ink/08 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Chat Window Header */}
          <div className="bg-charcoal-ink text-alabaster-linen p-4 flex items-center justify-between border-b border-charcoal-ink/20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-none bg-linen-gold/20 border border-linen-gold/40 flex items-center justify-center text-linen-gold">
                <Sparkles className="w-5 h-5 fill-current animate-pulse" />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-charcoal-ink" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight leading-none mb-1">
                  Rushy
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  Sleep Assistant • <span className="text-emerald-400">Online</span>
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat History Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-none ${
                      isAssistant
                        ? "bg-alabaster-linen border border-charcoal-ink/05 text-charcoal-ink rounded-tl-sm shadow-sm"
                        : "bg-linen-gold text-charcoal-ink rounded-tr-sm shadow-md"
                    }`}
                  >
                    {isAssistant ? (
                      renderMessageContent(msg.content)
                    ) : (
                      <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading / Generating response state */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-alabaster-linen border border-charcoal-ink/05 p-3.5 rounded-none flex items-center gap-2 text-charcoal-ink/50 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-linen-gold" />
                  <span className="text-2xs sm:text-xs font-bold tracking-wide uppercase">
                    Rushy is writing...
                  </span>
                </div>
              </div>
            )}

            {/* Error Message banner inside chat window */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-none p-3 flex flex-col gap-2 text-rose-800 text-xs shadow-sm">
                <p className="font-semibold">{error}</p>
                <button
                  onClick={() => handleSendMessage(messages[messages.length - 1].content)}
                  className="flex items-center gap-1.5 text-linen-gold font-bold hover:underline w-fit self-end cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Suggestion Chips */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 border-t border-charcoal-ink/05 bg-alabaster-linen/50 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-2.5 py-1 text-[10px] sm:text-xs font-bold text-charcoal-ink/60 bg-white border border-charcoal-ink/08 rounded-none hover:border-linen-gold hover:text-linen-gold transition-all duration-200 shadow-2xs hover:scale-[1.02] cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Form Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-charcoal-ink/05 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Rushy a question..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-alabaster-linen border border-charcoal-ink/08 rounded-none focus:outline-none focus:border-linen-gold focus:bg-white text-xs sm:text-sm text-charcoal-ink placeholder-charcoal-ink/30 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-none bg-linen-gold hover:bg-linen-gold/90 text-charcoal-ink flex items-center justify-center transition-colors shadow-md shadow-linen-gold/10 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
