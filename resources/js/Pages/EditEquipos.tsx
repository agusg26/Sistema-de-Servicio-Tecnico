import { useState, FormEvent, useEffect, useMemo } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { MainLayout } from '@/Layouts/MainLayout';
import ModalNuevaReparacion from '@/Components/ModalNuevaReparacion';
import ModalEditarReparacion from '@/Components/ModalEditarReparacion';
import {
    Save,
    Plus,
    Wrench,
    ArrowLeft,
    Package,
    Laptop,
    User,
    CheckCircle2,
    Pencil,
    Trash2,
    Clock,
    Lock,
    CheckCircle,
    Mail,
} from 'lucide-react';

interface Presupuesto {
    id?: number;
    monto: number;
    equipo_id: number;
    aprobado: boolean | null;
}

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

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface Reparacion {
    id: number;
    equipo_id: number;
    titulo: string;
    descripcion: string;
    costo: number;
    repuesto_id: number | null;
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
    email?: string;
}

interface Equipo {
    id: number;
    nombre: string;
    estado_id: number;
    cliente_id?: number;
    cliente?: Cliente;
    estado?: Estado;
    user_id: number | null;
    presupuesto?: Presupuesto;
    user?: User;
    tecnico?: User;
    created_at?: string;
}

interface Props {
    equipo: Equipo;
    estados: Estado[];
    reparaciones: Reparacion[];
    repuestos: Repuesto[];
    presupuesto: Presupuesto;
    users: User[];
}

interface SharedAuth {
    user: {
        id: number;
        name: string;
        email: string;
        roles: string[];
    };
}

export default function EditEquipos({
    equipo,
    estados = [],
    reparaciones = [],
    repuestos = [],
    users = [],
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reparacionAEditar, setReparacionAEditar] = useState<Reparacion | null>(null);
    const { auth } = usePage<{ auth: SharedAuth }>().props;

    const hasRole = (...rolesPermitidos: string[]) => {
        if (!auth.user?.roles) return false;
        return rolesPermitidos.some((rol) => auth.user.roles.includes(rol));
    };

    const isAdmin = hasRole('admin', 'super admin');


    const estadoPresupuesto = equipo.presupuesto?.aprobado;
    const [enviandoMail, setEnviandoMail] = useState(false);

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
        user_id: equipo.user_id ?? '',
    });

    const handleEquipoSubmit = (e: FormEvent) => {
        e.preventDefault();
        putEquipo(route('equipos.update', equipo.id));
    };

    useEffect(() => {
        setEquipoData('estado_id', equipo.estado_id);
    }, [equipo.estado_id]);

    const handleCambiarEstado = (nombreEstado: string, mensajeConfirmacion: string) => {
        const estadoSeleccionado = estados.find(
            (e) => e.nombre.toLowerCase() === nombreEstado.toLowerCase()
        );
        if (!estadoSeleccionado) {
            alert(`No se encontró un estado con el nombre "${nombreEstado}"`);
            return;
        }
        if (!confirm(mensajeConfirmacion)) {
            return;
        }
        router.put(
            route('equipos.update', equipo.id),
            {
                nombre: equipo.nombre,
                estado_id: estadoSeleccionado.id,
                user_id: equipo.user_id ?? '',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEquipoData('estado_id', estadoSeleccionado.id);
                },
            }
        );
    };

    const handleAprobarPresupuesto = () => {
        if (reparacionesVisibles.length === 0) {
            alert('Debes agregar al menos una reparación antes de aprobar el presupuesto.');
            return;
        }

        if (!confirm('¿Deseas aprobar el presupuesto de este equipo? Una vez aprobado no se podrán alterar las reparaciones.')) {
            return;
        }

        router.put(
            route('equipos.update', equipo.id),
            {
                nombre: equipo.nombre,
                estado_id: equipo.estado_id,
                user_id: equipo.user_id ?? '',
                presupuesto_aprobado: true,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const handleDeleteReparacion = (rep: Reparacion) => {
        if (estadoPresupuesto !== null && estadoPresupuesto !== undefined) {
            alert('No se pueden modificar reparaciones de un presupuesto ya aprobado.');
            return;
        }

        if (!confirm(`¿Estás seguro de quitar la reparación "${rep.titulo}"?`)) {
            return;
        }

        router.put(
            route('reparaciones.update', rep.id),
            {
                titulo: rep.titulo,
                descripcion: rep.descripcion,
                costo: rep.costo,
                presupuesto_aprobado: false,
                repuesto_id: null,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const reparacionesVisibles = useMemo(() => {
        return reparaciones.filter(
            (rep) => rep.presupuesto_aprobado === true || rep.presupuesto_aprobado == null
        );
    }, [reparaciones]);

    const montoPresupuesto = Number(equipo.presupuesto?.monto) || 0;

    const estadoActualNombre =
        estados.find((e) => e.id === equipoData.estado_id)?.nombre ||
        equipo.estado?.nombre ||
        'Sin estado';

    const tecnicoAsignadoNombre =
        users.find((u) => u.id === equipoData.user_id)?.name ||
        equipo.tecnico?.name ||
        equipo.user?.name ||
        'Sin técnico asignado';
    const handleEnviarNotificacion = () => {
        if (!equipo.cliente?.email) {
            alert('El cliente no tiene un email registrado en el sistema.');
            return;
        }

        if (reparacionesVisibles.length === 0) {
            alert('Debes registrar al menos una reparación antes de enviar el presupuesto.');
            return;
        }

        if (!confirm(`¿Enviar el presupuesto por correo a ${equipo.cliente.email}?`)) {
            return;
        }

        setEnviandoMail(true);

        router.post(
            route('equipos.notificarPresupuesto', equipo.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setEnviandoMail(false),
                onSuccess: () => alert('Correo enviado correctamente.'),
                onError: (errors) => alert(errors.email || 'Error al enviar el correo.'),
            }
        );
    };

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

                    <div className="flex flex-wrap items-center gap-3">
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
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
                    {/* COLUMNA IZQUIERDA: FORMULARIO DEL EQUIPO */}
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

                                {/* ESTADO ACTUAL */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-400 uppercase">
                                        Estado Actual
                                    </label>
                                    {isAdmin ? (
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
                                    ) : (
                                        <div className="flex h-11 w-full items-center border border-[#1f1f1f] bg-[#070707] px-4 text-sm text-gray-300">
                                            <span className="inline-flex items-center gap-2 font-bold text-lime-400">
                                                <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
                                                {estadoActualNombre}
                                            </span>
                                        </div>
                                    )}
                                    {equipoErrors.estado_id && (
                                        <p className="mt-1.5 text-xs font-bold text-red-400">
                                            {equipoErrors.estado_id}
                                        </p>
                                    )}
                                </div>

                                {/* TÉCNICO ASIGNADO */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-400 uppercase">
                                        Técnico Asignado
                                    </label>
                                    {isAdmin ? (
                                        <select
                                            value={equipoData.user_id ?? ''}
                                            onChange={(e) => setEquipoData('user_id', e.target.value ? Number(e.target.value) : '')}
                                            className="h-11 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-0"
                                        >
                                            <option value="" className="bg-[#111111] text-gray-500">
                                                Seleccionar técnico...
                                            </option>
                                            {users?.map((usr) => (
                                                <option key={usr.id} value={usr.id} className="bg-[#111111] text-white">
                                                    {usr.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="flex h-11 w-full items-center border border-[#1f1f1f] bg-[#070707] px-4 text-sm text-gray-300">
                                            <span className="font-semibold text-gray-200">
                                                {tecnicoAsignadoNombre}
                                            </span>
                                        </div>
                                    )}
                                    {equipoErrors.user_id && (
                                        <p className="mt-1.5 text-xs font-bold text-red-400">
                                            {equipoErrors.user_id}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded border border-[#1f1f1f] bg-[#080808] p-4 text-xs space-y-2">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Total de reparaciones visibles:</span>
                                        <span className="font-bold text-white">{reparacionesVisibles.length}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Gasto total acumulado:</span>
                                        <span className="font-bold text-lime-400 font-mono">
                                            ${montoPresupuesto.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400 border-t border-[#1a1a1a] pt-2">
                                        <span>Estado del presupuesto:</span>
                                        <span className={`font-bold uppercase tracking-wider ${estadoPresupuesto === true ? 'text-lime-400' : estadoPresupuesto === false ? 'text-red-400' : 'text-amber-400'}`}>
                                            {estadoPresupuesto === true ? 'Aprobado' : estadoPresupuesto === false ? 'Rechazado' : 'Pendiente de aprobación'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={equipoProcessing}
                                        className="flex w-full items-center justify-center gap-2 bg-gray-700 px-6 py-3 text-xs font-black tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
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
                                        {reparacionesVisibles.length}
                                    </span>
                                </div>

                                {/* Si el presupuesto está aprobado o rechazado, no se pueden sumar más reparaciones */}
                                {estadoPresupuesto === null ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 border border-lime-400/40 bg-lime-400/10 px-4 py-2 text-xs font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black"
                                    >
                                        <Plus size={16} />
                                        AGREGAR REPARACIÓN
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                                        <Lock size={14} /> Presupuesto bloqueado
                                    </span>
                                )}
                            </div>

                            <div className="p-6">
                                {reparacionesVisibles.length === 0 ? (
                                    <div className="py-12 px-4 text-center border border-dashed border-[#262626] bg-[#080808]">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-gray-500">
                                            <Wrench size={22} />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-300">
                                            No hay reparaciones aprobadas o registradas
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                                            Este equipo aún no posee intervenciones técnicas cargadas.
                                        </p>
                                        {estadoPresupuesto === null && (
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(true)}
                                                className="mt-4 inline-flex items-center gap-2 bg-lime-400 px-4 py-2 text-xs font-black tracking-wider text-black transition hover:bg-lime-300"
                                            >
                                                <Plus size={14} />
                                                REGISTRAR PRIMERA REPARACIÓN
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reparacionesVisibles.map((rep) => (
                                            <div
                                                key={rep.id}
                                                className="border border-[#202020] bg-[#0f0f0f] p-4 transition hover:border-[#383838] hover:bg-[#131313]"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#1f1f1f] pb-3">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-400 leading-relaxed">
                                                            <b>{rep.titulo}</b>
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-black text-lime-400 font-mono mr-2">
                                                            ${Number(rep.costo).toLocaleString('es-AR')}
                                                        </span>

                                                        {/* Acciones de edición y eliminación: solo si NO está evaluado */}
                                                        {estadoPresupuesto === null && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setReparacionAEditar(rep)}
                                                                    className="flex items-center gap-1.5 rounded border border-[#2a2a2a] bg-[#141414] px-2.5 py-1 text-xs font-bold text-gray-300 transition hover:border-lime-400/40 hover:bg-lime-400/10 hover:text-lime-400"
                                                                    title="Editar esta reparación"
                                                                >
                                                                    <Pencil size={13} />
                                                                    <span>Editar</span>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteReparacion(rep)}
                                                                    className="flex items-center gap-1.5 rounded border border-[#2a2a2a] bg-[#141414] px-2.5 py-1 text-xs font-bold text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                                                                    title="Quitar esta reparación del presupuesto"
                                                                >
                                                                    <Trash2 size={13} />
                                                                    <span>Quitar</span>
                                                                </button>
                                                            </>
                                                        )}
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
                                                ${montoPresupuesto.toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* BARRA INFERIOR DE ACCIONES */}
                            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#1f1f1f] bg-[#0c0c0c] p-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCambiarEstado(
                                            'Cancelado',
                                            '¿Estás seguro de cancelar la reparación del equipo?'
                                        )
                                    }
                                    className="inline-flex items-center gap-2 bg-red-400 px-4 py-2 text-xs font-black tracking-wider text-black transition hover:bg-red-300"
                                >
                                    CANCELAR REPARACIÓN
                                </button>

                                {/* 1. Si está en borrador: mostrar botón de Aprobar */}
                                {estadoPresupuesto === null && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleEnviarNotificacion}
                                            disabled={enviandoMail || reparacionesVisibles.length === 0}
                                            className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 text-xs font-black tracking-wider text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Mail size={15} />
                                            {enviandoMail ? 'ENVIANDO...' : 'NOTIFICAR PRESUPUESTO (MAIL)'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAprobarPresupuesto}
                                            disabled={reparacionesVisibles.length === 0}
                                            className="inline-flex items-center gap-2 bg-amber-400 px-4 py-2 text-xs font-black tracking-wider text-black transition hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle size={15} />
                                            APROBAR PRESUPUESTO (EN LOCAL)
                                        </button>
                                    </div>
                                )}

                                {/* 2. ÚNICAMENTE si está APROBADO: mostrar botón de Terminar */}
                                {estadoPresupuesto === true && equipo.estado_id !== 5 && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 bg-lime-400 px-4 py-2 text-xs font-black tracking-wider text-black transition hover:bg-lime-300"
                                        onClick={() =>
                                            handleCambiarEstado(
                                                'Reparacion Completa',
                                                equipo.cliente?.email
                                                    ? `¿Confirmar finalización? Se enviará un email a ${equipo.cliente.email} notificando el retiro.`
                                                    : '¿Estás seguro de marcar como terminada la reparación?'
                                            )
                                        }
                                    >
                                        TERMINAR REPARACIÓN
                                    </button>

                                )}

                                {/* 3. Si está RECHAZADO: mostrar aviso estático sin botón de finalizar */}
                                {estadoPresupuesto === false && (
                                    <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold uppercase tracking-wider">
                                        <Lock size={14} /> Reparación cancelada
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE NUEVA REPARACIÓN */}
            <ModalNuevaReparacion
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                equipoId={equipo.id}
                equipoNombre={equipo.nombre}
                equipoEstado={equipo.estado_id}
                repuestos={repuestos}
            />

            {/* MODAL DE EDICIÓN DE REPARACIÓN */}
            <ModalEditarReparacion
                isOpen={reparacionAEditar !== null}
                onClose={() => setReparacionAEditar(null)}
                reparacion={reparacionAEditar}
                equipoNombre={equipo.nombre}
                repuestos={repuestos}
            />
        </MainLayout>
    );
}