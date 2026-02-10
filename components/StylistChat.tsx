import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { getStylistAdvice } from '../services/geminiService';

const StylistChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Welcome to Atmos. I am Vesta. How may I assist with your curation today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    const reply = await getStylistAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[340px] md:w-[380px] bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] overflow-hidden animate-scale-in flex flex-col origin-bottom-right">
          <div className="bg-white/50 p-6 flex justify-between items-center border-b border-gray-100/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                 <Sparkles className="text-white w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 leading-none">Vesta</h3>
                <p className="text-[10px] text-indigo-600 uppercase tracking-widest font-semibold mt-1">AI Concierge</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          
          <div className="h-[400px] overflow-y-auto p-6 space-y-6 bg-transparent">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-4 text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-black text-white rounded-[1.5rem] rounded-br-none shadow-lg' 
                    : 'bg-white text-gray-800 rounded-[1.5rem] rounded-bl-none shadow-sm border border-gray-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-100 px-6 py-4 rounded-[1.5rem] rounded-bl-none shadow-sm">
                    <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
               </div>
            )}
          </div>

          <div className="p-4 bg-white/50 border-t border-gray-100/50">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about fit, fabric, or styling..."
                className="w-full bg-white rounded-full pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-black/5 focus:bg-white outline-none transition-all shadow-sm border border-gray-200/50"
              />
              <button 
                onClick={handleSend} 
                className="absolute right-2 top-2 p-2 bg-black text-white rounded-full hover:scale-105 transition-transform"
                disabled={!input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group h-16 w-16 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-indigo-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <div className="relative z-10">
           {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </div>
      </button>
    </div>
  );
};

export default StylistChat;