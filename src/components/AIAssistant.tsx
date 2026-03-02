"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiLegalAssistant } from "@/ai/flows/ai-legal-assistant-flow";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI Legal Assistant. How can I help you with general legal procedures or information about Mafhh Legal services today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamText = async (text: string) => {
    let currentText = "";
    const words = text.split(" ");
    
    // Add an empty assistant message to start "streaming" into
    setMessages(prev => [...prev, { role: "assistant", content: "", isStreaming: true }]);
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? "" : " ") + words[i];
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: currentText, isStreaming: true };
        return updated;
      });
      // Adjust timing for a natural feel
      await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
    }

    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { role: "assistant", content: text, isStreaming: false };
      return updated;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await aiLegalAssistant({ question: userMsg });
      setIsLoading(false);
      await streamText(result.answer);
    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I encountered an error. Please try again or book a consultation for specific advice." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-16 w-16 rounded-full shadow-[0_10px_40px_rgba(var(--primary),0.3)] bg-primary hover:bg-primary/90 transition-all duration-300"
            >
              <MessageSquare className="h-7 w-7 text-primary-foreground" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="w-[350px] sm:w-[420px] h-[550px] flex flex-col shadow-2xl border-white/10 bg-card/95 backdrop-blur-xl overflow-hidden rounded-[2rem]">
              <CardHeader className="p-5 border-b border-white/5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-headline font-bold">Legal Assistant</CardTitle>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">Online</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.role === "user" ? "ml-auto" : "mr-auto"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                          : "bg-muted text-foreground rounded-tl-none border border-white/5"
                      )}
                    >
                      {msg.content}
                      {msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-primary/50 ml-1 animate-pulse" />}
                    </div>
                    <span className="text-[9px] mt-1.5 opacity-40 font-bold uppercase tracking-widest px-1">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </span>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mr-auto bg-muted/50 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground italic font-medium">Processing request...</span>
                  </motion.div>
                )}
              </CardContent>
              <div className="p-5 border-t border-white/5 bg-muted/20">
                <div className="flex gap-3 bg-background/50 border border-white/10 p-1.5 rounded-2xl focus-within:border-primary/50 transition-colors">
                  <Input
                    placeholder="Describe your legal query..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="border-0 bg-transparent focus-visible:ring-0 h-10 shadow-none text-sm font-medium"
                  />
                  <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()} className="rounded-xl h-10 w-10 shrink-0 shadow-lg shadow-primary/20">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-bold opacity-60">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>AI Powered • Legal Information Only</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
