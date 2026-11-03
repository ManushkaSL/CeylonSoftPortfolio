import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Volume2, VolumeX, Sparkles, Trash2, MessageSquare, Bot } from "lucide-react";
import { PixelEmotion, PixelChatMessage } from "@/types/pixel";
import { PixelCharacter } from "./PixelCharacter";
import { pixelAudio } from "@/utils/pixelAudio";
import { generateLocalPixelReply } from "@/utils/pixelKnowledge";

interface PixelChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPixelEmotionChange?: (emotion: PixelEmotion) => void;
  spontaneousEnabled: boolean;
  onToggleSpontaneous: () => void;
}

const INITIAL_MESSAGES: PixelChatMessage[] = [
  {
    id: "welcome-1",
    sender: "pixel",
    text: "Hehe, hi there! 🤖✨ I'm Pixel! Ask me anything about Manushka's projects, tech stack, or creative engineering!",
    emotion: "happy",
    timestamp: Date.now(),
  },
];

const QUICK_PROMPTS = [
  "Who is Manushka?",
  "Tell me about PulseSetter",
  "What tech stack does he use?",
  "Tell me a tech joke",
];

export const PixelChatPanel: React.FC<PixelChatPanelProps> = ({
  isOpen,
  onClose,
  onPixelEmotionChange,
  spontaneousEnabled,
  onToggleSpontaneous,
}) => {
  const [messages, setMessages] = useState<PixelChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [soundOn, setSoundOn] = useState(pixelAudio.getSoundEnabled());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
      pixelAudio.play("happy");
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleToggleSound = () => {
    const next = pixelAudio.toggleSound();
    setSoundOn(next);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: String(Date.now()),
        sender: "pixel",
        text: "Clean slate! What would you like to explore next?",
        emotion: "curious",
        timestamp: Date.now(),
      },
    ]);
    pixelAudio.play("pop");
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isThinking) return;

    setInputValue("");
    const userMsg: PixelChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    onPixelEmotionChange?.("thinking");
    pixelAudio.play("thinking");

    try {
      // 1. Try secure backend endpoint
      const response = await fetch("/api/pixel/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data = await response.json();
        const emotion: PixelEmotion = data.emotion || "happy";

        setMessages((prev) => [
          ...prev,
          {
            id: `pixel-${Date.now()}`,
            sender: "pixel",
            text: data.message,
            emotion,
            timestamp: Date.now(),
          },
        ]);

        onPixelEmotionChange?.(emotion);
        pixelAudio.play(emotion === "excited" ? "excited" : "happy");
      } else {
        throw new Error("API call failed");
      }
    } catch {
      // 2. Resilient local knowledge fallback
      const fallback = generateLocalPixelReply(text);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `pixel-${Date.now()}`,
            sender: "pixel",
            text: fallback.message,
            emotion: fallback.emotion,
            timestamp: Date.now(),
          },
        ]);

        onPixelEmotionChange?.(fallback.emotion);
        pixelAudio.play(fallback.emotion === "excited" ? "excited" : "happy");
      }, 500);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="pixel-chat-panel"
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed left-[64px] top-1/2 -translate-y-1/2 w-[340px] sm:w-[390px] h-[520px] max-h-[85vh] z-[120] flex flex-col rounded-2xl bg-[#020817]/95 backdrop-blur-2xl border border-cyan-400/35 shadow-[0_15px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(0,238,255,0.18)] overflow-hidden"
          role="dialog"
          aria-label="Pixel AI Chat Companion"
        >
          {/* ── TOP HEADER ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-cyan-950/40">
            <div className="flex items-center gap-2.5">
              <PixelCharacter emotion={isThinking ? "thinking" : "happy"} size={32} />
              <div>
                <div className="flex items-center gap-1.5 text-white font-medium text-xs tracking-wide">
                  <span>PIXEL AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] font-mono text-cyan-300/70">
                  PORTFOLIO COMPANION
                </div>
              </div>
            </div>

            {/* Header Control Icons */}
            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className={`p-1.5 rounded-lg border transition-colors ${soundOn
                  ? "text-cyan-300 border-cyan-400/40 bg-cyan-950/60"
                  : "text-slate-400 border-transparent hover:text-white"
                  }`}
                title={soundOn ? "Mute cartoon sounds" : "Enable cartoon sounds"}
                aria-label="Toggle cartoon sounds"
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Spontaneous Messages Toggle */}
              <button
                onClick={onToggleSpontaneous}
                className={`p-1.5 rounded-lg border transition-colors ${spontaneousEnabled
                  ? "text-amber-300 border-amber-400/40 bg-amber-950/40"
                  : "text-slate-400 border-transparent hover:text-white"
                  }`}
                title={spontaneousEnabled ? "Mute spontaneous speech bubbles" : "Enable spontaneous speech bubbles"}
                aria-label="Toggle spontaneous bubbles"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              {/* Clear History */}
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear conversation history"
                aria-label="Clear chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── CHAT MESSAGES SCROLL AREA ── */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "pixel" && (
                  <div className="flex-shrink-0 pt-0.5">
                    <PixelCharacter emotion={msg.emotion || "happy"} size={26} />
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-3 py-2 rounded-xl leading-relaxed select-text ${msg.sender === "user"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs shadow-[0_2px_10px_rgba(0,180,216,0.25)]"
                    : "bg-[#07172B] text-slate-200 border border-cyan-500/20 rounded-bl-xs shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                    }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Thinking Bubble */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-cyan-300 text-xs font-mono"
              >
                <PixelCharacter emotion="thinking" size={24} />
                <div className="flex items-center gap-1 bg-[#07172B] px-3 py-1.5 rounded-xl border border-cyan-400/20">
                  <span>Pixel is calculating</span>
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── QUICK PROMPTS CHIPS ── */}
          <div className="px-3 py-1.5 border-t border-cyan-500/15 bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="flex-shrink-0 text-[10.5px] px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-cyan-300 hover:border-cyan-400 hover:text-white transition-all whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* ── INPUT BAR ── */}
          <div className="p-3 border-t border-cyan-500/20 bg-[#030D1F] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Pixel about Manushka's work..."
              maxLength={280}
              className="flex-1 bg-cyan-950/50 border border-cyan-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isThinking}
              className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,238,255,0.3)]"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

