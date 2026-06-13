const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || 'API request failed');
    }

    return response.json();
}

export const api = {
    auth: {
        login: (credentials: any) => apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
        register: (userData: any) => apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),
        me: () => apiFetch('/users/me'),
    },
    workers: {
        list: (specialty?: string) => apiFetch(`/workers${specialty ? `?specialty=${specialty}` : ''}`),
        recommend: (specialty?: string) => apiFetch(`/workers/recommend${specialty ? `?specialty=${specialty}` : ''}`),
        updateMe: (data: any) => apiFetch('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    },
    stats: () => apiFetch('/stats'),
    bookings: {
        list: () => apiFetch('/bookings'),
        create: (data: any) => apiFetch('/bookings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        update: (id: number, data: any) => apiFetch(`/bookings/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    },
    chat: (messages: { role: string; content: string }[]) => apiFetch('/chat', {
        method: 'POST',
        body: JSON.stringify({ messages }),
    }),
    voiceBooking: (transcript: string) => apiFetch('/voice-booking', {
        method: 'POST',
        body: JSON.stringify({ transcript }),
    }),
    messaging: {
        send: (data: { receiverId: number; content: string }) => apiFetch('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        get: (userId: number) => apiFetch(`/messages/${userId}`),
    },
};
