import React, { useEffect, useState, useMemo, FormEvent } from 'react';
import { Eye, Pencil, PackageOpen, Calendar } from "lucide-react";
import { router, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import ProductFilters, { FilterOption } from './filter';

const endpoint = '/api/computers';

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
    roles?: string[];
    role?: string;
}

interface SharedPageProps {
    auth: {
        user: AuthUser;
    };
    [key: string]: any;
}

export default function ShowComputers() {
    const [computers, setComputers] = useState<Computer[]>([]);
    const [search, setSearch] = useState('');
    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [dni, setDni] = useState('');
    const [error, setError] = useState('');
    const { auth } = usePage<SharedPageProps>().props;

    const user = auth.user;

    // Helper de roles flexible
    const hasRole = (...rolesPermitidos: string[]) => {
        if (!user) return false;
        if (Array.isArray(user.roles)) {
            const rolesLower = user.roles.map((r: any) =>
                (typeof r === 'string' ? r : r.name || '').toLowerCase()
            );
            return rolesPermitidos.some((rol) => rolesLower.includes(rol.toLowerCase()));
        }
        if (typeof user.role === 'string') {
            return rolesPermitidos.some((rol) => rol.toLowerCase() === user.role?.toLowerCase());
        }
        return false;
    };

    const isAdmin = hasRole('admin', 'super admin');

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

    // Extraer estados únicos directamente de los equipos recibidos
    const statusOptions: FilterOption[] = useMemo(() => {
        const nombres = computers.map((c) => c.estado?.nombre).filter(Boolean) as string[];
        const unique = Array.from(new Set(nombres));
        return unique.map((est) => ({
            label: est.toUpperCase(),
            value: est,
        }));
    }, [computers]);

    const handleBuscar = (e: FormEvent) => {
        e.preventDefault();
        if (!dni.trim() || dni.length < 7) {
            setError('Por favor, ingrese un documento válido.');
            return;
        }
        setError('');
        router.get('/equipos/create', { dni: dni.trim() });
    };

    const filterByUser = useMemo(() => {
        if (!user?.id) return [];
        return computers.filter((comp) => comp.user_id === user.id);
    }, [computers, user?.id]);

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
                const fullName = `${comp.cliente?.nombre || ''} ${comp.cliente?.apellido || ''}`.toLowerCase();
                if (!fullName.includes(term)) return false;
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
                if (estadoActual === 'cancelado') {
                    return false;
                }
            }

            return true;
        });
    }, [computers, search, clientName, date, status]);

    const handleReset = () => {
        setSearch('');
        setClientName('');
        setDate('');
        setStatus('');
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return 'Sin fecha';
        const d = new Date(isoString);
        return isNaN(d.getTime()) ? isoString.slice(0, 10) : d.toLocaleDateString();
    };

    return (
        <section className="space-y-4">
            {/* TABLA: EQUIPOS ASIGNADOS AL USUARIO LOGUEADO */}
            <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                <div className="flex items-center justify-between border-b border-[#292929] px-7 py-5">
                    <div className="flex items-center gap-4">
                        <PackageOpen size={24} className="text-lime-400" />
                        <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                            MIS EQUIPOS ASIGNADOS
                        </h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="border-b border-[#292929] text-left">
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">ID</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">CLIENTE</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">NOMBRE</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">FECHA INGRESO</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">ESTADO</th>
                                <th className="px-7 py-4 text-xs font-black tracking-widest text-gray-500">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterByUser.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                                        No se encontraron equipos asignados a usted.
                                    </td>
                                </tr>
                            ) : (
                                filterByUser.map((comp) => (
                                    <tr key={comp.id} className="border-b border-[#202020] transition hover:bg-[#151515]">
                                        <td className="px-5 py-4 font-bold text-gray-100">{comp.id}</td>
                                        <td className="px-5 py-4 text-sm text-gray-300">
                                            {comp.cliente ? `${comp.cliente.nombre} ${comp.cliente.apellido}` : 'Sin cliente'}
                                        </td>
                                        <td className="px-5 py-4 text-xs font-black text-gray-200">{comp.nombre}</td>
                                        <td className="px-5 py-4 text-xs text-gray-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-500" />
                                                {formatDate(comp.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black text-gray-100"
                                                style={{
                                                    backgroundColor: `${comp.estado?.color || '#888'}15`,
                                                    borderColor: `${comp.estado?.color || '#888'}40`,
                                                    color: comp.estado?.color || '#fff',
                                                }}
                                            >
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: comp.estado?.color || '#888' }}
                                                />
                                                {comp.estado?.nombre || 'Sin estado'}
                                            </span>
                                        </td>
                                        <td className="px-7 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(route('equipos.show', comp.id))}
                                                    className="flex items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
                                                >
                                                    <Eye size={15} />
                                                    VER
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(route('equipos.edit', comp.id))}
                                                    className="flex items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
                                                >
                                                    <Pencil size={15} />
                                                    EDITAR
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FILTROS */}
            <ProductFilters
                search={search}
                onSearchChange={setSearch}
                clientName={clientName}
                onClientNameChange={setClientName}
                date={date}
                onDateChange={setDate}
                status={status}
                onStatusChange={setStatus}
                statusOptions={statusOptions}
                onReset={handleReset}
            />

            {/* TABLA: TODOS LOS EQUIPOS */}
            <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                <div className="flex items-center justify-between border-b border-[#292929] px-7 py-5">
                    <div className="flex items-center gap-4">
                        <PackageOpen size={24} className="text-lime-400" />
                        <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                            TODOS LOS EQUIPOS
                        </h2>
                    </div>
                    <span className="text-xs font-bold text-gray-500">
                        Mostrando {filteredComputers.length} de {computers.length}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="border-b border-[#292929] text-left">
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">ID</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">CLIENTE</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">NOMBRE</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">FECHA INGRESO</th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">ESTADO</th>
                                <th className="px-7 py-4 text-xs font-black tracking-widest text-gray-500">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComputers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                                        No se encontraron resultados con los filtros aplicados.
                                    </td>
                                </tr>
                            ) : (
                                filteredComputers.map((comp) => (
                                    <tr key={comp.id} className="border-b border-[#202020] transition hover:bg-[#151515]">
                                        <td className="px-5 py-4 font-bold text-gray-100">{comp.id}</td>
                                        <td className="px-5 py-4 text-sm text-gray-300">
                                            {comp.cliente ? `${comp.cliente.nombre} ${comp.cliente.apellido}` : 'Sin cliente'}
                                        </td>
                                        <td className="px-5 py-4 text-xs font-black text-gray-200">{comp.nombre}</td>
                                        <td className="px-5 py-4 text-xs text-gray-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-500" />
                                                {formatDate(comp.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black text-gray-100"
                                                style={{
                                                    backgroundColor: `${comp.estado?.color || '#888'}15`,
                                                    borderColor: `${comp.estado?.color || '#888'}40`,
                                                    color: comp.estado?.color || '#fff',
                                                }}
                                            >
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: comp.estado?.color || '#888' }}
                                                />
                                                {comp.estado?.nombre || 'Sin estado'}
                                            </span>
                                        </td>
                                        <td className="px-7 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(route('equipos.show', comp.id))}
                                                    className="flex items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
                                                >
                                                    <Eye size={15} />
                                                    VER
                                                </button>
                                                {/* Botón Editar condicionado */}
                                                {puedeEditar(comp.user_id) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => router.visit(route('equipos.edit', comp.id))}
                                                        className="flex items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
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
            </div>

            {/* FORMULARIO BUSCADOR RÁPIDO DNI */}
            <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                <form onSubmit={handleBuscar} className="flex gap-2 p-2">
                    <input
                        type="text"
                        name="dni"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder="Ingrese el documento del cliente"
                        className="h-12 border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-lime-400"
                    />
                    <button
                        type="submit"
                        className="flex h-12 items-center justify-center gap-2 border border-lime-400 px-6 text-sm font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black cursor-pointer"
                    >
                        NUEVO EQUIPO
                    </button>
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </form>
            </div>
        </section>
    );
}