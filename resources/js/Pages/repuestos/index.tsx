import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { MainLayout } from '@/Layouts/MainLayout';
import EditRepuestos, {
    CategoriaRepuesto,
    Repuesto,
} from '@/Components/Repuestos/EditRepuestos';
import {
    Boxes,
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    RotateCcw,
    X,
    ChevronDown,
    Package,
    Tag,
} from 'lucide-react';

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

interface Props {
    repuestos: Repuesto[];
    categorias?: CategoriaRepuesto[];
    filters?: {
        search?: string;
        categoria_repuesto_id?: string;
        marca?: string;
    };
}

export default function RepuestosIndex({
    repuestos = [],
    categorias = [],
    filters = {},
}: Props) {
    // Estados de filtros de búsqueda
    const [search, setSearch] = useState(filters.search || '');
    const [categoriaFilter, setCategoriaFilter] = useState(
        filters.categoria_repuesto_id ? String(filters.categoria_repuesto_id) : ''
    );
    const [marcaFilter, setMarcaFilter] = useState(filters.marca || '');
    const [stockFilter, setStockFilter] = useState('');

    const [repuestoViendo, setRepuestoViendo] = useState<Repuesto | null>(null);
    const [repuestoEditando, setRepuestoEditando] = useState<Repuesto | null>(null);
    const { auth } = usePage<SharedPageProps>().props;
    const user = auth.user;

    // Opciones de marcas únicas para filtro rápido
    const marcasUnicas = useMemo(() => {
        const marcas = repuestos
            .map((r) => r.marca?.trim())
            .filter(Boolean) as string[];
        return Array.from(new Set(marcas)).sort((a, b) => a.localeCompare(b));
    }, [repuestos]);

    // Filtrado reactivo en el listado
    const filteredRepuestos = useMemo(() => {
        return repuestos.filter((rep) => {
            if (search.trim()) {
                const term = search.toLowerCase().trim();
                const matchesNombre = rep.nombre?.toLowerCase().includes(term);
                const matchesMarca = rep.marca?.toLowerCase().includes(term);
                const catNombre = (
                    rep.categoria?.nombre ||
                    rep.categoria_repuesto?.nombre ||
                    ''
                ).toLowerCase();
                const matchesCat = catNombre.includes(term);

                if (!matchesNombre && !matchesMarca && !matchesCat) {
                    return false;
                }
            }

            if (categoriaFilter) {
                if (String(rep.categoria_repuesto_id) !== String(categoriaFilter)) {
                    return false;
                }
            }

            if (marcaFilter.trim()) {
                if (rep.marca?.toLowerCase() !== marcaFilter.toLowerCase().trim()) {
                    return false;
                }
            }

            if (stockFilter === 'disponible' && rep.stock <= 0) {
                return false;
            }
            if (stockFilter === 'bajo' && (rep.stock <= 0 || rep.stock > 5)) {
                return false;
            }
            if (stockFilter === 'agotado' && rep.stock !== 0) {
                return false;
            }

            return true;
        });
    }, [repuestos, search, categoriaFilter, marcaFilter, stockFilter]);


    const hasActiveFilters = Boolean(
        search.trim() || categoriaFilter || marcaFilter || stockFilter
    );

    const handleResetFilters = () => {
        setSearch('');
        setCategoriaFilter('');
        setMarcaFilter('');
        setStockFilter('');
    };

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

    const handleDelete = (repuesto: Repuesto) => {
        if (
            !confirm(
                `¿Estás seguro de eliminar el repuesto "${repuesto.nombre}" (${repuesto.marca})?`
            )
        ) {
            return;
        }

        router.delete(route('repuestos.destroy', repuesto.id), {
            preserveScroll: true,
        });
    };

    const getCategoriaNombre = (rep: Repuesto) => {
        return (
            rep.categoria?.nombre ||
            rep.categoria_repuesto?.nombre ||
            categorias.find((c) => c.id === rep.categoria_repuesto_id)?.nombre ||
            'Sin categoría'
        );
    };

    return (
        <MainLayout>
            <Head title="Gestión de Repuestos" />

            <div className="p-5 space-y-4">
                {/* BARRA DE FILTROS DE BÚSQUEDA */}
                <section className="border border-[#292929] bg-[#0d0d0d] p-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.8fr_1.2fr_1fr_1fr_auto]">
                        {/* Buscar por nombre, marca o categoría */}
                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, marca o categoría..."
                                className="h-14 w-full border border-[#292929] bg-[#090909] pl-12 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400 transition"
                            />
                        </div>

                        {/* Filtro por Categoría */}
                        <div className="relative">
                            <label className="absolute left-4 top-1.5 text-[10px] font-black tracking-widest text-gray-500">
                                CATEGORÍA
                            </label>
                            <select
                                value={categoriaFilter}
                                onChange={(e) => setCategoriaFilter(e.target.value)}
                                className="h-14 w-full appearance-none border border-[#292929] bg-[#090909] px-4 pt-4 text-sm text-gray-300 outline-none focus:border-lime-400 cursor-pointer"
                            >
                                <option value="">TODAS</option>
                                {categorias.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                        className="bg-[#090909] text-white"
                                    >
                                        {cat.nombre.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={17}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>

                        {/* Filtro por Marca */}
                        <div className="relative">
                            <label className="absolute left-4 top-1.5 text-[10px] font-black tracking-widest text-gray-500">
                                MARCA
                            </label>
                            <select
                                value={marcaFilter}
                                onChange={(e) => setMarcaFilter(e.target.value)}
                                className="h-14 w-full appearance-none border border-[#292929] bg-[#090909] px-4 pt-4 text-sm text-gray-300 outline-none focus:border-lime-400 cursor-pointer"
                            >
                                <option value="">TODAS</option>
                                {marcasUnicas.map((marca) => (
                                    <option
                                        key={marca}
                                        value={marca}
                                        className="bg-[#090909] text-white"
                                    >
                                        {marca.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={17}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>

                        {/* Filtro por Estado de Stock */}
                        <div className="relative">
                            <label className="absolute left-4 top-1.5 text-[10px] font-black tracking-widest text-gray-500">
                                STOCK
                            </label>
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="h-14 w-full appearance-none border border-[#292929] bg-[#090909] px-4 pt-4 text-sm text-gray-300 outline-none focus:border-lime-400 cursor-pointer"
                            >
                                <option value="">TODOS</option>
                                <option value="disponible" className="bg-[#090909] text-white">
                                    CON STOCK
                                </option>
                                <option value="bajo" className="bg-[#090909] text-white">
                                    STOCK BAJO (1 - 5)
                                </option>
                                <option value="agotado" className="bg-[#090909] text-white">
                                    SIN STOCK (0)
                                </option>
                            </select>
                            <ChevronDown
                                size={17}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>

                        {/* Botón Limpiar Filtros / Nuevo Repuesto */}
                        <div className="flex items-center">
                            {hasActiveFilters ? (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    title="Limpiar filtros"
                                    className="flex h-14 w-full items-center justify-center gap-2 border border-[#292929] px-5 text-sm font-bold tracking-wider text-gray-400 transition hover:border-gray-500 hover:text-white cursor-pointer"
                                >
                                    <RotateCcw size={16} />
                                    LIMPIAR
                                </button>
                            ) : (
                                <Link
                                    href={route('repuestos.create')}
                                    className="flex h-14 w-full items-center justify-center gap-2 border border-lime-400 px-6 text-sm font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black cursor-pointer"
                                >
                                    <Plus size={18} />
                                    NUEVO REPUESTO
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* TABLA DE REPUESTOS */}
                <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                    {/* Cabecera */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] px-7 py-5">
                        <div className="flex items-center gap-4">
                            <Boxes size={24} className="text-lime-400" />
                            <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                                LISTADO DE REPUESTOS
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-500">
                                Mostrando {filteredRepuestos.length} de {repuestos.length}
                            </span>

                            {hasActiveFilters && (
                                <Link
                                    href={route('repuestos.create')}
                                    className="flex items-center gap-2 border border-lime-400 px-4 py-2 text-xs font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black cursor-pointer"
                                >
                                    <Plus size={15} />
                                    NUEVO REPUESTO
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#292929] text-left">
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        NOMBRE
                                    </th>
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        MARCA
                                    </th>
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        CATEGORÍA
                                    </th>
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        STOCK
                                    </th>
                                    <th className="px-7 py-4 text-xs font-black tracking-widest text-gray-500">
                                        ACCIONES
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRepuestos.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-8 text-center text-sm text-gray-500"
                                        >
                                            No se encontraron repuestos con los filtros aplicados.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRepuestos.map((rep) => (
                                        <tr
                                            key={rep.id}
                                            className="border-b border-[#202020] transition hover:bg-[#151515]"
                                        >
                                            <td className="px-5 py-4 text-sm font-bold text-gray-200">
                                                {rep.nombre}
                                            </td>

                                            <td className="px-5 py-4 text-xs font-semibold text-gray-300">
                                                <span className="inline-flex items-center gap-1.5 rounded border border-[#292929] bg-[#111111] px-2.5 py-1">
                                                    <Tag size={12} className="text-gray-400" />
                                                    {rep.marca}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-xs text-gray-400">
                                                {getCategoriaNombre(rep)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#111111] px-3 py-1 text-xs font-black text-gray-200">
                                                    {rep.stock} u.
                                                </span>
                                            </td>

                                            <td className="px-7 py-4">
                                                <div className="flex gap-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRepuestoViendo(rep)}
                                                        className="flex items-center gap-2 border border-[#333] px-3.5 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
                                                    >
                                                        <Eye size={15} />
                                                        VER
                                                    </button>

                                                    {isAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setRepuestoEditando(rep)}
                                                            className="flex items-center gap-2 border border-[#333] px-3.5 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
                                                        >
                                                            <Pencil size={15} />
                                                            EDITAR
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(rep)}
                                                            className="flex items-center gap-2 border border-[#333] px-3.5 py-2 text-xs font-black text-gray-400 transition hover:border-red-500 hover:text-red-400 cursor-pointer"
                                                        >
                                                            <Trash2 size={15} />
                                                            ELIMINAR
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
            </div>

            {/* COMPONENTE MODULARIZADO: EDITAR REPUESTO */}
            {repuestoEditando && (
                <EditRepuestos
                    repuesto={repuestoEditando}
                    categorias={categorias}
                    onClose={() => setRepuestoEditando(null)}
                />
            )}

            {/* MODAL: VER DETALLE DE REPUESTO */}
            {repuestoViendo && (
                <VerRepuestoModal
                    repuesto={repuestoViendo}
                    categoriaNombre={getCategoriaNombre(repuestoViendo)}
                    onClose={() => setRepuestoViendo(null)}
                    onEdit={() => {
                        const target = repuestoViendo;
                        setRepuestoViendo(null);
                        setRepuestoEditando(target);
                    }}
                />
            )}
        </MainLayout>
    );
}

interface VerRepuestoModalProps {
    repuesto: Repuesto;
    categoriaNombre: string;
    onClose: () => void;
    onEdit: () => void;
}

function VerRepuestoModal({
    repuesto,
    categoriaNombre,
    onClose,
    onEdit,
}: VerRepuestoModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-lg overflow-hidden border border-[#292929] bg-[#0b0b0b] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#292929] bg-[#0d0d0d] px-7 py-5">
                    <div className="flex items-center gap-3">
                        <Package size={22} className="text-lime-400" />
                        <div>
                            <div className="text-[10px] font-black tracking-[0.3em] text-lime-400">
                                FICHA DE REPUESTO #{repuesto.id}
                            </div>
                            <h2 className="text-lg font-black text-white">
                                {repuesto.nombre}
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center border border-[#292929] text-gray-500 transition hover:border-gray-500 hover:text-white cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-7 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4 border border-[#1f1f1f] bg-[#080808] p-4">
                        <div>
                            <span className="block text-[10px] font-black tracking-widest text-gray-500">
                                MARCA
                            </span>
                            <span className="mt-1 block font-bold text-gray-200">
                                {repuesto.marca}
                            </span>
                        </div>

                        <div>
                            <span className="block text-[10px] font-black tracking-widest text-gray-500">
                                CATEGORÍA
                            </span>
                            <span className="mt-1 block font-bold text-gray-200">
                                {categoriaNombre}
                            </span>
                        </div>

                        <div>
                            <span className="block text-[10px] font-black tracking-widest text-gray-500">
                                STOCK ACTUAL
                            </span>
                            <span className="mt-1 block font-bold text-gray-200">
                                {repuesto.stock} unidades
                            </span>
                        </div>

                        <div>
                            <span className="block text-[10px] font-black tracking-widest text-gray-500">
                                PRECIO UNITARIO
                            </span>
                            <span className="mt-1 block font-mono font-black text-lime-400">
                                ${Number(repuesto.precio_unitario).toLocaleString('es-AR')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#292929] bg-[#0a0a0a] px-7 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-[#292929] px-5 py-2.5 text-xs font-black tracking-wider text-gray-500 transition hover:border-gray-500 hover:text-white cursor-pointer"
                    >
                        CERRAR
                    </button>
                    <button
                        type="button"
                        onClick={onEdit}
                        className="flex items-center gap-2 bg-lime-400 px-5 py-2.5 text-xs font-black tracking-wider text-black transition hover:bg-lime-300 cursor-pointer"
                    >
                        <Pencil size={14} />
                        EDITAR REPUESTO
                    </button>
                </div>
            </div>
        </div>
    );
}
