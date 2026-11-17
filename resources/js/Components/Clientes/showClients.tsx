import { Link } from '@inertiajs/react';
import { Eye, Pencil, UserGroup, Phone, Search, RotateCcw } from "lucide-react";
import { useState, useMemo } from 'react';
import EditClients, { EquipoCliente } from './EditClients';

export interface Cliente {
    id: number,
    nombre: string,
    apellido: string,
    telefono: string,
    email?: string | null,
    dni: string,
    equipos?: EquipoCliente[],
}

interface Props {
    clientes: Cliente[]
}

export default function ShowClients({ clientes }: Props) {
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
    const [search, setSearch] = useState('');

    const filteredClientes = useMemo(() => {
        if (!search.trim()) return clientes;
        const term = search.toLowerCase().trim();

        return clientes.filter((c) => {
            const fullName = `${c.nombre || ''} ${c.apellido || ''}`.toLowerCase();
            const dni = (c.dni || '').toLowerCase();
            return fullName.includes(term) || dni.includes(term);
        });
    }, [clientes, search]);

    return (
        <div className="space-y-4">
            {/* Buscador por nombre o documento */}
            <section className="border border-[#292929] bg-[#0d0d0d] p-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar cliente por nombre, apellido o documento (DNI)..."
                            className="h-14 w-full border border-[#292929] bg-[#090909] pl-12 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400 transition"
                        />
                    </div>

                    {search.trim() && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="flex h-14 items-center justify-center gap-2 border border-[#292929] px-5 text-sm font-bold tracking-wider text-gray-400 transition hover:border-gray-500 hover:text-white cursor-pointer"
                        >
                            <RotateCcw size={16} />
                            LIMPIAR
                        </button>
                    )}
                </div>
            </section>

            <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                {/* Cabecera */}
                <div className="flex items-center justify-between border-b border-[#292929] px-7 py-5">
                    <div className="flex items-center gap-4">
                        <UserGroup
                            size={24}
                            className="text-lime-400"
                        />
                        <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                            CLIENTES
                        </h2>
                    </div>

                    <span className="text-xs font-bold text-gray-500">
                        Mostrando {filteredClientes.length} de {clientes.length}
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
                                    NOMBRE
                                </th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                    DOCUMENTO
                                </th>
                                <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                    TELEFONO
                                </th>
                                <th className="px-7 py-4 text-xs font-black tracking-widest text-gray-500">
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredClientes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                                        No se encontraron resultados con los filtros aplicados.
                                    </td>
                                </tr>
                            ) : (
                                filteredClientes.map((comp) => (
                                <tr key={comp.id} className="border-b border-[#202020] transition hover:bg-[#151515]">
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-gray-100">
                                            {comp.id}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-300">
                                        {comp.nombre} {comp.apellido}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black text-gray-200">
                                            {comp.dni}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-xs text-gray-400">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone size={14} className="text-gray-500" />
                                            {comp.telefono}
                                        </span>
                                    </td>
                                    <td className="px-7 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setClienteEditando(comp)}
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
                {clienteEditando && (
                    <EditClients
                        cliente={clienteEditando}
                        onClose={() => setClienteEditando(null)}
                    />
                )}
                </div>
            </div>
        </div>

    );
}