import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const NotificationListener = () => {
    const { user } = useAuth();
    const ws = useRef<WebSocket | null>(null);
    const audioCtx = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioCtx.current = new AudioContextClass();
            }
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }

        // Unlock AudioContext on first user interaction
        const unlockAudio = () => {
            if (audioCtx.current && audioCtx.current.state === 'suspended') {
                audioCtx.current.resume().then(() => {
                    console.log("AudioContext resumed");
                });
            }
            // Remove after first interaction to avoid overhead
            if (audioCtx.current && audioCtx.current.state === 'running') {
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
            }
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('keydown', unlockAudio);

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
            if (audioCtx.current) {
                audioCtx.current.close();
            }
        };
    }, []);

    const playNotificationSound = () => {
        if (!audioCtx.current) return;

        try {
            // Ensure context is running
            if (audioCtx.current.state === 'suspended') {
                audioCtx.current.resume();
            }

            const ctx = audioCtx.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.5, ctx.currentTime); // Increased volume from 0.1 to 0.5
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    const playConfirmSound = () => {
        if (!audioCtx.current) return;

        try {
            if (audioCtx.current.state === 'suspended') {
                audioCtx.current.resume();
            }

            const ctx = audioCtx.current;
            const frequencies = [523.25, 659.25, 783.99];

            frequencies.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gn = ctx.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                gn.gain.setValueAtTime(0.3, ctx.currentTime); // Increased volume
                gn.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

                osc.connect(gn);
                gn.connect(ctx.destination);

                osc.start(ctx.currentTime + i * 0.1);
                osc.stop(ctx.currentTime + 1.0);
            });

        } catch (error) {
            console.error("Error playing confirm sound:", error);
        }
    };

    const playChatSound = () => {
        if (!audioCtx.current) return;

        try {
            if (audioCtx.current.state === 'suspended') {
                audioCtx.current.resume();
            }

            const ctx = audioCtx.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime); // Increased volume
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.2);
        } catch (error) {
            console.error("Error playing chat sound:", error);
        }
    };

    useEffect(() => {
        // Allow both masters and workers to connect
        if (!user) return;

        let reconnectTimeout: NodeJS.Timeout;
        let isMounted = true;
        let socket: WebSocket | null = null;

        const connect = () => {
            if (!isMounted) return;

            // Clean up existing closed connection refs
            if (ws.current && ws.current.readyState === WebSocket.CLOSED) {
                ws.current = null;
            }

            // Prevent duplicate connections if already open or connecting
            if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
                return;
            }

            const protocol = window.location.protocol === "https:" ? "wss" : "ws";
            const wsUrl = `${protocol}://localhost:8000/ws/${user.id}`;

            console.log(`Connecting to Notification WebSocket: ${wsUrl}`);
            socket = new WebSocket(wsUrl);
            ws.current = socket;

            socket.onopen = () => {
                console.log("WebSocket Connected");
            };

            socket.onmessage = (event) => {
                const message = event.data;
                console.log("Notification received:", message);

                if (message.toLowerCase().includes("confirmed") ||
                    message.toLowerCase().includes("accepted") ||
                    message.toLowerCase().includes("quoted")) {
                    playConfirmSound();
                } else if (message.toLowerCase().includes("new message from")) {
                    playChatSound();

                    toast.info(message, {
                        duration: 5000,
                        action: {
                            label: "Reply",
                            onClick: () => window.location.href = "/messages" // Or appropriate chat route
                        }
                    });
                    return;
                } else {
                    playNotificationSound();
                }

                toast.success(message, {
                    duration: 5000,
                    action: {
                        label: user.role === 'worker' ? "View Dashboard" : "View Booking",
                        onClick: () => window.location.href = user.role === 'worker' ? "/worker/dashboard" : "/bookings"
                    }
                });
            };

            socket.onclose = (event) => {
                console.log("WebSocket Disconnected", event.reason);
                ws.current = null;
                if (isMounted) {
                    reconnectTimeout = setTimeout(() => {
                        console.log("Attempting to reconnect...");
                        connect();
                    }, 3000);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket Error:", error);
                if (socket) socket.close();
            };
        };

        connect();

        return () => {
            isMounted = false;
            clearTimeout(reconnectTimeout);
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };

    }, [user]);

    return null;
};
