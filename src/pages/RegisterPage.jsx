import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { register } from '../api/auth.api.js';
import Spinner from '../components/common/Spinner.jsx';

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [success] = useState(location.state?.successMessage || '');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
        setServerError('');
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.username.trim()) nextErrors.username = 'Usuario es obligatorio';
        if (!form.email.trim()) nextErrors.email = 'Email es obligatorio';
        if (!form.password.trim()) nextErrors.password = 'Contraseña es obligatoria';
        if (form.password && form.password.length < 6) nextErrors.password = 'Debe tener al menos 6 caracteres';
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
            await register(form);
            navigate('/login', { state: { successMessage: 'Registro exitoso, ahora inicia sesión.' } });
        } catch (error) {
            setServerError(error.response?.data?.message || error.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-4 py-10 sm:px-6">
            <div className="grid w-full grid-cols-1 gap-8 rounded-[36px] border border-slate-200 bg-white p-8 shadow-2xl lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
                <div className="space-y-6">
                    <div className="inline-flex items-center rounded-full bg-university-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-university-700 shadow-sm">
                        Regístrate ahora
                    </div>
                    <div>
                        <h1 className="text-4xl font-semibold text-university-900">Crea tu cuenta universitaria</h1>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                            Únete al sistema y gestiona tus libros favoritos desde una interfaz limpia y funcional.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-6 text-slate-700 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900">Dato útil</p>
                        <p className="mt-2 text-sm text-slate-600">Usa un correo válido y una contraseña segura para acceder a todas las funciones.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {success && <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700 shadow-sm">{success}</div>}
                    {serverError && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">{serverError}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: 'Usuario', field: 'username', type: 'text' },
                            { label: 'Email', field: 'email', type: 'email' },
                            { label: 'Contraseña', field: 'password', type: 'password' },
                        ].map(({ label, field, type }) => (
                            <label key={field} className="block text-sm text-slate-700">
                                <span className="font-medium">{label}</span>
                                <input
                                    type={type}
                                    value={form[field]}
                                    onChange={handleChange(field)}
                                    className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-university-500 focus:ring-2 focus:ring-university-100"
                                />
                                {errors[field] && <p className="mt-2 text-xs text-rose-600">{errors[field]}</p>}
                            </label>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-full bg-university-600 px-4 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? <Spinner /> : 'Registrar cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-semibold text-university-700 hover:text-university-900">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
