import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Mic } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useNavigate } from 'react-router-dom';

export const ChatBot = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: 'Hello! I\'m your Task Masters Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user && messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([{
                role: 'assistant',
                content: `Hello ${user.name.split(' ')[0]}! I'm your Task Masters Assistant. How can I help you today?`
            }]);
        }
    }, [user, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.chat([...messages, userMessage]);
            setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[380px] h-[520px] bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Task Master AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] opacity-80 uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl flex flex-col gap-2 ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 shadow-sm rounded-tl-none text-gray-800'
                                        }`}>
                                        <div className="flex gap-3">
                                            {msg.role === 'assistant' && <Bot size={16} className="mt-1 flex-shrink-0 text-purple-600" />}
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            {msg.role === 'user' && <User size={16} className="mt-1 flex-shrink-0 opacity-60" />}
                                        </div>
                                        {msg.role === 'assistant' && msg.content.includes("Booking Confirmed!") && (
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    navigate('/bookings');
                                                }}
                                                className="mt-2 text-xs bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors self-start font-medium flex items-center gap-2"
                                            >
                                                View Booking Details →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 shadow-sm p-3 rounded-2xl rounded-tl-none">
                                        <Loader2 size={16} className="animate-spin text-purple-600" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length === 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {['Find a Plumber', 'Book an Electrician', 'How to book?', 'Pest Control services'].map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => {
                                            setInput(prompt);
                                            // Optional: auto-send
                                            // handleSend({ preventDefault: () => {} } as any); 
                                        }}
                                        className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border border-purple-100 hover:bg-purple-100 transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white/50">
                            <div className="relative flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if ('webkitSpeechRecognition' in window) {
                                            // @ts-ignore
                                            const recognition = new window.webkitSpeechRecognition();
                                            recognition.lang = 'en-US';
                                            recognition.onstart = () => toast.info("Listening...");
                                            recognition.onresult = (e: any) => {
                                                const text = e.results[0][0].transcript;
                                                setInput(text);
                                                // Optional: Auto-send after voice
                                                // setTimeout(() => handleSend({ preventDefault: () => {} } as any), 500);
                                            };
                                            recognition.onerror = () => toast.error("Voice input failed");
                                            recognition.start();
                                        } else {
                                            toast.error("Voice input not supported");
                                        }
                                    }}
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Voice Input"
                                >
                                    <Mic size={18} />
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about electricians, plumbers..."
                                    className="flex-1 pl-4 pr-12 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 p-2 text-purple-600 hover:bg-purple-50 rounded-lg disabled:opacity-50 transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 bg-gradient-to-tr from-purple-600 via-purple-500 to-blue-500 text-white rounded-full shadow-[0_8px_30px_rgb(147,51,234,0.4)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};
