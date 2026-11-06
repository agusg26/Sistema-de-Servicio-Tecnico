import { useForm } from '@inertiajs/react';
import { X, Save } from 'lucide-react';
import { FormEvent } from 'react';

export interface CategoriaRepuesto {
    id: number;
    nombre: string;
}

export interface Repuesto {
    id: number;
    nombre: string;
    marca: string;
    stock: number;
    precio_unitario: number;
    categoria_repuesto_id: number;
    categoria?: CategoriaRepuesto;
    categoria_repuesto?: CategoriaRepuesto;
}

interface Props {
    repuesto: Repuesto;
    categorias: CategoriaRepuesto[];
    onClose: () => void;
}

export default function EditRepuestos({ repuesto, categorias, onClose }: Props) {
    const { data, setData, errors, put, processing } = useForm({
        nombre: repuesto.nombre,
        marca: repuesto.marca,
        stock: repuesto.stock,
        precio_unitario: repuesto.precio_unitario,
        categoria_repuesto_id: repuesto.categoria_repuesto_id,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(route('repuestos.update', repuesto.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/75
                px-4
                backdrop-blur-sm
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="
                    w-full max-w-2xl
                    overflow-hidden
                    border border-[#292929]
                    bg-[#0b0b0b]
                    shadow-2xl
                "
            >
                <div
                    className="
                        flex items-center justify-between
                        border-b border-[#292929]
                        bg-[#0d0d0d]
                        px-7 py-5
                    "
                >
                    <div>
                        <div
                            className="
                                mb-2
                                text-[10px]
                                font-black
                                tracking-[0.3em]
                                text-lime-400
                            "
                        >
                            GESTIÓN DE REPUESTOS
                        </div>

                        <h2
                            className="
                                text-xl
                                font-black
                                tracking-tight
                                text-white
                            "
                        >
                            EDITAR REPUESTO
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Modificá la información del repuesto seleccionado.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            border border-[#292929]
                            text-gray-500
                            transition
                            hover:border-gray-500
                            hover:text-white
                            cursor-pointer
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label
                                className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                "
                            >
                                NOMBRE DEL REPUESTO
                            </label>

                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
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

                            {errors.nombre && (
                                <p className="mt-2 text-xs font-semibold text-red-400">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                "
                            >
                                MARCA
                            </label>

                            <input
                                type="text"
                                value={data.marca}
                                onChange={(e) => setData('marca', e.target.value)}
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

                            {errors.marca && (
                                <p className="mt-2 text-xs font-semibold text-red-400">
                                    {errors.marca}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                "
                            >
                                CATEGORÍA
                            </label>

                            <select
                                value={data.categoria_repuesto_id}
                                onChange={(e) =>
                                    setData(
                                        'categoria_repuesto_id',
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
                            >
                                {categorias.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                        className="bg-[#090909] text-white"
                                    >
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>

                            {errors.categoria_repuesto_id && (
                                <p className="mt-2 text-xs font-semibold text-red-400">
                                    {errors.categoria_repuesto_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                "
                            >
                                STOCK DISPONIBLE
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
                                <p className="mt-2 text-xs font-semibold text-red-400">
                                    {errors.stock}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                className="
                                    mb-2 block
                                    text-xs
                                    font-black
                                    tracking-wider
                                    text-gray-500
                                "
                            >
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
                                <p className="mt-2 text-xs font-semibold text-red-400">
                                    {errors.precio_unitario}
                                </p>
                            )}
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-3
                            border-t border-[#292929]
                            bg-[#0a0a0a]
                            px-7 py-5
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                border border-[#292929]
                                px-5 py-3
                                text-xs
                                font-black
                                tracking-wider
                                text-gray-500
                                transition
                                hover:border-gray-500
                                hover:text-white
                                cursor-pointer
                            "
                        >
                            CANCELAR
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="
                                flex items-center gap-2
                                bg-lime-400
                                px-6 py-3
                                text-xs
                                font-black
                                tracking-wider
                                text-black
                                transition
                                hover:bg-lime-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                cursor-pointer
                            "
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

