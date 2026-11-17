
import React, { useEffect, useState, useMemo, FormEvent } from 'react';
import { Eye, Pencil, PackageOpen, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import ProductFilters, { FilterOption } from './filter';
import Dashboard from './dashBoard';

const endpoint = '/api/computers';
const ITEMS_PER_PAGE = 6;

interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    celular: string;
}

interface Computer {
    id: number;
    cliente_id: number;
    nombre: string;
    estado_id: number;
    user_id: number;
    created_at?: string;
    updated_at?: string;
    cliente?: Cliente;
    estado?: Estado;
    tecnico?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface Estado {
    id: number;
    nombre: string;
    color: string;
    created_at?: string;
    updated_at?: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles?: (string | { name: string })[];
    role?: string;
}

interface SharedPageProps {
    auth: {
        user: AuthUser;
    };
    users?: { id: number; name: string }[];
    [key: string]: any;
}

type Tab = 'dashboard' | 'asignados' | 'todos';

export default function ShowComputers() {
    const [computers, setComputers] = useState<Computer[]>([]);

    const [search, setSearch] = useState('');
    const [clientName, setClientName] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [dni, setDni] = useState('');
    const [error, setError] = useState('');
    const [currentPageAsignados, setCurrentPageAsignados] = useState(1);
    const [currentPageTodos, setCurrentPageTodos] = useState(1);

    const { auth, users = [] } = usePage<SharedPageProps>().props;
    const user = auth.user;

    // Helper de roles flexible
    const hasRole = (...rolesPermitidos: string[]) => {
        if (!user) return false;

        if (Array.isArray(user.roles)) {
            const rolesLower = user.roles.map((r: any) =>
                (typeof r === 'string' ? r : r.name || '').toLowerCase()
            );

            return rolesPermitidos.some((rol) =>
                rolesLower.includes(rol.toLowerCase())
            );
        }

        if (typeof user.role === 'string') {
            return rolesPermitidos.some(
                (rol) => rol.toLowerCase() === user.role?.toLowerCase()
            );
        }

        return false;
    };

    const isAdmin = hasRole('admin', 'super admin');
    const [activeTab, setActiveTab] = useState<Tab>(
        isAdmin ? 'dashboard' : 'todos'
    );

    // Comprobar si puede editar un equipo específico
    const puedeEditar = (equipoUserId: number | null) => {
        if (isAdmin) return true;
        if (hasRole('tecnico') && equipoUserId === user?.id) return true;
        return false;
    };

    useEffect(() => {
        getAllComputers();
    }, []);

    const getAllComputers = async () => {
        try {
            const response = await axios.get(endpoint);
            setComputers(response.data);
        } catch (error) {
            console.error('Error fetching computers:', error);
        }
    };

    // Opciones de todos los empleados para el select del filtro
    const employeeOptions: FilterOption[] = useMemo(() => {
        if (users.length > 0) {
            return users.map((u) => ({
                label: u.name.toUpperCase(),
                value: String(u.id),
            }));
        }

        const map = new Map<string, string>();
        computers.forEach((c) => {
            if (c.tecnico?.id && c.tecnico?.name) {
                map.set(String(c.tecnico.id), c.tecnico.name.toUpperCase());
            }
        });
        return Array.from(map.entries()).map(([value, label]) => ({
            label,
            value,
        }));
    }, [users, computers]);

    // Extraer todos los estados únicos (incluyendo Cancelado y Retirado para el filtro)
    const statusOptions: FilterOption[] = useMemo(() => {
        const nombres = computers
            .map((c) => c.estado?.nombre)
            .filter(Boolean) as string[];

        const unique = Array.from(new Set(nombres));

        return unique.map((est) => ({
            label: est.toUpperCase(),
            value: est,
        }));
    }, [computers]);

    // Buscar cliente por DNI para registrar equipo
    const handleBuscar = (e: FormEvent) => {
        e.preventDefault();

        if (!dni.trim() || dni.length < 7) {
            setError('Por favor, ingrese un documento válido.');
            return;
        }

        setError('');
        router.get('/equipos/create', { dni: dni.trim() });
    };

    // Equipos asignados al usuario logueado (ocultando Cancelado id 6 y Retirado id 7)
    const filterByUser = useMemo(() => {
        if (!user?.id) return [];

        return computers.filter(
            (comp) =>
                comp.user_id === user.id &&
                Number(comp.estado_id) !== 6 &&
                Number(comp.estado_id) !== 7
        );
    }, [computers, user?.id]);

    // Todos los equipos filtrados (por defecto oculta id 6 y 7, pero permite verlos si se seleccionan en el filtro de estado)
    const filteredComputers = useMemo(() => {
        return computers.filter((comp) => {
            if (search.trim()) {
                const term = search.toLowerCase();

                const matchesName = comp.nombre?.toLowerCase().includes(term);
                const matchesId = comp.id?.toString().includes(term);

                if (!matchesName && !matchesId) return false;
            }

            if (clientName.trim()) {
                const term = clientName.toLowerCase();

                const fullName =
                    `${comp.cliente?.nombre || ''} ${comp.cliente?.apellido || ''}`.toLowerCase();

                if (!fullName.includes(term)) return false;
            }

            if (employeeName) {
                if (String(comp.user_id ?? '') !== String(employeeName)) {
                    return false;
                }
            }

            if (date) {
                if (!comp.created_at) return false;

                const itemDate = comp.created_at.slice(0, 10);

                if (itemDate !== date) return false;
            }

            const estadoActual = comp.estado?.nombre?.trim().toLowerCase();

            if (status) {
                if (estadoActual !== status.trim().toLowerCase()) {
                    return false;
                }
            } else {
                if (Number(comp.estado_id) === 6 || Number(comp.estado_id) === 7) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
            if (timeB !== timeA) {
                return timeB - timeA;
            }
            return (b.id ?? 0) - (a.id ?? 0);
        });
    }, [computers, search, clientName, employeeName, date, status]);

    // Reiniciar a la primera página al cambiar los filtros
    useEffect(() => {
        setCurrentPageTodos(1);
    }, [search, clientName, employeeName, date, status]);

    const handleReset = () => {
        setSearch('');
        setClientName('');
        setEmployeeName('');
        setDate('');
        setStatus('');
        setCurrentPageTodos(1);
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return 'Sin fecha';

        const d = new Date(isoString);

        return isNaN(d.getTime())
            ? isoString.slice(0, 10)
            : d.toLocaleDateString();
    };

    // Renderizar tabla reutilizable con paginación (> 6 filas)
    const renderTable = (
        items: Computer[],
        emptyMessage: string,
        isAssignedTable = false,
        currentPage = 1,
        onPageChange?: (page: number) => void
    ) => {
        const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
        const safePage = Math.min(currentPage, totalPages);
        const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
        const paginatedItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

        return (
            <div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="border-b border-[#292929] text-left">
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                    ID
                                </th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                    CLIENTE
                                </th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                    NOMBRE
                                </th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                    FECHA INGRESO
                                </th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                    ESTADO
                                </th>
                                <th className="px-7 py-4 text-xs font-black tracking-widest text-gray-500">
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-sm text-gray-500"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((comp) => (
                                    <tr
                                        key={comp.id}
                                        className="border-b border-[#202020] transition hover:bg-[#151515]"
                                    >
                                        <td className="px-5 py-4 font-bold text-gray-100">
                                            {comp.id}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-300">
                                            {comp.cliente
                                                ? `${comp.cliente.nombre} ${comp.cliente.apellido}`
                                                : 'Sin cliente'}
                                        </td>

                                        <td className="px-5 py-4 text-xs font-black text-gray-200">
                                            {comp.nombre}
                                        </td>

                                        <td className="px-5 py-4 text-xs text-gray-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar
                                                    size={14}
                                                    className="text-gray-500"
                                                />
                                                {formatDate(comp.created_at)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black"
                                                style={{
                                                    backgroundColor: `${comp.estado?.color || '#888'}15`,
                                                    borderColor: `${comp.estado?.color || '#888'}40`,
                                                    color: comp.estado?.color || '#fff',
                                                }}
                                            >
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            comp.estado?.color || '#888',
                                                    }}
                                                />

                                                {comp.estado?.nombre || 'Sin estado'}
                                            </span>
                                        </td>

                                        <td className="px-7 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.visit(
                                                            route('equipos.show', comp.id)
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400"
                                                >
                                                    <Eye size={15} />
                                                    VER
                                                </button>

                                                {(isAssignedTable ||
                                                    puedeEditar(comp.user_id)) && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.visit(
                                                                route('equipos.edit', comp.id)
                                                            )
                                                        }
                                                        className="flex cursor-pointer items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400"
                                                    >
                                                        <Pencil size={15} />
                                                        EDITAR
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN (SOLO CUANDO HAY MÁS DE 6 FILAS) */}
                {items.length > ITEMS_PER_PAGE && onPageChange && (
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#292929] bg-[#090909] px-7 py-4">
                        <span className="text-xs font-bold text-gray-500">
                            Mostrando {startIdx + 1} -{' '}
                            {Math.min(startIdx + ITEMS_PER_PAGE, items.length)} de{' '}
                            {items.length} equipos
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={safePage <= 1}
                                onClick={() => onPageChange(safePage - 1)}
                                className="flex h-9 items-center gap-1 border border-[#292929] bg-[#0d0d0d] px-3 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                                ANTERIOR
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => onPageChange(page)}
                                        className={`flex h-9 w-9 items-center justify-center border text-xs font-black transition cursor-pointer ${
                                            page === safePage
                                                ? 'border-lime-400 bg-lime-400 text-black'
                                                : 'border-[#292929] bg-[#0d0d0d] text-gray-400 hover:border-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                type="button"
                                disabled={safePage >= totalPages}
                                onClick={() => onPageChange(safePage + 1)}
                                className="flex h-9 items-center gap-1 border border-[#292929] bg-[#0d0d0d] px-3 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                            >
                                SIGUIENTE
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="space-y-5">

            {/* SOLAPAS */}
            <div
                className={`grid overflow-hidden rounded border border-[#292929] bg-[#090909] ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'
                    }`}
            >
                {isAdmin && (
                    <button
                        type="button"
                        onClick={() => setActiveTab('dashboard')}
                        className={`border-r border-[#292929] px-4 py-5 text-xs font-black tracking-[0.2em] transition cursor-pointer ${activeTab === 'dashboard'
                            ? 'bg-lime-400/10 text-lime-400'
                            : 'bg-transparent text-gray-400 hover:bg-[#151515] hover:text-white'
                            }`}
                    >
                        DASHBOARD
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => setActiveTab('asignados')}
                    className={`border-r border-[#292929] px-4 py-5 text-xs font-black tracking-[0.2em] transition cursor-pointer ${activeTab === 'asignados'
                        ? 'bg-lime-400/10 text-lime-400'
                        : 'bg-transparent text-gray-400 hover:bg-[#151515] hover:text-white'
                        }`}
                >
                    MIS EQUIPOS ASIGNADOS
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('todos')}
                    className={`px-4 py-5 text-xs font-black tracking-[0.2em] transition cursor-pointer ${activeTab === 'todos'
                        ? 'bg-lime-400/10 text-lime-400'
                        : 'bg-transparent text-gray-400 hover:bg-[#151515] hover:text-white'
                        }`}
                >
                    TODOS LOS EQUIPOS
                </button>
            </div>

            {/* CONTENIDO DE LA SOLAPA: DASHBOARD (SOLO ADMINISTRADORES) */}
            {isAdmin && activeTab === 'dashboard' && <Dashboard />}

            {/* CONTENIDO DE LA SOLAPA: MIS EQUIPOS */}
            {activeTab === 'asignados' && (
                <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">

                    <div className="flex items-center justify-between border-b border-[#292929] px-7 py-5">
                        <div className="flex items-center gap-4">
                            <PackageOpen
                                size={24}
                                className="text-lime-400"
                            />

                            <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                                MIS EQUIPOS ASIGNADOS
                            </h2>
                        </div>

                        <span className="text-xs font-bold text-gray-500">
                            {filterByUser.length} equipos
                        </span>
                    </div>

                    {renderTable(
                        filterByUser,
                        'No se encontraron equipos asignados a usted.',
                        true,
                        currentPageAsignados,
                        setCurrentPageAsignados
                    )}

                </div>
            )}

            {/* CONTENIDO DE LA SOLAPA: TODOS LOS EQUIPOS */}
            {activeTab === 'todos' && (
                <div className="space-y-5">

                    {/* FILTROS */}
                    <ProductFilters
                        search={search}
                        onSearchChange={setSearch}
                        clientName={clientName}
                        onClientNameChange={setClientName}
                        employeeName={employeeName}
                        onEmployeeNameChange={setEmployeeName}
                        employeeOptions={employeeOptions}
                        date={date}
                        onDateChange={setDate}
                        status={status}
                        onStatusChange={setStatus}
                        statusOptions={statusOptions}
                        onReset={handleReset}
                    />

                    {/* TABLA GENERAL */}
                    <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">

                        <div className="flex items-center justify-between border-b border-[#292929] px-7 py-5">
                            <div className="flex items-center gap-4">
                                <PackageOpen
                                    size={24}
                                    className="text-lime-400"
                                />

                                <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                                    TODOS LOS EQUIPOS
                                </h2>
                            </div>

                            <span className="text-xs font-bold text-gray-500">
                                Mostrando {filteredComputers.length} de {computers.length}
                            </span>
                        </div>

                        {renderTable(
                            filteredComputers,
                            'No se encontraron resultados con los filtros aplicados.',
                            false,
                            currentPageTodos,
                            setCurrentPageTodos
                        )}

                    </div>

                    {/* FORMULARIO PARA AGREGAR UN NUEVO EQUIPO */}
                    <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                        <form
                            onSubmit={handleBuscar}
                            className="flex flex-col gap-3 p-4 sm:flex-row"
                        >
                            <input
                                type="text"
                                name="dni"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="Ingrese el documento del cliente"
                                className="h-12 min-w-0 flex-1 border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-lime-400"
                            />

                            <button
                                type="submit"
                                className="flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 border border-lime-400 px-6 text-sm font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black"
                            >
                                <PackageOpen size={17} />
                                NUEVO EQUIPO
                            </button>
                        </form>

                        {error && (
                            <p className="px-4 pb-3 text-sm text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                </div>
            )}

        </section>
    );
}
