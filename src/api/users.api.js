import axios from 'axios';

const usersApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

usersApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

usersApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getUsers = async (page = 1, limit = 10) => {
    const response = await usersApi.get('/api/users', { params: { page, limit } });
    return response.data;
};

export const getUserById = async (id) => {
    const response = await usersApi.get(`/api/users/${id}`);
    return response.data;
};

export const activateUser = async (id) => {
    const response = await usersApi.patch(`/api/users/${id}/activate`);
    return response.data;
};

export const deactivateUser = async (id) => {
    const response = await usersApi.patch(`/api/users/${id}/deactivate`);
    return response.data;
};

export const assignRoleToUser = async (id, roleName) => {
    const response = await usersApi.post(`/api/users/${id}/roles`, { roleName });
    return response.data;
};
