import { useForm } from '@inertiajs/react';
import { X, Save } from 'lucide-react';
import { FormEvent } from 'react';

interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
}

interface Props {
    cliente: Cliente;
    onClose: () => void;
}

export default function EditClients({ cliente, onClose }: Props) {

    const { data, setData, errors, put, processing } = useForm({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        dni: cliente.dni,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(`/clientes/${cliente.id}`, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        /*
         * Overlay
         */
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

            {/* Modal */}
            <div
                className="
                    w-full max-w-2xl
                    overflow-hidden
                    border border-[#292929]
                    bg-[#0b0b0b]
                    shadow-2xl
                "
            >

                <div className="
                    flex items-center justify-between
                    border-b border-[#292929]
                    bg-[#0d0d0d]
                    px-7 py-5
                ">

                    <div>
                        <div className="
                            mb-2
                            text-[10px]
                            font-black
                            tracking-[0.3em]
                            text-lime-400
                        ">
                            GESTIÓN DE CLIENTES
                        </div>

                        <h2 className="
                            text-xl
                            font-black
                            tracking-tight
                            text-white
                        ">
                            EDITAR CLIENTE
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Modificá la información del cliente seleccionado.
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
                        "
                    >
                        <X size={18} />
                    </button>
                </div>


                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">

                        <div>
                            <label className="
                                mb-2 block
                                text-xs
                                font-black
                                tracking-wider
                                text-gray-500
                            ">
                                NOMBRE
                            </label>

                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData('nombre', e.target.value)
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
                            />

                            {errors.nombre && (
                                <p className="
                                    mt-2
                                    text-xs
                                    font-semibold
                                    text-red-400
                                ">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="
                                mb-2 block
                                text-xs
                                font-black
                                tracking-wider
                                text-gray-500
                            ">
                                APELLIDO
                            </label>

                            <input
                                type="text"
                                value={data.apellido}
                                onChange={(e) =>
                                    setData('apellido', e.target.value)
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
                            />

                            {errors.apellido && (
                                <p className="
                                    mt-2
                                    text-xs
                                    font-semibold
                                    text-red-400
                                ">
                                    {errors.apellido}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className="
                                mb-2 block
                                text-xs
                                font-black
                                tracking-wider
                                text-gray-500
                            ">
                                DOCUMENTO
                            </label>

                            <input
                                type="text"
                                value={data.dni}
                                onChange={(e) =>
                                    setData('dni', e.target.value)
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
                            />

                            {errors.dni && (
                                <p className="
                                    mt-2
                                    text-xs
                                    font-semibold
                                    text-red-400
                                ">
                                    {errors.dni}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className="
                                mb-2 block
                                text-xs
                                font-black
                                tracking-wider
                                text-gray-500
                            ">
                                TELÉFONO
                            </label>

                            <input
                                type="text"
                                value={data.telefono}
                                onChange={(e) =>
                                    setData('telefono', e.target.value)
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
                            />

                            {errors.telefono && (
                                <p className="
                                    mt-2
                                    text-xs
                                    font-semibold
                                    text-red-400
                                ">
                                    {errors.telefono}
                                </p>
                            )}
                        </div>

                    </div>

                    <div className="
                        flex
                        items-center
                        justify-end
                        gap-3
                        border-t border-[#292929]
                        bg-[#0a0a0a]
                        px-7 py-5
                    ">

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
                            "
                        >
                            <Save size={16} />

                            {processing
                                ? 'GUARDANDO...'
                                : 'GUARDAR CAMBIOS'}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}