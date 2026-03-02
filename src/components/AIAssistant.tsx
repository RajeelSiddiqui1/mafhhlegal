
"use client";

import { useState } from "react";
import { MessageSquare, Send, X, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiLegalAssistant } from "@/ai/flows/ai-legal-assistant-flow";
import { cn } from "@/lib/utils";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your AI Legal Assistant. How can I help you with general legal procedures or information about Mafhh Legal services today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await aiLegalAssistant({ question: userMsg });
      setMessages(prev => [...prev, { role: "assistant", content: result.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I encountered an error. Please try again or book a consultation for specific advice." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-all duration-300 scale-100 hover:scale-110"
        >
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        </Button>
      ) : (
        <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20 bg-card/95 backdrop-blur animate-in slide-in-from-bottom-6 duration-300">
          <CardHeader className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-headline">Legal Assistant</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "max-w-[85%] rounded-lg p-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground font-medium"
                    : "mr-auto bg-muted text-foreground"
                )}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-muted p-3 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground italic">Thinking...</span>
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-background/50"
              />
              <Button size="icon" onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center uppercase tracking-wider font-semibold">
              General info only • Consult a paralegal for advice
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
