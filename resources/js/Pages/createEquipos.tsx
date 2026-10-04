import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { MainLayout } from '@/Layouts/MainLayout';

interface Estado {
    id: number;
    nombre: string;
}

interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni: string;
}

interface Props {
    estados: Estado[];
    clienteExistente: Cliente | null;
}


export default function CreateEquipos({
    estados,
    clienteExistente,
}: Props) {
    console.log("Cliente recibido desde Laravel:", clienteExistente);
    // Estructuramos el estado del formulario agrupado
    const { data, setData, post, processing, errors } = useForm({
        cliente_id: clienteExistente ? clienteExistente.id : null,

        cliente: {
            nombre: clienteExistente ? clienteExistente.nombre : '',
            apellido: clienteExistente ? clienteExistente.apellido : '',
            dni: clienteExistente ? clienteExistente.dni : '',
            telefono: clienteExistente ? clienteExistente.telefono : '',
        },

        equipo: {
            nombre: '',
            estado_id: '',
        },
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        console.log('Datos enviados al backend:', data);

        post('/equipos', {
            onError: (errors) => {
                console.log('Errores devueltos por Laravel:', errors);
            },
        });
    };


    return (
        <MainLayout>
            <div className="min-h-screen bg-[#070707] px-6 py-8 text-white">
                <div className="mx-auto max-w-5xl">

                    {/* ENCABEZADO */}
                    <div className="mb-7">
                        <div className="mb-2 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-lime-400" />

                            <span className="text-xs font-black tracking-[0.3em] text-lime-400">
                                SERVICIO TÉCNICO
                            </span>
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-white">
                            REGISTRAR EQUIPO
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Registrá un nuevo cliente y su equipo en el
                            servicio técnico.
                        </p>
                    </div>

                    {/* FORMULARIO */}
                    <form
                        onSubmit={submit}
                        className="overflow-hidden border border-[#292929] bg-[#0d0d0d]"
                    >

                        {/* =====================================================
                            SECCIÓN 1 - CLIENTE
                        ====================================================== */}
                        <section className="border-b border-[#292929]">

                            {/* Título de sección */}
                            <div className="flex items-center justify-between border-b border-[#222222] px-7 py-5">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-9 w-9 items-center justify-center border border-lime-400/40 bg-lime-400/10 text-sm font-black text-lime-400">
                                        01
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-black tracking-[0.18em] text-gray-200">
                                            INFORMACIÓN DEL CLIENTE
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-600">
                                            Datos de contacto del propietario
                                        </p>
                                    </div>
                                </div>

                                {clienteExistente && (
                                    <span className="flex items-center gap-2 bg-lime-400/10 px-3 py-1.5 text-xs font-black tracking-wide text-lime-400">
                                        <span className="h-2 w-2 rounded-full bg-lime-400" />
                                        CLIENTE REGISTRADO
                                    </span>
                                )}
                            </div>

                            {/* Campos */}
                            <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">

                                {/* Nombre */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        NOMBRE
                                    </label>

                                    <input
                                        type="text"
                                        disabled={!!clienteExistente}
                                        value={data.cliente.nombre}
                                        onChange={(e) =>
                                            setData('cliente', {
                                                ...data.cliente,
                                                nombre: e.target.value,
                                            })
                                        }
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
                                            disabled:cursor-not-allowed
                                            disabled:bg-[#111111]
                                            disabled:text-gray-500
                                        "
                                    />
                                </div>

                                {/* Apellido */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        APELLIDO
                                    </label>

                                    <input
                                        type="text"
                                        disabled={!!clienteExistente}
                                        value={data.cliente.apellido}
                                        onChange={(e) =>
                                            setData('cliente', {
                                                ...data.cliente,
                                                apellido: e.target.value,
                                            })
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
                                            disabled:cursor-not-allowed
                                            disabled:bg-[#111111]
                                            disabled:text-gray-500
                                        "
                                    />
                                </div>

                                {/* DNI */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        DNI
                                    </label>

                                    <input
                                        type="text"
                                        disabled={!!clienteExistente}
                                        value={data.cliente.dni}
                                        onChange={(e) =>
                                            setData('cliente', {
                                                ...data.cliente,
                                                dni: e.target.value,
                                            })
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
                                            disabled:cursor-not-allowed
                                            disabled:bg-[#111111]
                                            disabled:text-gray-500
                                        "
                                    />
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        CELULAR
                                    </label>

                                    <input
                                        type="text"
                                        disabled={!!clienteExistente}
                                        value={data.cliente.telefono}
                                        onChange={(e) =>
                                            setData('cliente', {
                                                ...data.cliente,
                                                telefono: e.target.value,
                                            })
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
                                            disabled:cursor-not-allowed
                                            disabled:bg-[#111111]
                                            disabled:text-gray-500
                                        "
                                    />
                                </div>
                            </div>
                        </section>

                        {/* =====================================================
                            SECCIÓN 2 - EQUIPO
                        ====================================================== */}
                        <section>

                            {/* Título */}
                            <div className="border-b border-[#222222] px-7 py-5">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-9 w-9 items-center justify-center border border-lime-400/40 bg-lime-400/10 text-sm font-black text-lime-400">
                                        02
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-black tracking-[0.18em] text-gray-200">
                                            INFORMACIÓN DEL EQUIPO
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-600">
                                            Datos iniciales del equipo ingresado
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Campos */}
                            <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">

                                {/* Nombre / Modelo */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        NOMBRE / MODELO DEL EQUIPO
                                    </label>

                                    <input
                                        type="text"
                                        value={data.equipo.nombre}
                                        onChange={(e) =>
                                            setData('equipo', {
                                                ...data.equipo,
                                                nombre: e.target.value,
                                            })
                                        }
                                        placeholder="Ej. Lenovo IdeaPad 3"
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
                                    />

                                    {errors['equipo.nombre'] && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            {errors['equipo.nombre']}
                                        </div>
                                    )}
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                        ESTADO INICIAL
                                    </label>

                                    <select
                                        value={data.equipo.estado_id}
                                        onChange={(e) =>
                                            setData('equipo', {
                                                ...data.equipo,
                                                estado_id: e.target.value,
                                            })
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
                                    >
                                        <option value="">
                                            Seleccione un estado
                                        </option>

                                        {estados.map((est) => (
                                            <option
                                                key={est.id}
                                                value={est.id}
                                            >
                                                {est.nombre.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>

                                    {errors['equipo.estado_id'] && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            {errors['equipo.estado_id']}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* =====================================================
                            BOTONES
                        ====================================================== */}
                        <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-[#292929] bg-[#0a0a0a] px-7 py-5 sm:flex-row sm:items-center">

                            <Link
                                href="/equipos"
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
                                "
                            >
                                {processing
                                    ? 'GUARDANDO...'
                                    : 'REGISTRAR EQUIPO'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}