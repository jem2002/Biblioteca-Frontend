import axios from 'axios';

const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (credentials) => {
    const response = await authApi.post('/api/auth/login', credentials);
    return response.data;
};

export const register = async (payload) => {
    const response = await authApi.post('/api/auth/register', payload);
    return response.data;
};
