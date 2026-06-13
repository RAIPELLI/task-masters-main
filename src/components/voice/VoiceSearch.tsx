import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Volume2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface VoiceSearchProps {
    onResult?: (data: any) => void;
    className?: string;
}

export function VoiceSearch({ onResult, className }: VoiceSearchProps) {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef<any>(null);
    const silenceTimer = useRef<any>(null);
    const transcriptRef = useRef<string>('');
    const processingRef = useRef(false);
    const navigate = useNavigate();

    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                transcriptRef.current = '';
                toast.info('Listening... Speak naturally');
                // Stop any ongoing speech when user starts talking
                window.speechSynthesis.cancel();
            };

            recognition.onend = () => {
                setIsListening(false);
                if (silenceTimer.current) clearTimeout(silenceTimer.current);
            };

            recognition.onresult = (event: any) => {
                if (silenceTimer.current) clearTimeout(silenceTimer.current);

                let fullText = '';
                for (let i = 0; i < event.results.length; i++) {
                    fullText += event.results[i][0].transcript;
                }
                transcriptRef.current = fullText;

                // Auto-submit after 1.5s of silence
                silenceTimer.current = setTimeout(() => {
                    recognition.stop();
                    if (fullText.trim()) {
                        handleVoiceCommand(fullText);
                    }
                }, 1500);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    toast.error('Microphone access denied');
                } else if (event.error !== 'aborted') {
                    toast.error('Voice recognition failed. Please try again.');
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleVoiceCommand = async (transcript: string) => {
        if (!transcript.trim() || processingRef.current) return;

        processingRef.current = true;
        setIsProcessing(true);

        try {
            const data = await api.voiceBooking(transcript);

            if (data.action === 'error') {
                toast.error(data.message);
                speak(data.message);
            } else {
                toast.success(data.message, {
                    icon: <Sparkles className="w-4 h-4 text-primary" />,
                    duration: 6000
                });
                
                // Speak the response
                speak(data.message);

                // Handle the action
                if (data.action === 'booking_created') {
                    setTimeout(() => {
                        navigate('/bookings');
                        onResult?.(data);
                    }, 2000);
                } else if (data.specialty) {
                    const params = new URLSearchParams();
                    params.set('specialty', data.specialty);
                    if (data.location) params.set('location', data.location);

                    navigate(`/workers?${params.toString()}`, {
                        state: { voiceData: data }
                    });
                    onResult?.(data);
                }
            }
        } catch (error) {
            console.error('Voice processing error:', error);
            toast.error('Failed to process voice command');
            speak('Sorry, I encountered an error processing your request.');
        } finally {
            setIsProcessing(false);
            processingRef.current = false;
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error('Voice recognition not supported in this browser');
            return;
        }

        if (isListening) {
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
            recognitionRef.current.stop();
            if (transcriptRef.current.trim()) {
                handleVoiceCommand(transcriptRef.current);
            }
        } else {
            // Stop any speaking before starting to listen
            window.speechSynthesis.cancel();
            recognitionRef.current.start();
        }
    };

    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 relative group
                    ${isListening ? 'animate-pulse ring-8 ring-destructive/20 scale-110' : 'hover:scale-110 hover:shadow-primary/20'}
                    ${isSpeaking ? 'ring-8 ring-primary/20' : ''}`}
                onClick={toggleListening}
                disabled={isProcessing}
                title="Voice Assistant"
            >
                {isProcessing ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : isSpeaking ? (
                    <Volume2 className="h-6 w-6 text-primary animate-bounce" />
                ) : isListening ? (
                    <MicOff className="h-6 w-6" />
                ) : (
                    <Mic className="h-6 w-6 group-hover:text-primary transition-colors" />
                )}
                
                {isListening && (
                    <span className="absolute -inset-1 rounded-full border-2 border-destructive animate-ping opacity-50" />
                )}
            </Button>
            
            <div className="absolute top-16 whitespace-nowrap flex flex-col items-center">
                {isListening && (
                    <span className="text-[10px] font-bold text-destructive uppercase tracking-widest animate-pulse">
                        Listening
                    </span>
                )}
                {isSpeaking && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Speaking
                    </span>
                )}
            </div>
        </div>
    );
}


