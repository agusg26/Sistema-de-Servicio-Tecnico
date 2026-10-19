
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070707] px-4 py-10 text-white">

            {/* Detalles decorativos del fondo */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-lime-400/30 to-transparent" />

                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/[0.03] blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Logo e identidad */}
                <div className="mb-8 flex flex-col items-center">
                    <Link
                        href="/"
                        className="mb-5 flex h-16 w-16 items-center justify-center border border-lime-400/40 bg-lime-400/10 transition hover:border-lime-400"
                    >
                        <ApplicationLogo className="h-9 w-9 fill-current text-lime-400" />
                    </Link>

                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-lime-400" />

                        <span className="text-[10px] font-black tracking-[0.35em] text-lime-400">
                            SERVICIO TÉCNICO
                        </span>
                    </div>

                    <p className="text-xs tracking-widest text-gray-500">
                        SISTEMA DE GESTIÓN
                    </p>
                </div>

                {/* Panel principal */}
                <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b] shadow-2xl">

                    {/* Cabecera del panel */}
                    <div className="border-b border-[#292929] bg-[#0d0d0d] px-7 py-5">
                        <div className="text-[10px] font-black tracking-[0.25em] text-gray-500">
                            ACCESO AL SISTEMA
                        </div>
                    </div>

                    {/* Contenido: Login, registro, recuperación, etc. */}
                    <div className="px-7 py-7">
                        {children}
                    </div>

                    {/* Pie */}
                    <div className="border-t border-[#292929] bg-[#090909] px-7 py-4">
                        <p className="text-center text-[10px] font-bold tracking-wider text-gray-600">
                            ACCESO EXCLUSIVO PARA PERSONAL AUTORIZADO
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-[10px] tracking-wider text-gray-700">
                    SISTEMA DE GESTIÓN · SERVICIO TÉCNICO
                </p>
            </div>
        </div>
    );
}
