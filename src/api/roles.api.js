import axios from 'axios';

const rolesApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

rolesApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

rolesApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getRoles = async () => {
    const response = await rolesApi.get('/api/roles');
    return response.data;
};

export const createRole = async (roleName, description = '') => {
    const response = await rolesApi.post('/api/roles', { roleName, description });
    return response.data;
};

export const addPermissionToRole = async (roleName, permission) => {
    const response = await rolesApi.post(`/api/roles/${roleName}/permissions`, { permission });
    return response.data;
};
