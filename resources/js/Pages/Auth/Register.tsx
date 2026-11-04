import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { UserRound, Mail, LockKeyhole, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface RegisterProps {
    roles?: string[];
}

interface SharedAuth {
    user?: {
        id: number;
        name: string;
        email: string;
        roles?: string[];
    } | null;
}

const ROLE_LABELS: Record<string, string> = {
    tecnico: 'Técnico',
    admin: 'Administrador',
    'super admin': 'Super Administrador',
};

export default function Register({
    roles = ['tecnico', 'admin', 'super admin'],
}: RegisterProps) {
    const { auth } = usePage<{ auth: SharedAuth }>().props;
    const userRoles = auth?.user?.roles ?? [];
    const canRegisterUsers = userRoles.some((rol) =>
        ['admin', 'super admin'].includes(rol),
    );

    const defaultRole = roles.includes('tecnico') ? 'tecnico' : (roles[0] ?? 'tecnico');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: defaultRole,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClassName =
        'mt-2 block w-full rounded-lg border border-[#292929] bg-[#080808] px-4 py-3 text-sm text-white placeholder:text-gray-600 transition duration-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30';

    if (!canRegisterUsers) {
        return (
            <GuestLayout>
                <Head title="Acceso denegado" />
                <div className="space-y-4 py-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                        <ShieldAlert size={24} />
                    </div>
                    <h1 className="text-xl font-semibold text-white">
                        Acceso restringido
                    </h1>
                    <p className="text-sm text-gray-400">
                        Solo los usuarios con rol <span className="font-semibold text-lime-400">Admin</span> o{' '}
                        <span className="font-semibold text-lime-400">Super Admin</span> pueden registrar nuevos usuarios.
                    </p>
                    <div className="pt-2">
                        <Link
                            href={route('equipos.index')}
                            className="inline-flex items-center justify-center rounded-lg border border-[#292929] bg-[#111111] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-300 transition hover:border-lime-400 hover:text-white"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Crear nuevo usuario" />

            <div className="mb-7">
                <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-400">
                        Administración de usuarios
                    </span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Crear nuevo usuario
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Completá los datos y asigná el rol para registrar un usuario en el sistema.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nombre completo"
                        className="text-xs font-medium uppercase tracking-wider text-gray-400"
                    />

                    <div className="relative">
                        <UserRound
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                        />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className={`${inputClassName} pl-10`}
                            autoComplete="name"
                            isFocused={true}
                            placeholder="Nombre del usuario"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>

                    <InputError
                        message={errors.name}
                        className="mt-2 text-xs"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Correo electrónico"
                        className="text-xs font-medium uppercase tracking-wider text-gray-400"
                    />

                    <div className="relative">
                        <Mail
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={`${inputClassName} pl-10`}
                            autoComplete="username"
                            placeholder="correo@ejemplo.com"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>

                    <InputError
                        message={errors.email}
                        className="mt-2 text-xs"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="role"
                        value="Rol asignado"
                        className="text-xs font-medium uppercase tracking-wider text-gray-400"
                    />

                    <div className="relative">
                        <Shield
                            size={17}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                        />

                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className={`${inputClassName} pl-10`}
                            required
                        >
                            {roles.map((rol) => (
                                <option
                                    key={rol}
                                    value={rol}
                                    className="bg-[#0b0b0b] text-white"
                                >
                                    {ROLE_LABELS[rol] ?? rol.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <InputError
                        message={errors.role}
                        className="mt-2 text-xs"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Contraseña"
                        className="text-xs font-medium uppercase tracking-wider text-gray-400"
                    />

                    <div className="relative">
                        <LockKeyhole
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={`${inputClassName} pl-10`}
                            autoComplete="new-password"
                            placeholder="Ingresá una contraseña"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>

                    <InputError
                        message={errors.password}
                        className="mt-2 text-xs"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contraseña"
                        className="text-xs font-medium uppercase tracking-wider text-gray-400"
                    />

                    <div className="relative">
                        <ShieldCheck
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={`${inputClassName} pl-10`}
                            autoComplete="new-password"
                            placeholder="Repetí la contraseña"
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            required
                        />
                    </div>

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-xs"
                    />
                </div>

                <div className="space-y-4 pt-2">
                    <PrimaryButton
                        className="!flex !w-full !justify-center !rounded-lg !border !border-lime-300 !bg-lime-400 !px-4 !py-3 !text-sm !font-semibold !text-black transition duration-200 hover:!border-lime-300 hover:!bg-lime-300 disabled:!cursor-not-allowed disabled:!opacity-50"
                        disabled={processing}
                    >
                        {processing ? 'Creando usuario...' : 'Crear usuario'}
                    </PrimaryButton>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Link
                            href={route('equipos.index')}
                            className="font-medium text-lime-400 transition hover:text-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                        >
                            Volver al panel de equipos
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}