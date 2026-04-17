import { useState } from 'react';
import Spinner from '../common/Spinner.jsx';

const initialForm = {
    title: '',
    author: '',
    isbn: '',
    editorial: '',
    year: '',
    categories: '',
    totalCopies: '',
    availableCopies: '',
    description: '',
};

const buildFormState = (book) => ({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    editorial: book?.editorial || '',
    year: book?.year || '',
    categories: (book?.categories || []).join(', '),
    totalCopies: book?.totalCopies ?? '',
    availableCopies: book?.availableCopies ?? '',
    description: book?.description || '',
});

export default function BookForm({ book, onClose, onSave, loading }) {
    const [form, setForm] = useState(() => (book ? buildFormState(book) : initialForm));
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.title.trim()) nextErrors.title = 'Título es obligatorio';
        if (!form.author.trim()) nextErrors.author = 'Autor es obligatorio';
        if (!form.totalCopies || Number(form.totalCopies) < 1) nextErrors.totalCopies = 'Copias totales debe ser mayor a 0';
        if (form.availableCopies === '' || Number(form.availableCopies) < 0) nextErrors.availableCopies = 'Copias disponibles debe ser 0 o más';
        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate();
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        const payload = {
            title: form.title.trim(),
            author: form.author.trim(),
            isbn: form.isbn.trim() || undefined,
            editorial: form.editorial.trim() || undefined,
            year: form.year ? Number(form.year) : undefined,
            categories: form.categories.split(',').map((tag) => tag.trim()).filter(Boolean),
            totalCopies: Number(form.totalCopies),
            availableCopies: Number(form.availableCopies),
            description: form.description.trim() || undefined,
        };

        await onSave(payload, book?.id);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl ring-1 ring-slate-200 md:p-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-university-600">Gestión de libros</p>
                        <h2 className="mt-2 text-2xl font-semibold text-university-900">
                            {book ? 'Editar libro' : 'Agregar nuevo libro'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Rellena los datos esenciales para mantener tu catálogo ordenado.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cerrar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                    {[
                        { label: 'Título', field: 'title' },
                        { label: 'Autor', field: 'author' },
                        { label: 'ISBN', field: 'isbn' },
                        { label: 'Editorial', field: 'editorial' },
                    ].map(({ label, field }) => (
                        <label key={field} className="block text-sm text-slate-700">
                            <span className="font-medium">{label}</span>
                            <input
                                type="text"
                                value={form[field]}
                                onChange={handleChange(field)}
                                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors[field] && <p className="mt-2 text-xs text-rose-600">{errors[field]}</p>}
                        </label>
                    ))}

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Año</span>
                            <input
                                type="number"
                                value={form.year}
                                onChange={handleChange('year')}
                                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                        </label>
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Categorías</span>
                            <input
                                type="text"
                                value={form.categories}
                                onChange={handleChange('categories')}
                                placeholder="Ej: Clásicos, Historia"
                                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                        </label>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Copias totales</span>
                            <input
                                type="number"
                                value={form.totalCopies}
                                onChange={handleChange('totalCopies')}
                                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors.totalCopies && <p className="mt-2 text-xs text-rose-600">{errors.totalCopies}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Copias disponibles</span>
                            <input
                                type="number"
                                value={form.availableCopies}
                                onChange={handleChange('availableCopies')}
                                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors.availableCopies && <p className="mt-2 text-xs text-rose-600">{errors.availableCopies}</p>}
                        </label>
                    </div>

                    <label className="block text-sm text-slate-700">
                        <span className="font-medium">Descripción</span>
                        <textarea
                            value={form.description}
                            onChange={handleChange('description')}
                            rows="4"
                            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                        />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-full bg-university-600 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Guardando...' : book ? 'Guardar cambios' : 'Crear libro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
