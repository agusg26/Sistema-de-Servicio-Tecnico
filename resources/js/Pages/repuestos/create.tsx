import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { MainLayout } from '@/Layouts/MainLayout';
import type { CategoriaRepuesto } from '@/Components/Repuestos/EditRepuestos';

interface Props {
    categorias: CategoriaRepuesto[];
}

export default function CreateRepuestos({ categorias = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        marca: '',
        stock: 0,
        precio_unitario: 0,
        categoria_repuesto_id: categorias[0]?.id ?? '',
    });

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
                                GESTIÓN DE INVENTARIO
                            </span>
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-white">
                            REGISTRAR REPUESTO
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Completá los datos para dar de alta un nuevo repuesto en el inventario.
                        </p>
                    </div>

                    {/* FORMULARIO */}
                    <form
                        onSubmit={submit}
                        className="overflow-hidden border border-[#292929] bg-[#0d0d0d]"
                    >
                        <section>
                            <div className="border-b border-[#222222] px-7 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-9 w-9 items-center justify-center border border-lime-400/40 bg-lime-400/10 text-sm font-black text-lime-400">
                                        01
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-black tracking-[0.18em] text-gray-200">
                                            DATOS DEL REPUESTO
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-600">
                                            Información general, stock y precio unitario
                                        </p>
                                    </div>
                                </div>
                            </div>

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

                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
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
                                            text-sm text-gray-300
                                            outline-none
                                            transition
                                            focus:border-lime-400
                                        "
                                        required
                                    >
                                        <option value="" disabled>
                                            Seleccione una categoría
                                        </option>
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

