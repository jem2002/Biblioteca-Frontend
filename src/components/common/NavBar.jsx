import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/roles.js';

export default function Navbar() {
    const { user, isAuthenticated, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                <Link to="/catalog" className="text-xl font-semibold text-university-900">
                    Biblioteca U
                </Link>

                <nav className="flex items-center gap-3">
                    <Link className="text-sm font-medium text-slate-700 hover:text-university-700" to="/catalog">
                        Catálogo
                    </Link>
                    {isAuthenticated && hasRole(ROLES.ADMIN) && (
                        <Link className="text-sm font-medium text-slate-700 hover:text-university-700" to="/admin">
                            Admin
                        </Link>
                    )}
                    {!isAuthenticated ? (
                        <Link className="rounded-full bg-university-600 px-4 py-2 text-sm text-white hover:bg-university-700" to="/login">
                            Iniciar sesión
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                        >
                            Cerrar sesión
                        </button>
                    )}
                </nav>
            </div>
            {isAuthenticated && user && (
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:px-6">
                    <span className="block sm:inline">Usuario: <strong>{user.username}</strong></span>
                    <span className="mt-2 inline-block sm:ml-4">Roles:</span>
                    <span className="mt-2 flex flex-wrap gap-2 sm:ml-2 sm:mt-0">
                        {user.roles.map((role) => (
                            <span key={role} className="rounded-full bg-university-100 px-3 py-1 text-xs font-semibold text-university-800">
                                {role}
                            </span>
                        ))}
                    </span>
                </div>
            )}
        </header>
    );
}
