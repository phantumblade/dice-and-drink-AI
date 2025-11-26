import React, { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { askAiAssistant } from '../services/ai';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    
    const result = await askAiAssistant(query);
    
    setResponse(result);
    setLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-40 bg-neo-cyan border-2 border-black p-4 shadow-neo hover:translate-y-1 hover:shadow-none transition-all rounded-full"
        >
            <Bot className="w-8 h-8 text-black" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white border-2 border-black shadow-neo-lg flex flex-col max-h-[500px]">
            <div className="bg-black text-white p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neo-yellow" />
                    <span className="font-bold uppercase tracking-wider">Deep Thought AI</span>
                </div>
                <button onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-neo-bg min-h-[200px]">
                {loading && (
                    <div className="flex items-center gap-2 text-gray-500 italic animate-pulse">
                        <Bot className="w-4 h-4" /> Thinking deeply...
                    </div>
                )}
                {response && (
                    <div className="bg-white border-2 border-black p-3 text-sm shadow-neo-sm">
                        <p className="leading-relaxed">{response}</p>
                    </div>
                )}
                {!loading && !response && (
                    <p className="text-center text-gray-400 text-sm mt-8">Ask me anything complex about games or strategy.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-2 border-t-2 border-black bg-white flex gap-2">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a complex question..."
                    className="flex-1 border-2 border-black px-2 py-1 font-medium text-sm focus:outline-none focus:bg-neo-yellow"
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-neo-violet text-white p-2 border-2 border-black hover:bg-black disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
