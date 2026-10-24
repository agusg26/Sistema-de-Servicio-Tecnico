import { useState, useRef, useEffect, useMemo, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Wrench, X, Save, Search, ChevronDown, Check, Package } from 'lucide-react';

export interface Repuesto {
    id: number;
    nombre: string;
    precio_unitario?: number;
    marca?: string;
    stock?: number;
}

export interface Reparacion {
    id: number;
    titulo: string;
    descripcion: string;
    costo: number | string;
    equipo_id: number;
    repuesto_id: number | null;
    presupuesto_aprobado?: boolean;
    repuesto?: Repuesto;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    reparacion: Reparacion | null;
    equipoNombre?: string;
    repuestos: Repuesto[];
}

export default function ModalEditarReparacion({
    isOpen,
    onClose,
    reparacion,
    equipoNombre,
    repuestos = [],
}: Props) {
    const [searchRepuesto, setSearchRepuesto] = useState('');
    const [isRepuestoOpen, setIsRepuestoOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<{
        equipo_id: number;
        titulo: string;
        descripcion: string;
        costo: string;
        repuesto_id: number | null;
        presupuesto_aprobado: boolean;
    }>({
        equipo_id: reparacion?.equipo_id ?? 0,
        titulo: reparacion?.titulo ?? '',
        descripcion: reparacion?.descripcion ?? '',
        costo: reparacion ? String(reparacion.costo) : '',
        repuesto_id: reparacion?.repuesto_id ?? null,
        presupuesto_aprobado: reparacion?.presupuesto_aprobado ?? true,
    });

    // Sincronizar el formulario cada vez que se abre el modal o cambia la reparación seleccionada
    useEffect(() => {
        if (isOpen && reparacion) {
            clearErrors();
            setData({
                equipo_id: reparacion.equipo_id,
                titulo: reparacion.titulo || '',
                descripcion: reparacion.descripcion || '',
                costo: String(reparacion.costo ?? ''),
                repuesto_id: reparacion.repuesto_id ?? null,
                presupuesto_aprobado: reparacion.presupuesto_aprobado ?? true,
            });

            // Precargar el texto del buscador si la reparación ya posee un repuesto
            const repuestoActual = repuestos.find((r) => r.id === reparacion.repuesto_id);
            setSearchRepuesto(repuestoActual ? repuestoActual.nombre : '');
            setIsRepuestoOpen(false);
        }
    }, [isOpen, reparacion]);

    // Cerrar el dropdown del autocomplete al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsRepuestoOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cerrar modal al presionar la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                if (isRepuestoOpen) {
                    setIsRepuestoOpen(false);
                } else {
                    handleClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isRepuestoOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        setSearchRepuesto('');
        setIsRepuestoOpen(false);
        onClose();
    };

    // Repuesto seleccionado actualmente
    const selectedRepuesto = useMemo(() => {
        return repuestos.find((r) => r.id === data.repuesto_id) || null;
    }, [repuestos, data.repuesto_id]);

    // Filtrar repuestos según la búsqueda
    const filteredRepuestos = useMemo(() => {
        const query = searchRepuesto.trim().toLowerCase();
        if (!query) return repuestos;
        return repuestos.filter((r) => {
            const matchesNombre = r.nombre?.toLowerCase().includes(query);
            const matchesMarca = r.marca ? r.marca.toLowerCase().includes(query) : false;
            return matchesNombre || matchesMarca;
        });
    }, [repuestos, searchRepuesto]);

    const handleSelectRepuesto = (repuesto: Repuesto | null) => {
        if (repuesto) {
            setData((prev) => ({
                ...prev,
                repuesto_id: repuesto.id,
                costo:
                    !prev.costo || prev.costo === '0'
                        ? repuesto.precio_unitario
                            ? String(repuesto.precio_unitario)
                            : prev.costo
                        : prev.costo,
            }));
            setSearchRepuesto(repuesto.nombre);
        } else {
            setData('repuesto_id', null);
            setSearchRepuesto('');
        }
        setIsRepuestoOpen(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchRepuesto(value);
        setIsRepuestoOpen(true);
        if (!value.trim()) {
            setData('repuesto_id', null);
        } else if (selectedRepuesto && selectedRepuesto.nombre !== value) {
            setData('repuesto_id', null);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!reparacion) return;

        put(route('reparaciones.update', reparacion.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
            },
        });
    };

    if (!isOpen || !reparacion) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-150"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className="w-full max-w-xl border border-[#292929] bg-[#0c0c0c] shadow-2xl overflow-hidden">
                {/* Cabecera del Modal */}
                <div className="flex items-center justify-between border-b border-[#292929] bg-[#111111] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded bg-lime-400/10 text-lime-400 border border-lime-400/30">
                            <Wrench size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black tracking-wider text-white uppercase">
                                Editar Reparación #{reparacion.id}
                            </h2>
                            {equipoNombre && (
                                <p className="text-xs text-gray-400">
                                    Equipo: <span className="text-gray-200 font-bold">{equipoNombre}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-500 hover:text-white transition p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                        {/* Título de la reparación */}
                        <div>
                            <label className="mb-2 block text-xs font-black tracking-wider text-gray-400 uppercase">
                                Título del Servicio / Trabajo <span className="text-lime-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.titulo}
                                onChange={(e) => setData('titulo', e.target.value)}
                                placeholder="Ej. Cambio de pasta térmica, Reemplazo de disco..."
                                className="h-11 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-0"
                                autoFocus
                            />
                            {errors.titulo && (
                                <p className="mt-1.5 text-xs font-bold text-red-400">
                                    {errors.titulo}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="mb-2 block text-xs font-black tracking-wider text-gray-400 uppercase">
                                Descripción del Problema y Solución <span className="text-lime-400">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Detalles técnicos del trabajo realizado o diagnóstico efectuado..."
                                className="w-full border border-[#292929] bg-[#090909] p-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-0"
                            />
                            {errors.descripcion && (
                                <p className="mt-1.5 text-xs font-bold text-red-400">
                                    {errors.descripcion}
                                </p>
                            )}
                        </div>

                        {/* Autocomplete de repuesto */}
                        <div ref={dropdownRef} className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-black tracking-wider text-gray-400 uppercase">
                                    Repuesto Asignado{' '}
                                    <span className="text-gray-500 font-normal lowercase">(opcional)</span>
                                </label>
                                {selectedRepuesto && (
                                    <button
                                        type="button"
                                        onClick={() => handleSelectRepuesto(null)}
                                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition inline-flex items-center gap-1"
                                    >
                                        <X size={12} />
                                        Quitar repuesto
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500 pointer-events-none">
                                    <Search size={15} />
                                </span>
                                <input
                                    type="text"
                                    value={searchRepuesto}
                                    onChange={handleSearchChange}
                                    onFocus={() => setIsRepuestoOpen(true)}
                                    placeholder={
                                        selectedRepuesto
                                            ? selectedRepuesto.nombre
                                            : 'Buscar repuesto o dejar sin asignar...'
                                    }
                                    className="h-11 w-full border border-[#292929] bg-[#090909] pl-10 pr-10 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-0"
                                />

                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
                                    {searchRepuesto && (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectRepuesto(null)}
                                            className="text-gray-500 hover:text-white transition p-1"
                                            title="Limpiar búsqueda"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setIsRepuestoOpen((prev) => !prev)}
                                        className="text-gray-500 hover:text-white transition p-1"
                                    >
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${isRepuestoOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Dropdown de opciones */}
                            {isRepuestoOpen && (
                                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-[#292929] bg-[#0c0c0c] shadow-2xl">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectRepuesto(null)}
                                        className={`flex w-full items-center justify-between border-b border-[#1f1f1f] px-4 py-2.5 text-left text-xs transition hover:bg-[#161616] ${data.repuesto_id === null
                                                ? 'bg-[#151515] text-lime-400 font-bold'
                                                : 'text-gray-400'
                                            }`}
                                    >
                                        <span className="italic">Sin repuesto asignado (Solo mano de obra)</span>
                                        {data.repuesto_id === null && <Check size={14} className="text-lime-400" />}
                                    </button>

                                    {filteredRepuestos.length === 0 ? (
                                        <div className="px-4 py-4 text-center text-xs text-gray-500">
                                            No se encontraron repuestos con "{searchRepuesto}"
                                        </div>
                                    ) : (
                                        filteredRepuestos.map((rep) => {
                                            const isSelected = data.repuesto_id === rep.id;
                                            return (
                                                <button
                                                    key={rep.id}
                                                    type="button"
                                                    onClick={() => handleSelectRepuesto(rep)}
                                                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition border-b border-[#181818] last:border-b-0 hover:bg-[#161616] ${isSelected ? 'bg-[#151515] text-lime-400' : 'text-gray-200'
                                                        }`}
                                                >
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <Package size={13} className="text-gray-500" />
                                                            <span className="font-bold text-white">{rep.nombre}</span>
                                                            {rep.marca && (
                                                                <span className="text-[10px] text-gray-400 bg-[#1c1c1c] px-1.5 py-0.2 rounded">
                                                                    {rep.marca}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {rep.stock !== undefined && (
                                                            <p className="text-[11px] text-gray-500 pl-5">
                                                                Stock disponible: {rep.stock}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-right">
                                                        {rep.precio_unitario && (
                                                            <span className="font-mono text-lime-400 font-bold">
                                                                ${Number(rep.precio_unitario).toLocaleString('es-AR')}
                                                            </span>
                                                        )}
                                                        {isSelected && <Check size={14} className="text-lime-400" />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {/* Badge del repuesto actual */}
                            {selectedRepuesto && (
                                <div className="mt-2 flex items-center justify-between rounded border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300">
                                    <div className="flex items-center gap-2">
                                        <Package size={13} className="text-blue-400" />
                                        <span>
                                            Repuesto:{' '}
                                            <strong className="text-white">{selectedRepuesto.nombre}</strong>
                                        </span>
                                    </div>
                                    {selectedRepuesto.precio_unitario && (
                                        <span className="font-mono text-blue-300 text-[11px]">
                                            ${Number(selectedRepuesto.precio_unitario).toLocaleString('es-AR')}
                                        </span>
                                    )}
                                </div>
                            )}

                            {errors.repuesto_id && (
                                <p className="mt-1.5 text-xs font-bold text-red-400">{errors.repuesto_id}</p>
                            )}
                        </div>

                        {/* Costo */}
                        <div>
                            <label className="mb-2 block text-xs font-black tracking-wider text-gray-400 uppercase">
                                Costo Total de la Reparación ($) <span className="text-lime-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500 font-mono text-sm">
                                    $
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.costo}
                                    onChange={(e) => setData('costo', e.target.value)}
                                    placeholder="0"
                                    className="h-11 w-full border border-[#292929] bg-[#090909] pl-8 pr-4 text-sm text-white font-mono placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-0"
                                />
                            </div>
                            {errors.costo && (
                                <p className="mt-1.5 text-xs font-bold text-red-400">
                                    {errors.costo}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-end gap-3 border-t border-[#292929] bg-[#101010] px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="border border-[#292929] px-5 py-2.5 text-xs font-black tracking-wider text-gray-400 transition hover:border-gray-600 hover:text-white"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-lime-400 px-6 py-2.5 text-xs font-black tracking-wider text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={16} />
                            {processing ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}