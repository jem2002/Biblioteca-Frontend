import { useCallback, useEffect, useState } from 'react';
import * as usersApi from '../api/users.api.js';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchUsers = useCallback(async (newPage = page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await usersApi.getUsers(newPage, pagination.limit);
            // Manejar diferentes formatos de respuesta del servidor
            let usersList = [];
            let paginationData = { page: newPage, limit: pagination.limit, total: 0 };

            if (response.data) {
                // Formato: { success, data, pagination }
                usersList = Array.isArray(response.data) ? response.data : [];
                paginationData = response.pagination || paginationData;
            } else if (Array.isArray(response)) {
                // Respuesta directa como array
                usersList = response;
            }

            setUsers(usersList);
            setPagination({
                page: paginationData.page || newPage,
                limit: paginationData.limit || pagination.limit,
                total: paginationData.total || 0,
            });
        } catch (fetchError) {
            setError(fetchError.response?.data?.message || fetchError.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, [page, pagination.limit]);

    useEffect(() => {
        fetchUsers(page);
    }, [fetchUsers, page]);

    const activateUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await usersApi.activateUser(id);
            await fetchUsers(page);
        } catch (activateError) {
            setError(activateError.response?.data?.message || activateError.message || 'Error al activar usuario');
        } finally {
            setLoading(false);
        }
    };

    const deactivateUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await usersApi.deactivateUser(id);
            await fetchUsers(page);
        } catch (deactivateError) {
            setError(deactivateError.response?.data?.message || deactivateError.message || 'Error al desactivar usuario');
        } finally {
            setLoading(false);
        }
    };

    const assignRole = async (id, roleName) => {
        setLoading(true);
        setError(null);
        try {
            await usersApi.assignRoleToUser(id, roleName);
            await fetchUsers(page);
        } catch (assignError) {
            setError(assignError.response?.data?.message || assignError.message || 'Error al asignar rol');
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        page,
        loading,
        error,
        pagination,
        setPage,
        fetchUsers,
        activateUser,
        deactivateUser,
        assignRole,
    };
};
