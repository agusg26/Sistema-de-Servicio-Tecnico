import { Head, Link, usePage } from '@inertiajs/react';
import { MainLayout } from '@/Layouts/MainLayout';
import {
    ArrowLeft,
    Laptop,
    User,
    Wrench,
    Clock,
    Calendar,
    Phone,
    Mail,
    CreditCard,
    Pencil,
    History,
} from 'lucide-react';

interface Estado {
    id: number;
    nombre: string;
    color?: string;
}

interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    dni?: string;
    telefono?: string;
    email?: string | null;
}

interface Tecnico {
    id: number;
    name: string;
    email: string;
}

interface Presupuesto {
    id: number;
    monto: number;
    aprobado: boolean | null;
}

interface HistorialEstadoItem {
    id: number;
    equipo_id: number;
    estado_id: number;
    observaciones?: string | null;
    created_at?: string;
    estado?: Estado;
}

interface Equipo {
    id: number;
    nombre: string;
    estado_id: number;
    cliente_id?: number;
    user_id: number | null;
    created_at?: string;
    updated_at?: string;
    cliente?: Cliente;
    estado?: Estado;
    tecnico?: Tecnico | null;
    presupuesto?: Presupuesto | null;
    historial?: HistorialEstadoItem[];
}

interface Props {
    equipo: Equipo;
}

interface SharedAuth {
    user?: {
        id: number;
        name: string;
        email: string;
        roles?: (string | { name: string })[];
        role?: string;
    };
}

// Fila de información reutilizable
function InfoRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-1 gap-1 border-b border-[#252525] px-4 py-3 last:border-b-0 sm:grid-cols-[155px_1fr] sm:items-center">
            <span className="text-sm text-gray-400">
                {label}
            </span>

            <div className="text-sm font-bold text-gray-100">
                {children}
            </div>
        </div>
    );
}

// Panel reutilizable con encabezado centrado
function DetailPanel({
    title,
    children,
    className = '',
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`overflow-hidden border border-[#303030] bg-[#0d0d0d] ${className}`}
        >
            <div className="border-b border-[#303030] px-4 py-4 text-center">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                    {title}
                </h2>
            </div>

            <div>
                {children}
            </div>
        </section>
    );
}

export default function ShowEquipos({ equipo }: Props) {
    const { auth } = usePage().props as unknown as {
        auth: SharedAuth;
    };

    const currentUser = auth?.user;

    const hasRole = (...rolesPermitidos: string[]) => {
        if (!currentUser) return false;

        if (Array.isArray(currentUser.roles)) {
            const rolesLower = currentUser.roles.map((r: any) =>
                (typeof r === 'string' ? r : r.name || '').toLowerCase()
            );

            return rolesPermitidos.some((rol) =>
                rolesLower.includes(rol.toLowerCase())
            );
        }

        if (typeof currentUser.role === 'string') {
            return rolesPermitidos.some(
                (rol) =>
                    rol.toLowerCase() === currentUser.role?.toLowerCase()
            );
        }

        return false;
    };


    const formatDateTime = (isoString?: string) => {
        if (!isoString) return 'Sin fecha';

        const d = new Date(isoString);

        if (isNaN(d.getTime())) return isoString;

        return d.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const historial = equipo.historial ?? [];
    const estadoPresupuesto = equipo.presupuesto?.aprobado;
    const montoPresupuesto = Number(equipo.presupuesto?.monto) || 0;

    return (
        <MainLayout>
            <Head title={`Detalle de Equipo #${equipo.id} - ${equipo.nombre}`} />

            <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">

                {/* CABECERA */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-5">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('equipos.index')}
                            className="flex items-center gap-2 border border-[#303030] bg-[#0d0d0d] px-3.5 py-2 text-xs font-black tracking-wider text-gray-400 transition hover:border-lime-400 hover:text-lime-400"
                        >
                            <ArrowLeft size={14} />
                            VOLVER
                        </Link>

                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="bg-lime-400/10 px-2 py-0.5 text-xs font-black text-lime-400">
                                    #{equipo.id}
                                </span>

                                <h1 className="text-xl font-black tracking-wide text-white sm:text-2xl">
                                    {equipo.nombre}
                                </h1>

                                {equipo.estado && (
                                    <span
                                        className="inline-flex items-center gap-2 border px-3 py-1 text-xs font-bold"
                                        style={{
                                            backgroundColor: `${equipo.estado.color || '#888'}15`,
                                            borderColor: `${equipo.estado.color || '#888'}40`,
                                            color: equipo.estado.color || '#fff',
                                        }}
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    equipo.estado.color || '#888',
                                            }}
                                        />
                                        {equipo.estado.nombre}
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                                Detalle y seguimiento del equipo
                            </p>
                        </div>
                    </div>
                </div>

                {/* INFORMACIÓN GENERAL */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* INFORMACIÓN DEL EQUIPO */}
                    <DetailPanel title="Información del equipo">
                        <InfoRow label="Nombre del equipo">
                            <span>{equipo.nombre}</span>
                        </InfoRow>

                        <InfoRow label="Estado actual">
                            <span className="inline-flex items-center gap-2">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            equipo.estado?.color || '#a3e635',
                                    }}
                                />
                                <span
                                    style={{
                                        color:
                                            equipo.estado?.color || '#a3e635',
                                    }}
                                >
                                    {equipo.estado?.nombre || 'Sin estado'}
                                </span>
                            </span>
                        </InfoRow>

                        <InfoRow label="Fecha de ingreso">
                            <span className="flex items-center gap-2">
                                <Calendar
                                    size={14}
                                    className="text-lime-400"
                                />
                                {formatDateTime(equipo.created_at)}
                            </span>
                        </InfoRow>

                        <InfoRow label="Presupuesto">
                            <span className="flex flex-wrap items-center gap-3">
                                <span className="font-mono text-lime-400">
                                    ${montoPresupuesto.toLocaleString('es-AR')}
                                </span>

                                <span
                                    className={`text-xs font-black uppercase tracking-wider ${estadoPresupuesto === true
                                        ? 'text-lime-400'
                                        : estadoPresupuesto === false
                                            ? 'text-red-400'
                                            : 'text-amber-400'
                                        }`}
                                >
                                    {estadoPresupuesto === true
                                        ? 'Aprobado'
                                        : estadoPresupuesto === false
                                            ? 'Rechazado'
                                            : 'Pendiente'}
                                </span>
                            </span>
                        </InfoRow>

                        <InfoRow label="Técnico a cargo">
                            {equipo.tecnico ? (
                                <div>
                                    <p className="text-white">
                                        {equipo.tecnico.name}
                                    </p>
                                    <p className="mt-0.5 text-xs font-normal text-gray-500">
                                        {equipo.tecnico.email}
                                    </p>
                                </div>
                            ) : (
                                <span className="font-normal italic text-gray-500">
                                    Sin técnico asignado
                                </span>
                            )}
                        </InfoRow>
                    </DetailPanel>

                    {/* INFORMACIÓN DEL CLIENTE */}
                    <DetailPanel title="Información del cliente">
                        {equipo.cliente ? (
                            <>
                                <InfoRow label="Nombre y apellido">
                                    {equipo.cliente.nombre}{' '}
                                    {equipo.cliente.apellido}
                                </InfoRow>

                                <InfoRow label="Documento (DNI)">
                                    <span className="flex items-center gap-2">
                                        <CreditCard
                                            size={14}
                                            className="text-lime-400"
                                        />
                                        {equipo.cliente.dni || 'No registrado'}
                                    </span>
                                </InfoRow>

                                <InfoRow label="Teléfono">
                                    <span className="flex items-center gap-2">
                                        <Phone
                                            size={14}
                                            className="text-lime-400"
                                        />
                                        {equipo.cliente.telefono || 'No registrado'}
                                    </span>
                                </InfoRow>

                                <InfoRow label="Correo electrónico">
                                    <span className="flex items-center gap-2 break-all">
                                        <Mail
                                            size={14}
                                            className="shrink-0 text-lime-400"
                                        />
                                        {equipo.cliente.email ||
                                            'Sin correo electrónico registrado'}
                                    </span>
                                </InfoRow>

                                <InfoRow label="Identificador">
                                    <span className="text-lime-400">
                                        #{equipo.cliente.id}
                                    </span>
                                </InfoRow>
                            </>
                        ) : (
                            <div className="px-4 py-8 text-center text-sm italic text-gray-500">
                                No hay información de cliente vinculada a este equipo.
                            </div>
                        )}
                    </DetailPanel>
                </div>

                {/* HISTORIAL DE ESTADOS */}
                <DetailPanel title="Historial de estados del equipo">
                    {historial.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                            <Clock
                                size={26}
                                className="mx-auto mb-3 text-gray-600"
                            />

                            <h3 className="text-sm font-bold text-gray-300">
                                Sin registros en el historial
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Aún no se han registrado cambios de estado para este equipo.
                            </p>
                        </div>
                    ) : (
                        <div className="px-4">
                            {historial.map((item, idx) => {
                                const color =
                                    item.estado?.color || '#a3e635';

                                const isLatest = idx === 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-1 gap-2 border-b border-[#252525] py-4 last:border-b-0 sm:grid-cols-[180px_1fr_190px] sm:items-center"
                                    >
                                        {/* ESTADO */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                            />

                                            <span
                                                className="text-sm font-bold"
                                                style={{ color }}
                                            >
                                                {item.estado?.nombre ||
                                                    `Estado #${item.estado_id}`}
                                            </span>

                                            {isLatest && (
                                                <span className="bg-lime-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-lime-400">
                                                    Actual
                                                </span>
                                            )}
                                        </div>

                                        {/* OBSERVACIONES */}
                                        <div className="text-sm text-gray-400">
                                            {item.observaciones || (
                                                <span className="italic text-gray-600">
                                                    Sin observaciones
                                                </span>
                                            )}
                                        </div>

                                        {/* FECHA */}
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 sm:justify-end">
                                            <Clock
                                                size={13}
                                                className="shrink-0 text-lime-400"
                                            />
                                            {formatDateTime(item.created_at)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </DetailPanel>
            </div>
        </MainLayout>
    );
}