import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo, type FormEvent } from 'react';
import { MainLayout } from '@/Layouts/MainLayout';
import type { CategoriaRepuesto } from '@/Components/Repuestos/EditRepuestos';
import { Search, ChevronDown, X, Check, Tag } from 'lucide-react';

interface Props {
    categorias: CategoriaRepuesto[];
}

export default function CreateRepuestos({ categorias = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        nombre: string;
        marca: string;
        stock: number;
        precio_unitario: number;
        categoria_repuesto_id: number | '';
    }>({
        nombre: '',
        marca: '',
        stock: 0,
        precio_unitario: 0,
        categoria_repuesto_id: categorias[0]?.id ?? '',
    });

    const [searchCategoria, setSearchCategoria] = useState(
        categorias[0]?.nombre ?? ''
    );
    const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar el dropdown del autocomplete al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsCategoriaOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cerrar el dropdown al presionar Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isCategoriaOpen) {
                setIsCategoriaOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCategoriaOpen]);

    const selectedCategoria = useMemo(() => {
        return (
            categorias.find((c) => c.id === Number(data.categoria_repuesto_id)) ||
            null
        );
    }, [categorias, data.categoria_repuesto_id]);

    const filteredCategorias = useMemo(() => {
        const query = searchCategoria.trim().toLowerCase();
        if (!query) return categorias;
        return categorias.filter((c) =>
            c.nombre.toLowerCase().includes(query)
        );
    }, [categorias, searchCategoria]);

    const handleSelectCategoria = (categoria: CategoriaRepuesto | null) => {
        if (categoria) {
            setData('categoria_repuesto_id', categoria.id);
            setSearchCategoria(categoria.nombre);
        } else {
            setData('categoria_repuesto_id', '');
            setSearchCategoria('');
        }
        setIsCategoriaOpen(false);
    };

    const handleSearchCategoriaChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setSearchCategoria(value);
        setIsCategoriaOpen(true);

        if (!value.trim()) {
            setData('categoria_repuesto_id', '');
        } else if (
            selectedCategoria &&
            selectedCategoria.nombre.toLowerCase() !== value.trim().toLowerCase()
        ) {
            const exactMatch = categorias.find(
                (c) => c.nombre.toLowerCase() === value.trim().toLowerCase()
            );
            setData('categoria_repuesto_id', exactMatch ? exactMatch.id : '');
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('repuestos.store'));
    };

    return (
        <MainLayout>
            <Head title="Registrar Repuesto" />

            <div className="min-h-screen bg-[#070707] px-6 py-8 text-white">
                <div className="mx-auto max-w-4xl">
                    {/* ENCABEZADO */}
                    <div className="mb-7">
                        <div className="mb-2 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-lime-400" />
                            <span className="text-xs font-black tracking-[0.3em] text-lime-400">
                                REGISTRAR REPUESTO
                            </span>
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-white">
                            DATOS DEL REPUESTO
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Completá los datos para dar de alta un nuevo repuesto en el inventario.
                        </p>
                    </div>

                    {/* FORMULARIO */}
                    <form
                        onSubmit={submit}
                        className="border border-[#292929] bg-[#0d0d0d]"
                    >
                        <section>

                            <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        NOMBRE DEL REPUESTO
                                    </label>

                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData('nombre', e.target.value)
                                        }
                                        placeholder="Ej. Memoria RAM 16GB DDR4 3200MHz"
                                        className="
                                            h-12 w-full
                                            border border-[#292929]
                                            bg-[#090909]
                                            px-4
                                            text-sm text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-lime-400
                                        "
                                        required
                                    />

                                    {errors.nombre && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            {errors.nombre}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        MARCA
                                    </label>

                                    <input
                                        type="text"
                                        value={data.marca}
                                        onChange={(e) =>
                                            setData('marca', e.target.value)
                                        }
                                        placeholder="Ej. Kingston, Corsair..."
                                        className="
                                            h-12 w-full
                                            border border-[#292929]
                                            bg-[#090909]
                                            px-4
                                            text-sm text-white
                                            outline-none
                                            transition
                                            placeholder:text-gray-700
                                            focus:border-lime-400
                                        "
                                        required
                                    />

                                    {errors.marca && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            {errors.marca}
                                        </div>
                                    )}
                                </div>

                                {/* AUTOCOMPLETE DE CATEGORÍA */}
                                <div ref={dropdownRef} className="relative">
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        CATEGORÍA
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                                            <Search size={15} />
                                        </span>

                                        <input
                                            type="text"
                                            value={searchCategoria}
                                            onChange={handleSearchCategoriaChange}
                                            onFocus={() => setIsCategoriaOpen(true)}
                                            placeholder="Buscar o seleccionar categoría..."
                                            className="
                                                h-12 w-full
                                                border border-[#292929]
                                                bg-[#090909]
                                                pl-10 pr-16
                                                text-sm text-white
                                                outline-none
                                                transition
                                                placeholder:text-gray-700
                                                focus:border-lime-400
                                            "
                                        />

                                        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                                            {searchCategoria && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectCategoria(null)
                                                    }
                                                    className="p-1 text-gray-500 transition hover:text-white cursor-pointer"
                                                    title="Limpiar categoría"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsCategoriaOpen((prev) => !prev)
                                                }
                                                className="p-1 text-gray-500 transition hover:text-white cursor-pointer"
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-200 ${isCategoriaOpen
                                                        ? 'rotate-180'
                                                        : ''
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lista desplegable de sugerencias */}
                                    {isCategoriaOpen && (
                                        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-[#292929] bg-[#0c0c0c] shadow-2xl">
                                            {filteredCategorias.length === 0 ? (
                                                <div className="px-4 py-4 text-center text-xs text-gray-500">
                                                    No se encontraron categorías con &ldquo;
                                                    {searchCategoria}&rdquo;
                                                </div>
                                            ) : (
                                                filteredCategorias.map((cat) => {
                                                    const isSelected =
                                                        Number(
                                                            data.categoria_repuesto_id
                                                        ) === cat.id;

                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handleSelectCategoria(cat)
                                                            }
                                                            className={`flex w-full items-center justify-between border-b border-[#181818] px-4 py-3 text-left text-xs transition last:border-b-0 hover:bg-[#161616] cursor-pointer ${isSelected
                                                                ? 'bg-[#151515] font-bold text-lime-400'
                                                                : 'text-gray-200'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Tag
                                                                    size={13}
                                                                    className={
                                                                        isSelected
                                                                            ? 'text-lime-400'
                                                                            : 'text-gray-500'
                                                                    }
                                                                />
                                                                <span className="uppercase">
                                                                    {cat.nombre}
                                                                </span>
                                                            </div>

                                                            {isSelected && (
                                                                <Check
                                                                    size={14}
                                                                    className="text-lime-400"
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}

                                    {errors.categoria_repuesto_id && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            {errors.categoria_repuesto_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        STOCK INICIAL
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={data.stock}
                                        onChange={(e) =>
                                            setData('stock', Number(e.target.value))
                                        }
                                        className="
                                            h-12 w-full
                                            border border-[#292929]
                                            bg-[#090909]
                                            px-4
                                            text-sm text-white
                                            outline-none
                                            transition
                                            focus:border-lime-400
                                        "
                                        required
                                    />

                                    {errors.stock && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            {errors.stock}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        PRECIO UNITARIO ($)
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={data.precio_unitario}
                                        onChange={(e) =>
                                            setData(
                                                'precio_unitario',
                                                Number(e.target.value)
                                            )
                                        }
                                        className="
                                            h-12 w-full
                                            border border-[#292929]
                                            bg-[#090909]
                                            px-4
                                            text-sm text-white
                                            outline-none
                                            transition
                                            focus:border-lime-400
                                        "
                                        required
                                    />

                                    {errors.precio_unitario && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            {errors.precio_unitario}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* BOTONES */}
                        <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-[#292929] bg-[#0a0a0a] px-7 py-5 sm:flex-row sm:items-center">
                            <Link
                                href={route('repuestos.index')}
                                className="
                                    border border-[#292929]
                                    px-5 py-3
                                    text-center
                                    text-xs font-black tracking-wider
                                    text-gray-500
                                    transition
                                    hover:border-gray-500
                                    hover:text-white
                                "
                            >
                                CANCELAR
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="
                                    bg-lime-400
                                    px-7 py-3
                                    text-xs font-black tracking-wider
                                    text-black
                                    transition
                                    hover:bg-lime-300
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    cursor-pointer
                                "
                            >
                                {processing
                                    ? 'GUARDANDO...'
                                    : 'REGISTRAR REPUESTO'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

