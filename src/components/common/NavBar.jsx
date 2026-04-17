import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/roles.js';

export default function Navbar() {
    const { user, isAuthenticated, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const canManage = hasRole(ROLES.ADMIN) || hasRole(ROLES.BIBLIOTECARIO);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between gap-4">
                    <Link to="/catalog" className="inline-flex items-center gap-3 text-xl font-semibold text-university-900">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-university-600 text-sm font-bold text-slate-50 shadow-sm">
                            B
                        </span>
                        Biblioteca U
                    </Link>
                    <nav className="hidden items-center gap-3 sm:flex">
                        <Link className="text-sm font-medium text-slate-700 hover:text-university-700" to="/catalog">
                            Catálogo
                        </Link>
                        {canManage && (
                            <Link className="text-sm font-medium text-slate-700 hover:text-university-700" to="/admin">
                                Admin
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {!isAuthenticated ? (
                        <Link className="rounded-full bg-university-600 px-4 py-2 text-sm text-slate-50 transition hover:bg-university-700" to="/login">
                            Iniciar sesión
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                            Cerrar sesión
                        </button>
                    )}
                </div>
            </div>

            {isAuthenticated && user && (
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Hola, <span className="font-semibold text-slate-900">{user.username}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {user.roles.map((role) => (
                                <span key={role} className="rounded-full bg-university-100 px-3 py-1 text-xs font-semibold text-university-800">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
