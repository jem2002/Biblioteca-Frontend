/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import * as authApi from '../api/auth.api.js';

export const AuthContext = createContext({});

const decodeTokenPayload = (token) => {
    if (!token) return null;
    try {
        const [, payload] = token.split('.');
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        const utf8String = decodeURIComponent(
            decoded
                .split('')
                .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(utf8String);
    } catch {
        return null;
    }
};

const buildUserFromToken = (token) => {
    const payload = decodeTokenPayload(token);
    if (!payload) return null;

    // Extraer roles de múltiples formatos posibles
    let roles = [];
    if (Array.isArray(payload.roles)) {
        roles = payload.roles;
    } else if (payload.role) {
        roles = Array.isArray(payload.role) ? payload.role : [payload.role];
    } else if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        roles = Array.isArray(role) ? role : [role];
    }

    return {
        userId: payload.sub || payload.userId || null,
        username: payload.unique_name || payload.username || payload.name || null,
        email: payload.email || null,
        roles,
    };
};

export const AuthProvider = ({ children }) => {
    const initialToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const initialUser = buildUserFromToken(initialToken);
    const [accessToken, setAccessToken] = useState(initialUser ? initialToken : null);
    const [user, setUser] = useState(initialUser || null);
    const [loading] = useState(false);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        const token = data.accessToken || data.token || null;
        if (!token) {
            throw new Error('Token no recibido desde el Auth Service');
        }

        const parsedUser = buildUserFromToken(token);
        if (!parsedUser) {
            throw new Error('Token inválido');
        }

        localStorage.setItem('accessToken', token);
        setAccessToken(token);
        setUser(parsedUser);
        return parsedUser;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(accessToken && user);

    const hasRole = (role) => {
        if (!user?.roles) return false;
        return user.roles.includes(role);
    };

    const contextValue = {
        user,
        accessToken,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
