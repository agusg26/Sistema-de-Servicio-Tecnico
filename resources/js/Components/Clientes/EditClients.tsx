import { router, useForm } from '@inertiajs/react';
import { X, Save, Laptop, Calendar, Eye } from 'lucide-react';
import { FormEvent } from 'react';

export interface EstadoEquipo {
    id: number;
    nombre: string;
    color?: string;
}

export interface EquipoCliente {
    id: number;
    nombre: string;
    estado_id: number;
    created_at?: string;
    estado?: EstadoEquipo;
}

interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string | null;
    dni: string;
    equipos?: EquipoCliente[];
}

interface Props {
    cliente: Cliente;
    onClose: () => void;
}

export default function EditClients({ cliente, onClose }: Props) {

    const { data, setData, errors, put, processing } = useForm({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        email: cliente.email,
        dni: cliente.dni,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(`/clientes/${cliente.id}`, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        /*
         * Overlay
         */
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/75
                px-4
                backdrop-blur-sm
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >

            {/* Modal */}
            <div
                className="
                    w-full max-w-5xl
                    overflow-hidden
                    border border-[#292929]
                    bg-[#0b0b0b]
                    shadow-2xl
                "
            >

                <div className="
                    flex items-center justify-between
                    border-b border-[#292929]
                    bg-[#0d0d0d]
                    px-7 py-5
                ">

                    <div>

                        <h2 className="
                            text-xl
                            font-black
                            tracking-tight
                            text-white
                        ">
                            EDITAR CLIENTE
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            border border-[#292929]
                            text-gray-500
                            transition
                            hover:border-gray-500
                            hover:text-white
                        "
                    >
                        <X size={18} />
                    </button>
                </div>


                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* COLUMNA IZQUIERDA: DATOS DEL CLIENTE */}
                        <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2 lg:col-span-7 lg:border-r lg:border-[#292929]">
                            <div>
                                <label className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                ">
                                    NOMBRE
                                </label>

                                <input
                                    type="text"
                                    value={data.nombre}
                                    disabled
                                    className="
                                        h-12 w-full
                                        border border-[#292929]
                                        bg-[#090909]
                                        px-4
                                        text-sm text-white
                                        outline-none
                                        transition
                                        focus:border-lime-400
                                    "
                                />

                                {errors.nombre && (
                                    <p className="
                                        mt-2
                                        text-xs
                                        font-semibold
                                        text-red-400
                                    ">
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                ">
                                    APELLIDO
                                </label>

                                <input
                                    type="text"
                                    value={data.apellido}
                                    disabled
                                    className="
                                        h-12 w-full
                                        border border-[#292929]
                                        bg-[#090909]
                                        px-4
                                        text-sm text-white
                                        outline-none
                                        transition
                                        focus:border-lime-400
                                    "
                                />

                                {errors.apellido && (
                                    <p className="
                                        mt-2
                                        text-xs
                                        font-semibold
                                        text-red-400
                                    ">
                                        {errors.apellido}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                ">
                                    DOCUMENTO
                                </label>

                                <input
                                    type="text"
                                    value={data.dni}
                                    disabled
                                    className="
                                        h-12 w-full
                                        border border-[#292929]
                                        bg-[#090909]
                                        px-4
                                        text-sm text-white
                                        outline-none
                                        transition
                                        focus:border-lime-400
                                    "
                                />

                                {errors.dni && (
                                    <p className="
                                        mt-2
                                        text-xs
                                        font-semibold
                                        text-red-400
                                    ">
                                        {errors.dni}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                ">
                                    TELÉFONO
                                </label>

                                <input
                                    type="text"
                                    value={data.telefono}
                                    onChange={(e) =>
                                        setData('telefono', e.target.value)
                                    }
                                    className="
                                        h-12 w-full
                                        border border-[#292929]
                                        bg-[#090909]
                                        px-4
                                        text-sm text-white
                                        outline-none
                                        transition
                                        focus:border-lime-400
                                    "
                                />

                                {errors.telefono && (
                                    <p className="
                                        mt-2
                                        text-xs
                                        font-semibold
                                        text-red-400
                                    ">
                                        {errors.telefono}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                ">
                                    EMAIL
                                </label>
                                <input
                                    type="text"
                                    value={data.email ?? ''}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    className="
                                        h-12 w-full
                                        border border-[#292929]
                                        bg-[#090909]
                                        px-4
                                        text-sm text-white
                                        outline-none
                                        transition
                                        focus:border-lime-400
                                    "
                                />
                                {errors.email && (
                                    <p className="
                                        mt-2
                                        text-xs
                                        font-semibold
                                        text-red-400
                                    ">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: EQUIPOS REGISTRADOS DEL CLIENTE */}
                        <div className="flex flex-col border-t border-[#292929] p-7 lg:col-span-5 lg:border-t-0">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-black tracking-[0.2em] text-gray-300 uppercase">
                                        Equipos Registrados
                                    </h3>
                                </div>
                                <span className="rounded-full border border-[#333] bg-[#151515] px-2.5 py-0.5 text-xs font-bold text-lime-400">
                                    {cliente.equipos?.length ?? 0}
                                </span>
                            </div>

                            {!cliente.equipos || cliente.equipos.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center border border-dashed border-[#262626] bg-[#080808] p-6 text-center text-xs text-gray-500">
                                    Este cliente no posee equipos registrados.
                                </div>
                            ) : (
                                <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                                    {cliente.equipos.map((equipo) => (
                                        <div
                                            key={equipo.id}
                                            className="flex flex-wrap items-center justify-between gap-2 border border-[#222222] bg-[#090909] px-3.5 py-3 transition hover:border-[#383838]"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-black text-gray-200">
                                                        {equipo.nombre}
                                                    </p>
                                                    {equipo.created_at && (
                                                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                                                            <Calendar size={11} />
                                                            {new Date(
                                                                equipo.created_at
                                                            ).toLocaleDateString('es-AR')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {equipo.estado && (
                                                    <span
                                                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black"
                                                        style={{
                                                            backgroundColor: `${equipo.estado.color || '#888'}15`,
                                                            borderColor: `${equipo.estado.color || '#888'}40`,
                                                            color: equipo.estado.color || '#fff',
                                                        }}
                                                    >
                                                        <span
                                                            className="h-1.5 w-1.5 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    equipo.estado.color || '#888',
                                                            }}
                                                        />
                                                        {equipo.estado.nombre}
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.visit(
                                                            route('equipos.show', equipo.id)
                                                        )
                                                    }
                                                    className="flex items-center gap-1 border border-[#333] px-2.5 py-1 text-[11px] font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
                                                >
                                                    <Eye size={13} />
                                                    VER
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="
                        flex
                        items-center
                        justify-end
                        gap-3
                        border-t border-[#292929]
                        bg-[#0a0a0a]
                        px-7 py-5
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                border border-[#292929]
                                px-5 py-3
                                text-xs
                                font-black
                                tracking-wider
                                text-gray-500
                                transition
                                hover:border-gray-500
                                hover:text-white
                            "
                        >
                            CANCELAR
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="
                                flex items-center gap-2
                                bg-lime-400
                                px-6 py-3
                                text-xs
                                font-black
                                tracking-wider
                                text-black
                                transition
                                hover:bg-lime-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Save size={16} />

                            {processing
                                ? 'GUARDANDO...'
                                : 'GUARDAR CAMBIOS'}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}