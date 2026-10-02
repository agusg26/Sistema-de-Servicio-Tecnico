import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Estado {
    id: number;
    nombre: string;
}

interface Props {
    estados: Estado[]; // Pasados desde el controlador de Laravel
    clientes: { id: number; nombre: string }[];
}

export default function Create({ estados, clientes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        estado_id: '',
        cliente_id: '',
        falla: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/equipos');
    };

    return (
        <div>
            <h1>Nuevo Equipo</h1>
            <form onSubmit={submit}>
                <div>
                    <label>Nombre del Equipo / Marca</label>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                    />
                    {errors.nombre && <div style={{ color: 'red' }}>{errors.nombre}</div>}
                </div>

                <div>
                    <label>Cliente</label>
                    <select
                        value={data.cliente_id}
                        onChange={(e) => setData('cliente_id', e.target.value)}
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.cliente_id && <div style={{ color: 'red' }}>{errors.cliente_id}</div>}
                </div>

                <div>
                    <label>Estado Inicial</label>
                    <select
                        value={data.estado_id}
                        onChange={(e) => setData('estado_id', e.target.value)}
                    >
                        <option value="">Seleccione un estado</option>
                        {estados.map((est) => (
                            <option key={est.id} value={est.id}>
                                {est.nombre.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    {errors.estado_id && <div style={{ color: 'red' }}>{errors.estado_id}</div>}
                </div>

                <div>
                    <label>Falla / Observación</label>
                    <textarea
                        value={data.falla}
                        onChange={(e) => setData('falla', e.target.value)}
                    />
                    {errors.falla && <div style={{ color: 'red' }}>{errors.falla}</div>}
                </div>

                <button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar'}
                </button>
            </form>
            <Link href="/equipos">Volver</Link>
        </div>
    );
}