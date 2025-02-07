import React, { useState, useRef } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (event) => {
        if (event.key === 'Enter' && input.trim() !== '') {
            const userMessage = { sender: 'user', text: input };
            setMessages([...messages, userMessage]);
            setInput('');

            try {
                const response = await fetch('https://techvedas-full-bot.onrender.com/get', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `msg=${encodeURIComponent(input)}`,
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.statusText}`);
                }

                const data = await response.json();
                const botMessage = { sender: 'bot', text: data.response };
                setMessages(prev => [...prev, botMessage]);
            } catch (error) {
                const errorMessage = { sender: 'bot', text: `Error: ${error.message}` };
                setMessages(prev => [...prev, errorMessage]);
            }
        }
    };

    return (
        <div className="fixed bottom-16 right-4 z-40">
            {/* Chat Toggle Button */}
            <button
                className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full shadow-lg 
                hover:shadow-xl transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-2xl" role="img" aria-label="chat">
                    {isOpen ? '✖' : '🤖'}
                </span>
            </button>

            {/* Chat Window */}
            <div 
                className={`absolute bottom-16 right-0 w-80 rounded-2xl shadow-2xl 
                    bg-white border border-gray-100 overflow-hidden transition-all duration-300
                    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🤖</span>
                        <div className="flex-1">
                            <h4 className="text-white font-medium">AI Assistant</h4>
                            <p className="text-white/80 text-xs">Always here to help!</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div 
                    className="h-80 overflow-y-auto p-4 bg-gray-50"
                >
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                                    message.sender === 'user' 
                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-none' 
                                        : 'bg-white shadow-md text-gray-800 rounded-bl-none'
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 bg-white border-t border-gray-100">
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-full border border-gray-200 focus:border-purple-500 
                        focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
