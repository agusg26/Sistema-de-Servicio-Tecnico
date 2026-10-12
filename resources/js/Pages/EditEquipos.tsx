import { useState, FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { MainLayout } from '@/Layouts/MainLayout';
import ModalNuevaReparacion from '@/Components/ModalNuevaReparacion';
import {
    Save,
    Plus,
    Wrench,
    ArrowLeft,
    Package,
    Laptop,
    User,
    CheckCircle2,
    Clock,
} from 'lucide-react';

interface Estado {
    id: number;
    nombre: string;
    color?: string;
}

interface Repuesto {
    id: number;
    nombre: string;
    precio_unitario?: number;
    marca?: string;
    stock?: number;
}

interface Reparacion {
    id: number;
    titulo: string;
    descripcion: string;
    costo: number;
    repuesto_id: number;
    presupuesto_aprobado?: boolean;
    created_at?: string;
    repuesto?: Repuesto;
}

interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    dni?: string;
    telefono?: string;
}

interface Equipo {
    id: number;
    nombre: string;
    estado_id: number;
    cliente_id?: number;
    cliente?: Cliente;
    estado?: Estado;
    created_at?: string;
}

interface Props {
    equipo: Equipo;
    estados: Estado[];
    reparaciones: Reparacion[];
    repuestos: Repuesto[];
}

export default function EditEquipos({ equipo, estados = [], reparaciones = [], repuestos = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const {
        data: equipoData,
        setData: setEquipoData,
        put: putEquipo,
        processing: equipoProcessing,
        errors: equipoErrors,
        recentlySuccessful: equipoSuccess,
    } = useForm({
        nombre: equipo.nombre || '',
        estado_id: equipo.estado_id || (estados.length > 0 ? estados[0].id : 1),
    });

    const handleEquipoSubmit = (e: FormEvent) => {
        e.preventDefault();
        putEquipo(route('equipos.update', equipo.id));
    };

    const totalCostoReparaciones = reparaciones.reduce((acc, rep) => acc + (Number(rep.costo) || 0), 0);

    return (
        <MainLayout>
            <Head title={`Editar Equipo #${equipo.id} - ${equipo.nombre}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-5">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('equipos.index')}
                            className="flex items-center gap-2 border border-[#292929] bg-[#0d0d0d] px-3.5 py-2 text-xs font-black tracking-wider text-gray-400 transition hover:border-gray-600 hover:text-white"
                        >
                            <ArrowLeft size={14} />
                            VOLVER
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="rounded bg-lime-400/10 px-2 py-0.5 text-xs font-black text-lime-400">
                                    #{equipo.id}
                                </span>
                                <h1 className="text-xl font-black tracking-wide text-white sm:text-2xl">
                                    {equipo.nombre}
                                </h1>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Gestión y control de ficha técnica del equipo
                            </p>
                        </div>
                    </div>

                    {equipo.cliente && (
                        <div className="flex items-center gap-2 rounded border border-[#292929] bg-[#0c0c0c] px-3.5 py-2 text-xs">
                            <User size={14} className="text-lime-400" />
                            <span className="text-gray-400">Cliente:</span>
                            <span className="font-bold text-gray-100">
                                {equipo.cliente.nombre} {equipo.cliente.apellido}
                            </span>
                            {equipo.cliente.dni && (
                                <span className="text-gray-500 font-mono">({equipo.cliente.dni})</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">

                    {/*COLUMNA IZQUIERDA: FORMULARIO DEL EQUIPO*/}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="border border-[#292929] bg-[#0b0b0b] shadow-xl overflow-hidden">
                            <div className="flex items-center justify-between border-b border-[#292929] px-6 py-4 bg-[#0e0e0e]">
                                <div className="flex items-center gap-2.5">
                                    <Laptop size={18} className="text-lime-400" />
                                    <h2 className="text-sm font-black tracking-widest text-gray-200 uppercase">
                                        Datos del Equipo
                                    </h2>
                                </div>
                                <span className="text-xs font-bold text-gray-500">ID: {equipo.id}</span>
                            </div>

                            <form onSubmit={handleEquipoSubmit} className="p-6 space-y-5">
                                {equipoSuccess && (
                                    <div className="flex items-center gap-2 rounded border border-lime-400/30 bg-lime-400/10 p-3 text-xs font-bold text-lime-400">
                                        <CheckCircle2 size={16} />
                                        <span>Equipo actualizado correctamente</span>
                                    </div>
                                )}

                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-400 uppercase">
                                        Nombre / Modelo del Equipo <span className="text-lime-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={equipoData.nombre}
                                        onChange={(e) => setEquipoData('nombre', e.target.value)}
                                        placeholder="Ej. Notebook Asus ROG Zephyrus"
                                        className="h-11 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-0"
                                    />
                                    {equipoErrors.nombre && (
                                        <p className="mt-1.5 text-xs font-bold text-red-400">
                                            {equipoErrors.nombre}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-400 uppercase">
                                        Estado Actual <span className="text-lime-400">*</span>
                                    </label>
                                    <select
                                        value={equipoData.estado_id}
                                        onChange={(e) => setEquipoData('estado_id', Number(e.target.value))}
                                        className="h-11 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-0"
                                    >
                                        {estados?.map((est) => (
                                            <option key={est.id} value={est.id} className="bg-[#111111] text-white">
                                                {est.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {equipoErrors.estado_id && (
                                        <p className="mt-1.5 text-xs font-bold text-red-400">
                                            {equipoErrors.estado_id}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded border border-[#1f1f1f] bg-[#080808] p-4 text-xs space-y-2">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Total de reparaciones:</span>
                                        <span className="font-bold text-white">{reparaciones.length}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Gasto total acumulado:</span>
                                        <span className="font-bold text-lime-400 font-mono">
                                            ${totalCostoReparaciones.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={equipoProcessing}
                                        className="flex w-full items-center justify-center gap-2 bg-lime-400 px-6 py-3 text-xs font-black tracking-wider text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {equipoProcessing ? 'GUARDANDO...' : 'GUARDAR CAMBIOS DEL EQUIPO'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: REPARACIONES ASOCIADAS */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="border border-[#292929] bg-[#0b0b0b] shadow-xl overflow-hidden">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#292929] px-6 py-4 bg-[#0e0e0e]">
                                <div className="flex items-center gap-2.5">
                                    <Wrench size={18} className="text-lime-400" />
                                    <h2 className="text-sm font-black tracking-widest text-gray-200 uppercase">
                                        Reparaciones Asociadas
                                    </h2>
                                    <span className="rounded-full bg-[#1e1e1e] border border-[#333333] px-2.5 py-0.5 text-xs font-bold text-lime-400">
                                        {reparaciones.length}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 border border-lime-400/40 bg-lime-400/10 px-4 py-2 text-xs font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black"
                                >
                                    <Plus size={16} />
                                    AGREGAR REPARACIÓN
                                </button>
                            </div>

                            <div className="p-6">
                                {reparaciones.length === 0 ? (
                                    <div className="py-12 px-4 text-center border border-dashed border-[#262626] bg-[#080808]">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-gray-500">
                                            <Wrench size={22} />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-300">
                                            No hay reparaciones registradas
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                                            Este equipo aún no posee intervenciones técnicas ni reparaciones vinculadas.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="mt-4 inline-flex items-center gap-2 bg-lime-400 px-4 py-2 text-xs font-black tracking-wider text-black transition hover:bg-lime-300"
                                        >
                                            <Plus size={14} />
                                            REGISTRAR PRIMERA REPARACIÓN
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reparaciones.map((rep) => (
                                            <div
                                                key={rep.id}
                                                className="border border-[#202020] bg-[#0f0f0f] p-4 transition hover:border-[#383838] hover:bg-[#131313]"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#1f1f1f] pb-3">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-400 leading-relaxed">
                                                            {rep.descripcion}
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="text-base font-black text-lime-400 font-mono">
                                                            ${Number(rep.costo).toLocaleString('es-AR')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                                                    {rep.repuesto ? (
                                                        <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded">
                                                            <Package size={13} />
                                                            <span className="font-semibold">
                                                                Repuesto: {rep.repuesto.nombre}
                                                            </span>
                                                            {rep.repuesto.precio_unitario && (
                                                                <span className="text-blue-300 font-mono text-[11px]">
                                                                    (${Number(rep.repuesto.precio_unitario).toLocaleString('es-AR')})
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-600 italic text-[11px]">
                                                            Sin repuesto asociado
                                                        </span>
                                                    )}

                                                    {rep.created_at && (
                                                        <span className="text-[11px] text-gray-500">
                                                            {new Date(rep.created_at).toLocaleDateString('es-AR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between border-t border-[#292929] pt-4 px-1">
                                            <span className="text-xs font-black tracking-wider text-gray-400 uppercase">
                                                Costo Total de Reparaciones:
                                            </span>
                                            <span className="text-lg font-black text-lime-400 font-mono">
                                                ${totalCostoReparaciones.toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalNuevaReparacion
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                equipoId={equipo.id}
                equipoNombre={equipo.nombre}
                repuestos={repuestos}
            />
        </MainLayout>
    );
}
