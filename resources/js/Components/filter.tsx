import React from "react";
import { Search, ChevronDown, SlidersHorizontal, RotateCcw, Calendar, User } from "lucide-react";

export interface FilterOption {
    label: string;
    value: string;
}

export interface ProductFiltersProps {
    search?: string;
    onSearchChange?: (value: string) => void;
    clientName?: string;
    onClientNameChange?: (value: string) => void;
    date?: string;
    onDateChange?: (value: string) => void;
    status?: string;
    onStatusChange?: (value: string) => void;
    statusOptions?: FilterOption[];
    onFilter?: () => void;
    onReset?: () => void;
    placeholder?: string;
}

export default function ProductFilters({
    search = "",
    onSearchChange,
    clientName = "",
    onClientNameChange,
    date = "",
    onDateChange,
    status = "",
    onStatusChange,
    statusOptions = [],
    onFilter,
    onReset,
    placeholder = "Buscar equipo / producto...",
}: ProductFiltersProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onFilter) onFilter();
    };

    const hasActiveFilters = Boolean(search || clientName || date || status);

    return (
        <section className="border border-[#292929] bg-[#0d0d0d] p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1.2fr_1fr_auto_auto]">
                {/* Buscar por Nombre de Equipo / Producto */}
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder={placeholder}
                        className="
              h-14 w-full
              border border-[#292929]
              bg-[#090909]
              pl-12 pr-4
              text-sm text-white
              outline-none
              placeholder:text-gray-600
              focus:border-lime-400
              transition
            "
                    />
                </div>

                {/* Buscar por Nombre de Cliente */}
                <div className="relative">
                    <User
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                        type="text"
                        value={clientName}
                        onChange={(e) => onClientNameChange?.(e.target.value)}
                        placeholder="Nombre de cliente..."
                        className="
              h-14 w-full
              border border-[#292929]
              bg-[#090909]
              pl-12 pr-4
              text-sm text-white
              outline-none
              placeholder:text-gray-600
              focus:border-lime-400
              transition
            "
                    />
                </div>

                {/* Filtrar por Fecha de Ingreso */}
                <div className="relative">
                    <label className="absolute left-4 top-1.5 text-[10px] font-black tracking-widest text-gray-500">
                        FECHA INGRESO
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => onDateChange?.(e.target.value)}
                        className="
              h-14 w-full
              border border-[#292929]
              bg-[#090909]
              px-4 pt-3.5
              text-sm text-gray-300
              outline-none
              focus:border-lime-400
              transition
              [color-scheme:dark]
            "
                    />
                </div>

                {/* Filtro por estado */}
                {statusOptions.length > 0 ? (
                    <FilterSelect
                        label="ESTADO"
                        value={status}
                        onChange={(val) => onStatusChange?.(val)}
                        options={statusOptions}
                    />
                ) : (
                    <div />
                )}

                {/* Botón Filtrar */}
                <button
                    type="submit"
                    className="
            flex h-14 items-center justify-center gap-2
            border border-lime-400
            px-6
            text-sm font-black tracking-wider
            text-lime-400
            transition
            hover:bg-lime-400
            hover:text-black
            cursor-pointer
          "
                >
                    <SlidersHorizontal size={18} />
                    FILTRAR
                </button>

                {/* Botón Limpiar */}
                {onReset && hasActiveFilters ? (
                    <button
                        type="button"
                        onClick={onReset}
                        title="Limpiar filtros"
                        className="
              flex h-14 items-center justify-center gap-2
              border border-[#292929]
              px-4
              text-sm font-bold tracking-wider
              text-gray-400
              transition
              hover:border-gray-500
              hover:text-white
              cursor-pointer
            "
                    >
                        <RotateCcw size={16} />
                        LIMPIAR
                    </button>
                ) : null}
            </form>
        </section>
    );
}

interface FilterSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
}

export function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
    return (
        <div className="relative">
            <label className="absolute left-4 top-1.5 text-[10px] font-black tracking-widest text-gray-500">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
          h-14 w-full
          appearance-none
          border border-[#292929]
          bg-[#090909]
          px-4 pt-4
          text-sm text-gray-300
          outline-none
          focus:border-lime-400
          cursor-pointer
        "
            >
                <option value="">TODOS</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#090909] text-white">
                        {opt.label}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
        </div>
    );
}