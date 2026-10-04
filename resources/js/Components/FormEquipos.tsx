import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Estado {
    id: number;
    nombre: string;
}

interface Props {
    estados: Estado[];
}

export default function CreateEquipos({ estados }: Props) {
    // Estructuramos el estado del formulario agrupado
    const { data, setData, post, processing, errors } = useForm({
        cliente: {
            nombre: '',
            apellido: '',
            dni: '',
            celular: '',
        },
        equipo: {
            nombre: '',
            estado_id: '',
            falla: '',
        },
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/equipos');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nuevo Cliente y Equipo</h1>

            <form onSubmit={submit} className="space-y-6">

                {/* SECCIÓN 1: DATOS DEL CLIENTE */}
                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">1. Información del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nombre</label>
                            <input
                                type="text"
                                value={data.cliente.nombre}
                                onChange={(e) => setData('cliente', { ...data.cliente, nombre: e.target.value })}
                                className="w-full border p-2 rounded mt-1"
                            />
                            {errors['cliente.nombre'] && <div className="text-red-500 text-xs mt-1">{errors['cliente.nombre']}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Apellido</label>
                            <input
                                type="text"
                                value={data.cliente.apellido}
                                onChange={(e) => setData('cliente', { ...data.cliente, apellido: e.target.value })}
                                className="w-full border p-2 rounded mt-1"
                            />
                            {errors['cliente.apellido'] && <div className="text-red-500 text-xs mt-1">{errors['cliente.apellido']}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">DNI</label>
                            <input
                                type="text"
                                value={data.cliente.dni}
                                onChange={(e) => setData('cliente', { ...data.cliente, dni: e.target.value })}
                                className="w-full border p-2 rounded mt-1"
                            />
                            {errors['cliente.dni'] && <div className="text-red-500 text-xs mt-1">{errors['cliente.dni']}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Celular</label>
                            <input
                                type="text"
                                value={data.cliente.celular}
                                onChange={(e) => setData('cliente', { ...data.cliente, celular: e.target.value })}
                                className="w-full border p-2 rounded mt-1"
                            />
                            {errors['cliente.celular'] && <div className="text-red-500 text-xs mt-1">{errors['cliente.celular']}</div>}
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: DATOS DEL EQUIPO (Sin campo cliente) */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">2. Información del Equipo</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nombre / Modelo del Equipo</label>
                            <input
                                type="text"
                                value={data.equipo.nombre}
                                onChange={(e) => setData('equipo', { ...data.equipo, nombre: e.target.value })}
                                className="w-full border p-2 rounded mt-1"
                            />
                            {errors['equipo.nombre'] && <div className="text-red-500 text-xs mt-1">{errors['equipo.nombre']}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Estado Inicial</label>
                            <select
                                value={data.equipo.estado_id}
                                onChange={(e) => setData('equipo', { ...data.equipo, estado_id: e.target.value })}
                                className="w-full border p-2 rounded mt-1"
                            >
                                <option value="">Seleccione un estado</option>
                                {estados.map((est) => (
                                    <option key={est.id} value={est.id}>
                                        {est.nombre.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {errors['equipo.estado_id'] && <div className="text-red-500 text-xs mt-1">{errors['equipo.estado_id']}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Falla / Observaciones</label>
                            <textarea
                                value={data.equipo.falla}
                                onChange={(e) => setData('equipo', { ...data.equipo, falla: e.target.value })}
                                className="w-full border p-2 rounded mt-1"
                            />
                            {errors['equipo.falla'] && <div className="text-red-500 text-xs mt-1">{errors['equipo.falla']}</div>}
                        </div>
                    </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Link href="/equipos" className="text-gray-600 hover:underline">
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Guardando...' : 'Registrar Todo'}
                    </button>
                </div>
            </form>
        </div>
    );
}