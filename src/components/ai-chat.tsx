"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Maximize2, Minimize2, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Components } from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type AIChatBoxProps = {
  contextTitle?: string;
  contextDescription?: string;
};

export function AIChatBox({ contextTitle = "cs1", contextDescription = "" }: AIChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const CONTEXT = `
You are a helpful AI assistant specifically knowledgeable about Computer Science, currently helping with: ${contextTitle}.
${contextDescription}
You can help with:
- Understanding concepts and terminology
- Implementation details
- Common operations and algorithms
- Properties and characteristics
- Code examples
Please provide short, concise, accurate answers focused on the current topic. If providing code, please provide the code in C.
`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: CONTEXT }],
          },
          ...messages.map(msg => ({
            role: msg.role === 'user' ? "user" : "model",
            parts: [{ text: msg.content }]
          }))
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const assistantMessage = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="fixed right-4 bottom-16 w-[600px] z-50">
      {isExpanded ? (
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 shadow-lg backdrop-blur-sm">
          <div className="p-3 border-b border-zinc-700/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-white" />
              <h3 className="text-sm font-semibold text-white">ucf cs1 bot</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-auto p-1 hover:bg-zinc-700/50"
            >
              <Minimize2 className="w-4 h-4 text-zinc-400" />
            </Button>
          </div>
          
          <div className="h-[600px] overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/50 hover:scrollbar-thumb-zinc-600">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`text-sm rounded ${
                  message.role === 'user' 
                    ? 'bg-blue-500/10 text-white ml-auto max-w-[80%] p-2' 
                    : 'bg-zinc-700/30 text-zinc-300 max-w-[80%] p-2'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                  className="prose prose-invert prose-sm max-w-none"
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          // @ts-ignore
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-zinc-700/30 text-zinc-300 max-w-[80%] p-2 rounded">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-zinc-700/50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`ask ucf cs1 bot about ${contextTitle.toLowerCase()}`}
                className="bg-zinc-900/50 border-zinc-700/50 text-white text-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-zinc-900/50 hover:bg-zinc-700/50"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsExpanded(true)}
            className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 shadow-lg backdrop-blur-sm w-auto"
          >
            <Bot className="w-4 h-4 mr-2 text-white" />
            <span className="text-white">ask ucf cs1 bot about {contextTitle.toLowerCase()}</span>
          </Button>
        </div>
      )}
    </div>
  );
} 