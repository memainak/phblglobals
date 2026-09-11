'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import Image from 'next/image';

interface RelevantPage {
  title: string;
  url: string;
  category: string;
  snippet: string;
  ctaText: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relevantPages?: RelevantPage[];
  suggestedQuestions?: string[];
  timestamp: string;
}

const INITIAL_SUGGESTIONS = [
  'Verify batch BL-2024-0101',
  'What are the indications for Arnica Montana Q?',
  'Are PHBL products GMP and ISO certified?',
  'Helpline and factory location',
  'How to apply for wholesale distributorship?',
];

export function ChatbotWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        "Welcome to the **Purusottam Homeo Bikash Lab(Bonded)** Clinical & Site Assistant.\n\nI can search our complete formulation monographs, verify batch analytical reports, explain statutory Schedule M-I quality standards, or take you directly to any page on our site.",
      suggestedQuestions: INITIAL_SUGGESTIONS,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          relevantPages: data.relevantPages,
          suggestedQuestions: data.suggestedQuestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to query RAG assistant');
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          "Our clinical search service encountered a temporary network delay. You can reach our technical desk directly at **9800011545** or browse our products and batch portals.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToPage = (url: string) => {
    // Navigate user directly to relevant page
    router.push(url);
    // On small screens, close the chat modal so the user sees the page immediately
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          "Conversation reset. What formulation, statutory batch, or regulatory document can I find for you?",
        suggestedQuestions: INITIAL_SUGGESTIONS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button positioned above WhatsApp button */}
      <aside aria-label="PHBL Clinical & Site AI Assistant" className="fixed bottom-22 right-6 z-[50] no-print">
        <button
          id="phbl-ai-chat-trigger"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-[#12150F] hover:bg-[#1F4D3A] text-white py-2.5 px-3.5 rounded-full shadow-xl border border-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
          aria-label="Open PHBL Site Search & Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold tracking-wide uppercase font-mono text-emerald-400">
              Ask PHBL AI
            </span>
            <span className="text-[9px] text-neutral-300 hidden sm:inline leading-none">
              Site & Clinical Navigator
            </span>
          </div>
        </button>
      </aside>

      {/* Expandable Chat Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="PHBL Site Search & Navigator Assistant"
          className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-[rgba(18,21,15,0.14)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-[#12150F] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 p-0.5 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/phbl-logo.png"
                  alt="PHBL"
                  width={28}
                  height={28}
                  className="object-contain filter brightness-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold font-serif tracking-tight">
                    PHBL Clinical & Site Assistant
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  RAG Grounded · HPI & Site Indexed
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#FAFAF8]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Bubble */}
                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1F4D3A] text-white rounded-br-xs shadow-xs font-medium'
                      : 'bg-white text-[#12150F] border border-[rgba(18,21,15,0.08)] rounded-bl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                    {/* Render simple markdown bolding and bullet highlights */}
                    {msg.content.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="font-serif font-bold text-sm text-[#1F4D3A] pt-1">
                            {para.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (para.startsWith('* ')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-4 space-y-1">
                            {para.split('\n').map((line, lIdx) => (
                              <li key={lIdx}>{line.replace('* ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={pIdx}>{para}</p>;
                    })}
                  </div>

                  <span className="block text-[9px] text-neutral-400 mt-2 text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Relevant Pages Action Cards (Take to page) */}
                {msg.relevantPages && msg.relevantPages.length > 0 && (
                  <div className="w-full mt-2.5 space-y-1.5 pl-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F4D3A] flex items-center gap-1">
                      <span>Relevant Site Pages:</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {msg.relevantPages.map((page, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-emerald-900/10 rounded-lg p-2.5 hover:border-[#1F4D3A] transition-all duration-200 shadow-2xs group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-[#1F4D3A] font-bold inline-block mb-1">
                                {page.category}
                              </span>
                              <h5 className="font-serif font-bold text-xs text-[#12150F] truncate group-hover:text-[#1F4D3A] transition-colors">
                                {page.title}
                              </h5>
                              <p className="text-[11px] text-[#595C54] line-clamp-1 mt-0.5">
                                {page.snippet}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleNavigateToPage(page.url)}
                            className="mt-2 w-full flex items-center justify-between text-[11px] font-bold text-[#1F4D3A] bg-[#F0F5F2] hover:bg-[#1F4D3A] hover:text-white py-1.5 px-2.5 rounded transition-colors cursor-pointer"
                          >
                            <span>{page.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1">
                    {msg.suggestedQuestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="text-[10px] font-medium bg-white hover:bg-[#F0F5F2] text-[#1F4D3A] border border-[rgba(18,21,15,0.1)] rounded-full px-2.5 py-1 text-left transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading animation indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[rgba(18,21,15,0.08)] rounded-2xl rounded-bl-xs w-28">
                <div className="w-2 h-2 rounded-full bg-[#1F4D3A] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#1F4D3A] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#1F4D3A] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Helpline & Direct Inquire Shortcut */}
          <div className="bg-[#FAFAF8] px-3 py-1.5 border-t border-[rgba(18,21,15,0.06)] flex items-center justify-between text-[10px] text-[#595C54]">
            <a
              href="tel:9800011545"
              className="flex items-center gap-1 hover:text-[#1F4D3A] font-medium font-mono"
            >
              <PhoneCall className="w-3 h-3 text-emerald-600" />
              <span>Helpline: 9800011545</span>
            </a>
            <span className="text-[9px] text-neutral-400">DMR Act 1954 Compliant</span>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[rgba(18,21,15,0.08)] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about batches, medicines, certificates..."
              className="flex-1 text-xs px-3 py-2.5 rounded-full border border-neutral-300 focus:outline-hidden focus:border-[#1F4D3A] focus:ring-1 focus:ring-[#1F4D3A]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center hover:bg-[#16382A] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              aria-label="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
