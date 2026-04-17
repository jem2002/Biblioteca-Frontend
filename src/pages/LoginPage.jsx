import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setCredentials({ ...credentials, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
        setServerError('');
    };

    const validate = () => {
        const nextErrors = {};
        if (!credentials.usernameOrEmail.trim()) nextErrors.usernameOrEmail = 'Usuario o correo es obligatorio';
        if (!credentials.password.trim()) nextErrors.password = 'Contraseña es obligatoria';
        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate();
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        setServerError('');
        try {
            await login(credentials);
            navigate('/catalog');
        } catch (error) {
            setServerError(error.response?.data?.message || error.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-4 py-10 sm:px-6">
            <div className="grid w-full grid-cols-1 gap-8 rounded-[36px] border border-slate-200 bg-white p-8 shadow-2xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
                <div className="space-y-6">
                    <div className="inline-flex items-center rounded-full bg-university-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-university-700 shadow-sm">
                        Bienvenido de vuelta
                    </div>
                    <div>
                        <h1 className="text-4xl font-semibold text-university-900">Inicia sesión en tu cuenta</h1>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                            Accede al catálogo institucional y revisa la colección de libros disponibles en la biblioteca universitaria.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-6 text-slate-700 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900">Consejo</p>
                        <p className="mt-2 text-sm text-slate-600">Usa el usuario <strong>admin</strong> si quieres probar funciones de administración.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[32px] bg-slate-100 p-6 text-center text-sm text-slate-700">
                        ¿Aún no tienes cuenta? Regístrate y explora el catálogo.
                    </div>

                    {serverError && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">{serverError}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-sm text-slate-700">
                            Usuario o correo
                            <input
                                value={credentials.usernameOrEmail}
                                onChange={handleChange('usernameOrEmail')}
                                className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors.usernameOrEmail && <p className="mt-2 text-xs text-rose-600">{errors.usernameOrEmail}</p>}
                        </label>

                        <label className="block text-sm text-slate-700">
                            Contraseña
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={handleChange('password')}
                                className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors.password && <p className="mt-2 text-xs text-rose-600">{errors.password}</p>}
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-full bg-university-600 px-4 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? <Spinner /> : 'Ingresar'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        <Link to="/register" className="font-semibold text-university-700 hover:text-university-900">
                            Crear cuenta
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
