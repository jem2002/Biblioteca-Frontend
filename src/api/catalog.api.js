import axios from 'axios';

const catalogApi = axios.create({
    baseURL: import.meta.env.VITE_CATALOG_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

catalogApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

catalogApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const buildQuery = (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, value);
        }
    });
    return query.toString();
};

export const getBooks = async (filters = {}, page = 1, limit = 10) => {
    const params = {
        page,
        limit,
        title: filters.title || undefined,
        author: filters.author || undefined,
        category: filters.category || undefined,
        available: filters.available ? 'true' : undefined,
    };
    const query = buildQuery(params);
    const response = await catalogApi.get(`/api/catalog/books${query ? `?${query}` : ''}`);
    return response.data;
};

export const createBook = async (book) => {
    const response = await catalogApi.post('/api/catalog/books', book);
    return response.data;
};

export const updateBook = async (id, book) => {
    const response = await catalogApi.put(`/api/catalog/books/${id}`, book);
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await catalogApi.delete(`/api/catalog/books/${id}`);
    return response.data;
};
