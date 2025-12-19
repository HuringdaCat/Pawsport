import React, { useState, useRef, useEffect } from 'react';
import './AITravelChat.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface QuickAction {
    label: string;
    prompt: string;
    icon: string;
}

const AITravelChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm your AI travel assistant. I can help you with:\n\n• Creating personalized travel checklists\n• Understanding pet travel regulations\n• Explaining veterinary documents\n• Preparing required paperwork\n\nHow can I assist you today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickActions: QuickAction[] = [
        { label: 'Travel Checklist', prompt: 'Help me create a travel checklist', icon: '✓' },
        { label: 'Regulations', prompt: 'What are the travel regulations?', icon: '📋' },
        { label: 'Documents', prompt: 'Explain required documents', icon: '📄' },
        { label: 'Timeline', prompt: 'What\'s the preparation timeline?', icon: '⏰' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: generateAIResponse(text),
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();
        
        if (input.includes('checklist') || input.includes('prepare')) {
            return "I'll help you create a personalized travel checklist. To get started, I need some information:\n\n1. Where are you traveling from?\n2. What's your destination country?\n3. What type of pet are you traveling with?\n4. When do you plan to travel?\n\nPlease share these details so I can create a customized checklist for you!";
        } else if (input.includes('regulation') || input.includes('rules')) {
            return "I can help you understand the travel regulations. Each country has specific requirements for pet entry, including:\n\n• Vaccination requirements (typically rabies)\n• Microchip standards\n• Health certificates\n• Import permits\n• Quarantine periods\n\nWhich country are you traveling to? I'll provide specific regulations for that destination.";
        } else if (input.includes('document') || input.includes('paperwork')) {
            return "For pet travel, you'll typically need these documents:\n\n📄 **Health Certificate**: Issued by a licensed veterinarian\n💉 **Vaccination Records**: Proof of rabies and other required vaccines\n🔬 **Lab Test Results**: Blood tests if required by destination\n✈️ **Import Permit**: Some countries require advance permits\n🐾 **Microchip Documentation**: Proof of ISO-compliant chip\n\nWould you like me to explain any specific document in detail?";
        } else if (input.includes('timeline') || input.includes('when')) {
            return "Here's a typical preparation timeline:\n\n**3-6 months before:**\n• Research destination requirements\n• Ensure microchip is ISO-compliant\n• Start required vaccinations\n\n**1-2 months before:**\n• Book vet appointments\n• Apply for import permits\n• Arrange airline booking\n\n**2-4 weeks before:**\n• Get health certificate\n• Complete final vet checks\n\n**1 week before:**\n• Confirm all documents\n• Prepare travel crate\n\nWhen is your travel date?";
        } else {
            return "I'm here to help with your pet travel planning! You can ask me about:\n\n• Creating travel checklists\n• Understanding regulations\n• Required documents\n• Preparation timelines\n• Specific country requirements\n\nWhat would you like to know more about?";
        }
    };

    const handleQuickAction = (prompt: string) => {
        handleSendMessage(prompt);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputText);
        }
    };

    return (
        <div className="ai-travel-chat">
            <div className="chat-header">
                <div className="chat-header-content">
                    <div className="ai-avatar">🤖</div>
                    <div className="chat-header-text">
                        <h3>AI Travel Assistant</h3>
                        <span className="status-indicator">● Online</span>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.sender}`}>
                        <div className="message-content">
                            <div className="message-text">{message.text}</div>
                            <div className="message-time">
                                {message.timestamp.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="message ai">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="quick-actions">
                {quickActions.map((action, index) => (
                    <button
                        key={index}
                        className="quick-action-btn"
                        onClick={() => handleQuickAction(action.prompt)}
                    >
                        <span className="action-icon">{action.icon}</span>
                        {action.label}
                    </button>
                ))}
            </div>

            <div className="chat-input-container">
                <div className="chat-input-wrapper">
                    <textarea
                        className="chat-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about pet travel..."
                        rows={1}
                    />
                    <button 
                        className="send-button"
                        onClick={() => handleSendMessage(inputText)}
                        disabled={!inputText.trim()}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AITravelChat;
