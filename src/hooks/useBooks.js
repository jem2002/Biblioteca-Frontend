import { useCallback, useEffect, useState } from 'react';
import * as catalogApi from '../api/catalog.api.js';

export const useBooks = (initialFilters = {}) => {
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchBooks = useCallback(async (newFilters = filters, newPage = page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await catalogApi.getBooks(newFilters, newPage, pagination.limit);
            const booksList = response.data || [];
            setBooks(booksList);
            setPagination({
                page: response.pagination?.page || newPage,
                limit: response.pagination?.limit || pagination.limit,
                total: response.pagination?.total || 0,
            });
        } catch (fetchError) {
            setError(fetchError.response?.data?.message || fetchError.message || 'Error al cargar libros');
        } finally {
            setLoading(false);
        }
    }, [filters, page, pagination.limit]);

    useEffect(() => {
        fetchBooks(filters, page);
    }, [fetchBooks, filters, page]);

    const updateFilters = (nextFilters) => {
        setFilters(nextFilters);
        setPage(1);
    };

    const deleteBook = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await catalogApi.deleteBook(id);
            await fetchBooks(filters, page);
        } catch (deleteError) {
            setError(deleteError.response?.data?.message || deleteError.message || 'Error al eliminar libro');
        } finally {
            setLoading(false);
        }
    };

    const saveBook = async (book, id) => {
        setLoading(true);
        setError(null);
        try {
            if (id) {
                await catalogApi.updateBook(id, book);
            } else {
                await catalogApi.createBook(book);
            }
            await fetchBooks(filters, page);
        } catch (saveError) {
            setError(saveError.response?.data?.message || saveError.message || 'Error al guardar libro');
            throw saveError;
        } finally {
            setLoading(false);
        }
    };

    return {
        books,
        filters,
        page,
        loading,
        error,
        pagination,
        updateFilters,
        setPage,
        fetchBooks,
        deleteBook,
        saveBook,
    };
};
