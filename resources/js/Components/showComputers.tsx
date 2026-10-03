import React, { useEffect, useState, useMemo } from 'react';
import { Eye, Pencil, PackageOpen, Calendar } from "lucide-react";
import axios from 'axios';
import ProductFilters, { FilterOption } from './filter';

const endpoint = 'http://localhost:8080/api/computers';

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
    estado: string;
    created_at?: string;
    updated_at?: string;
    cliente?: Cliente;
}

export default function ShowComputers() {
    const [computers, setComputers] = useState<Computer[]>([]);
    const [search, setSearch] = useState('');
    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');

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

    // Extraer estados únicos para el selector de estado
    const statusOptions: FilterOption[] = useMemo(() => {
        const unique = Array.from(new Set(computers.map((c) => c.estado).filter(Boolean)));
        return unique.map((est) => ({
            label: est.toUpperCase(),
            value: est,
        }));
    }, [computers]);

    // Filtrar la lista de computadoras en tiempo real según cliente, fecha de ingreso, nombre y estado
    const filteredComputers = useMemo(() => {
        return computers.filter((comp) => {
            // Filtrar por nombre de producto / equipo
            if (search.trim()) {
                const term = search.toLowerCase();
                const matchesName = comp.nombre?.toLowerCase().includes(term);
                const matchesId = comp.id?.toString().includes(term);
                if (!matchesName && !matchesId) return false;
            }

            // Filtrar por nombre de cliente
            if (clientName.trim()) {
                const term = clientName.toLowerCase();
                const fullName = `${comp.cliente?.nombre || ''} ${comp.cliente?.apellido || ''}`.toLowerCase();
                if (!fullName.includes(term)) return false;
            }

            // Filtrar por fecha de ingreso (created_at en formato YYYY-MM-DD)
            if (date) {
                if (!comp.created_at) return false;
                // comp.created_at suele ser ISO string tipo "2026-09-22T04:24:36.000000Z"
                const itemDate = comp.created_at.slice(0, 10);
                if (itemDate !== date) return false;
            }

            // Filtrar por estado
            if (status) {
                if (comp.estado !== status) return false;
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
            {/* Barra de Filtros */}
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

            {/* Contenedor de la Tabla */}
            <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                {/* Cabecera */}
                <div className="flex items-center justify-between border-b border-[#292929] px-7 py-5">
                    <div className="flex items-center gap-4">
                        <PackageOpen
                            size={24}
                            className="text-lime-400"
                        />
                        <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                            PRODUCTOS / EQUIPOS
                        </h2>
                    </div>

                    <span className="text-xs font-bold text-gray-500">
                        Mostrando {filteredComputers.length} de {computers.length}
                    </span>
                </div>

                {/* Tabla */}
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
                            {filteredComputers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                                        No se encontraron resultados con los filtros aplicados.
                                    </td>
                                </tr>
                            ) : (
                                filteredComputers.map((comp) => (
                                    <tr key={comp.id} className="border-b border-[#202020] transition hover:bg-[#151515]">
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-gray-100">
                                                {comp.id}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-300">
                                            {comp.cliente ? `${comp.cliente.nombre} ${comp.cliente.apellido}` : 'Sin cliente'}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black text-gray-200">
                                                {comp.nombre}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-xs text-gray-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-500" />
                                                {formatDate(comp.created_at)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-black text-lime-400">
                                                {comp.estado}
                                            </span>
                                        </td>

                                        <td className="px-7 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    className="
                            flex items-center gap-2
                            border border-[#333]
                            px-4 py-2
                            text-xs font-black
                            text-gray-400
                            transition
                            hover:border-gray-500
                            hover:text-white
                            cursor-pointer
                          "
                                                >
                                                    <Eye size={15} />
                                                    VER
                                                </button>

                                                <button
                                                    className="
                            flex items-center gap-2
                            border border-[#333]
                            px-4 py-2
                            text-xs font-black
                            text-gray-400
                            transition
                            hover:border-lime-400
                            hover:text-lime-400
                            cursor-pointer
                          "
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
        </section>
    );
}
