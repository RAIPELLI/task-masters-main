import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Languages } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: number;
    senderId?: number;
    receiverId?: number;
    sender_id?: number;
    receiver_id?: number;
    content: string;
    timestamp: string;
    isRead: boolean;
}

interface ChatDialogProps {
    otherUserId: number | string;
    otherUserName: string;
    className?: string;
}

export function ChatDialog({ otherUserId, otherUserName, className }: ChatDialogProps) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isTranslated, setIsTranslated] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getTranslatedContent = (text: string) => {
        if (!isTranslated) return text;
        const lower = text.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) return 'Namaste (Translated)';
        if (lower.includes('how are you')) return 'Aap kaise hain? (Translated)';
        if (lower.includes('good morning')) return 'Shubh prabhat (Translated)';
        if (lower.includes('thank you')) return 'Dhanyavaad (Translated)';
        if (lower.includes('yes')) return 'Haa (Translated)';
        if (lower.includes('no')) return 'Nahi (Translated)';
        if (lower.includes('ok')) return 'Thik hai (Translated)';
        return text + " (Translated)";
    };

    const targetId = Number(otherUserId);
    const currentUserId = Number(user?.id);

    const fetchMessages = async () => {
        if (!targetId || isNaN(targetId)) return;

        try {
            const data = await api.messaging.get(targetId);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
            toast.error("Failed to fetch messages.");
        }
    };

    useEffect(() => {
        if (isOpen && targetId && !isNaN(targetId)) {
            // Debug: Confirm who we are chatting with
            console.log("Chatting with userID:", targetId);
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Poll every 3s
            return () => clearInterval(interval);
        }
    }, [isOpen, targetId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        if (!targetId || isNaN(targetId)) {
            toast.error("Unable to send message: Invalid User ID");
            return;
        }

        setIsSending(true);
        try {
            // Force snake_case to ensure backend receives it correctly regardless of alias config
            await api.messaging.send({
                receiver_id: targetId,
                content: newMessage
            } as any);
            setNewMessage('');
            await fetchMessages();
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className={`flex items-center gap-2 ${className}`}>
                    <MessageCircle className="w-4 h-4" />
                    Chat
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-[500px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chat with {otherUserName}</DialogTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="AI Translate"
                        onClick={() => setIsTranslated(!isTranslated)}
                        className={isTranslated ? "text-blue-600 bg-blue-50" : "text-muted-foreground"}
                    >
                        <Languages className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md bg-muted/20" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            No messages yet. Start a conversation!
                        </div>
                    )}
                    {messages.map((msg) => {
                        // Handle both camelCase and snake_case API responses
                        const msgSenderId = msg.senderId || msg.sender_id;
                        const isMe = Number(msgSenderId) === Number(user?.id);

                        return (
                            <div
                                key={msg.id}
                                className={`flex gap-2 items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <Avatar className="h-8 w-8">
                                    {isMe ? (
                                        <>
                                            <AvatarImage src={user?.avatar} />
                                            <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                        </>
                                    ) : (
                                        <>
                                            <AvatarFallback>{otherUserName?.[0]?.toUpperCase() || 'O'}</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-muted text-foreground rounded-bl-none'
                                        }`}
                                >
                                    {!isMe && (
                                        <p className="text-xs font-semibold mb-1 opacity-70">{otherUserName}</p>
                                    )}
                                    <p className="text-sm">{getTranslatedContent(msg.content)}</p>
                                    <span className="text-[10px] opacity-70 block mt-1 text-right">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-2 mt-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
