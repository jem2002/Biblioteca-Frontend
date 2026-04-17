import { useCallback, useEffect, useState } from 'react';
import * as rolesApi from '../api/roles.api.js';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await rolesApi.getRoles();
            const rolesList = response.data || [];
            setRoles(rolesList);
        } catch (fetchError) {
            setError(fetchError.response?.data?.message || fetchError.message || 'Error al cargar roles');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const createRole = async (roleName, description = '') => {
        setLoading(true);
        setError(null);
        try {
            await rolesApi.createRole(roleName, description);
            await fetchRoles();
        } catch (createError) {
            setError(createError.response?.data?.message || createError.message || 'Error al crear rol');
            throw createError;
        } finally {
            setLoading(false);
        }
    };

    const addPermission = async (roleName, permission) => {
        setLoading(true);
        setError(null);
        try {
            await rolesApi.addPermissionToRole(roleName, permission);
            await fetchRoles();
        } catch (addError) {
            setError(addError.response?.data?.message || addError.message || 'Error al agregar permiso');
            throw addError;
        } finally {
            setLoading(false);
        }
    };

    return {
        roles,
        loading,
        error,
        fetchRoles,
        createRole,
        addPermission,
    };
};
