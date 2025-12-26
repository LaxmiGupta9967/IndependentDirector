
import React, { useState, useRef, useEffect } from 'react';
import { Director, ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    directors: Director[];
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, directors }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', parts: "Hello! I'm the Independent Director assistant. How can I help you find a director today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', parts: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = messages.map(m => ({
                role: m.role,
                parts: m.parts,
            }));
            const response = await getChatbotResponse(chatHistory, input, directors);
            setMessages([...newMessages, { role: 'model', parts: response }]);
        } catch (error) {
            setMessages([...newMessages, { role: 'model', parts: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="w-full max-w-md h-full flex flex-col glass-card border-l-2 border-teal-500/30">
                <div className="p-4 flex justify-between items-center border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.parts}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-700 text-white rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                             </div>
                        </div>
                     )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-white/10">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about directors..."
                            className="flex-1 px-4 py-2 text-white rounded-lg glass-input focus:outline-none transition-shadow duration-300 placeholder-slate-400"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 text-white font-semibold rounded-lg transition-transform duration-300 transform hover:scale-105 glow-button disabled:opacity-50 disabled:cursor-not-allowed">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;