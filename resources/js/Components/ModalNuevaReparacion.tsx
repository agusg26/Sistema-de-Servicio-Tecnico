import { useState, useRef, useEffect, useMemo, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Wrench, X, Plus, Search, ChevronDown, Check, Package } from 'lucide-react';

export interface Repuesto {
    id: number;
    nombre: string;
    precio_unitario?: number;
    marca?: string;
    stock?: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    equipoId: number;
    equipoNombre: string;
    equipoEstado: number;
    repuestos: Repuesto[];
}

export default function ModalNuevaReparacion({
    isOpen,
    onClose,
    equipoId,
    equipoNombre,
    equipoEstado,
    repuestos = [],
}: Props) {
    const [searchRepuesto, setSearchRepuesto] = useState('');
    const [isRepuestoOpen, setIsRepuestoOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        equipo_id: number;
        titulo: string;
        descripcion: string;
        costo: string;
        repuesto_id: number | null;
        presupuesto_aprobado: boolean;
    }>({
        equipo_id: equipoId,
        titulo: '',
        descripcion: '',
        costo: '',
        repuesto_id: null,
        presupuesto_aprobado: true,
    });

    // Resetear formulario y buscador al abrir el modal
    useEffect(() => {
        if (isOpen) {
            clearErrors();
            reset();
            setData({
                equipo_id: equipoId,
                titulo: '',
                descripcion: '',
                costo: '',
                repuesto_id: null,
                presupuesto_aprobado: true,
            });
            setSearchRepuesto('');
            setIsRepuestoOpen(false);
        }
    }, [isOpen, equipoId]);

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

    // Filtrar repuestos por nombre o marca según búsqueda
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
        post(route('reparaciones.store'), {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    if (!isOpen) return null;

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
                                Nueva Reparación
                            </h2>
                            <p className="text-xs text-gray-400">
                                Para el equipo: <span className="text-gray-200 font-bold">{equipoNombre}</span>
                            </p>
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

                        {/* AUTOCOMPLETE DE REPUESTO (OPCIONAL) */}
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

                            {/* Dropdown flotante de sugerencias */}
                            {isRepuestoOpen && (
                                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-[#292929] bg-[#0c0c0c] shadow-2xl">
                                    {/* Opción para dejar sin repuesto */}
                                    <button
                                        type="button"
                                        onClick={() => handleSelectRepuesto(null)}
                                        className={`flex w-full items-center justify-between border-b border-[#1f1f1f] px-4 py-2.5 text-left text-xs transition hover:bg-[#161616] ${data.repuesto_id === null
                                            ? 'bg-[#151515] text-lime-400 font-bold'
                                            : 'text-gray-400'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="italic">Sin repuesto asignado (Solo mano de obra)</span>
                                        </div>
                                        {data.repuesto_id === null && <Check size={14} className="text-lime-400" />}
                                    </button>

                                    {/* Lista de repuestos filtrados */}
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
                                                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition border-b border-[#181818] last:border-b-0 hover:bg-[#161616] ${isSelected
                                                        ? 'bg-[#151515] text-lime-400'
                                                        : 'text-gray-200'
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

                            {/* Badge informativo de repuesto seleccionado */}
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

                    {/* Botones de acción del Modal */}
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
                            <Plus size={16} />
                            {processing ? 'GUARDANDO...' : 'REGISTRAR REPARACIÓN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
