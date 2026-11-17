import React, { useState, FormEvent } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { MainLayout } from '@/Layouts/MainLayout';
import {
    UserCircle,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Shield,
    Mail,
} from 'lucide-react';

export interface Empleado {
    id: number;
    name: string;
    email: string;
    role: string;
    roles?: string[];
    created_at?: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}
interface SharedPageProps {
    auth: {
        user: AuthUser;
    };
    [key: string]: any;
}

interface Props {
    empleados: Empleado[];
    roles?: string[];
}

interface SharedAuth {
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

const ROLE_LABELS: Record<string, string> = {
    tecnico: 'TÉCNICO',
    admin: 'ADMIN',
    'super admin': 'SUPER ADMIN',
};

export default function EmpleadosIndex({
    empleados = [],
    roles = ['tecnico', 'admin', 'super admin'],
}: Props) {
    const { auth } = usePage<SharedPageProps>().props;
    const currentUserId = auth?.user?.id;

    const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(
        null
    );

    const handleDelete = (empleado: Empleado) => {
        if (empleado.id === currentUserId) {
            alert('No puedes eliminar tu propia cuenta de usuario.');
            return;
        }

        if (
            !confirm(
                `¿Estás seguro de eliminar al empleado "${empleado.name}" (${empleado.email})?`
            )
        ) {
            return;
        }

        router.delete(route('empleados.destroy', empleado.id), {
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Gestión de Empleados" />

            <div className="p-5 space-y-4">
                {/* TABLA DE EMPLEADOS */}
                <div className="overflow-hidden border border-[#292929] bg-[#0b0b0b]">
                    {/* Cabecera */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] px-7 py-5">
                        <div className="flex items-center gap-4">
                            <UserCircle size={24} className="text-lime-400" />
                            <h2 className="text-sm font-black tracking-[0.2em] text-gray-300">
                                EMPLEADOS (USUARIOS)
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-500">
                                Mostrando {empleados.length}
                            </span>

                            <Link
                                href={route('register')}
                                className="flex items-center gap-2 border border-lime-400 px-4 py-2 text-xs font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black cursor-pointer"
                            >
                                <Plus size={15} />
                                NUEVO EMPLEADO
                            </Link>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#292929] text-left">
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        ID
                                    </th>
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        NOMBRE
                                    </th>
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        CORREO ELECTRÓNICO
                                    </th>
                                    <th className="px-5 py-4 text-xs font-black tracking-widest text-gray-500">
                                        ROL ASIGNADO
                                    </th>
                                    <th className="px-7 py-4 text-xs font-black tracking-widest text-gray-500">
                                        ACCIONES
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {empleados.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-8 text-center text-sm text-gray-500"
                                        >
                                            No hay empleados registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    empleados.map((emp) => {
                                        const isCurrentUser =
                                            emp.id === currentUserId;

                                        return (
                                            <tr
                                                key={emp.id}
                                                className="border-b border-[#202020] transition hover:bg-[#151515]"
                                            >
                                                <td className="px-5 py-4 font-bold text-gray-100">
                                                    {emp.id}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-bold text-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <span>{emp.name}</span>
                                                        {isCurrentUser && (
                                                            <span className="bg-lime-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-lime-400">
                                                                Tú
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-xs text-gray-400">
                                                    <span className="inline-flex items-center gap-1.5 font-mono">
                                                        <Mail
                                                            size={13}
                                                            className="text-gray-500"
                                                        />
                                                        {emp.email}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1.5 rounded border border-[#292929] bg-[#111111] px-3 py-1 text-xs font-black uppercase tracking-wider text-lime-400">
                                                        <Shield size={12} />
                                                        {ROLE_LABELS[emp.role] ??
                                                            emp.role}
                                                    </span>
                                                </td>

                                                <td className="px-7 py-4">
                                                    <div className="flex gap-2.5">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEmpleadoEditando(emp)
                                                            }
                                                            className="flex items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-lime-400 hover:text-lime-400 cursor-pointer"
                                                        >
                                                            <Pencil size={15} />
                                                            EDITAR ROL
                                                        </button>

                                                        {!isCurrentUser && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(emp)
                                                                }
                                                                className="flex items-center gap-2 border border-[#333] px-4 py-2 text-xs font-black text-gray-400 transition hover:border-red-500 hover:text-red-400 cursor-pointer"
                                                            >
                                                                <Trash2 size={15} />
                                                                ELIMINAR
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL: EDITAR ROL DEL EMPLEADO */}
            {empleadoEditando && (
                <EditarRolModal
                    empleado={empleadoEditando}
                    roles={roles}
                    onClose={() => setEmpleadoEditando(null)}
                />
            )}
        </MainLayout>
    );
}

interface EditarRolModalProps {
    empleado: Empleado;
    roles: string[];
    onClose: () => void;
}

function EditarRolModal({ empleado, roles, onClose }: EditarRolModalProps) {
    const { data, setData, put, processing, errors } = useForm({
        role: empleado.role || roles[0] || 'tecnico',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(route('empleados.update', empleado.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-lg overflow-hidden border border-[#292929] bg-[#0b0b0b] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#292929] bg-[#0d0d0d] px-7 py-5">
                    <div>
                        <div className="mb-2 text-[10px] font-black tracking-[0.3em] text-lime-400">
                            GESTIÓN DE EMPLEADOS
                        </div>

                        <h2 className="text-xl font-black tracking-tight text-white">
                            EDITAR ROL DE USUARIO
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Modificá el rol asignado al empleado seleccionado.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center border border-[#292929] text-gray-500 transition hover:border-gray-500 hover:text-white cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 p-7">
                        <div>
                            <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                EMPLEADO
                            </label>
                            <input
                                type="text"
                                value={`${empleado.name} (${empleado.email})`}
                                disabled
                                className="h-12 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-gray-400 outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                                ROL ASIGNADO
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="h-12 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-lime-400"
                                required
                            >
                                {roles.map((rol) => (
                                    <option
                                        key={rol}
                                        value={rol}
                                        className="bg-[#090909] text-white"
                                    >
                                        {ROLE_LABELS[rol] ?? rol.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            {errors.role && (
                                <p className="mt-2 text-xs font-semibold text-red-400">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-[#292929] bg-[#0a0a0a] px-7 py-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-[#292929] px-5 py-3 text-xs font-black tracking-wider text-gray-500 transition hover:border-gray-500 hover:text-white cursor-pointer"
                        >
                            CANCELAR
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-lime-400 px-6 py-3 text-xs font-black tracking-wider text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
