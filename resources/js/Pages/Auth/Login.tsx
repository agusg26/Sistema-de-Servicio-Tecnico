
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {/* Mensaje de estado */}
            {status && (
                <div className="mb-6 border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm text-lime-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">

                {/* Email */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="CORREO ELECTRÓNICO"
                        className="!text-[10px] !font-black !tracking-[0.2em] !text-gray-500"
                    />

                    <div className="relative mt-2">
                        <Mail
                            size={16}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="!h-12 !w-full !border-[#292929] !bg-[#090909] !pl-11 !pr-4 !text-sm !text-white placeholder:!text-gray-700 focus:!border-lime-400 focus:!ring-0"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="nombre@correo.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <InputError
                        message={errors.email}
                        className="mt-2 !text-xs !text-red-400"
                    />
                </div>

                {/* Contraseña */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="CONTRASEÑA"
                        className="!text-[10px] !font-black !tracking-[0.2em] !text-gray-500"
                    />

                    <div className="relative mt-2">
                        <LockKeyhole
                            size={16}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="!h-12 !w-full !border-[#292929] !bg-[#090909] !pl-11 !pr-4 !text-sm !text-white placeholder:!text-gray-700 focus:!border-lime-400 focus:!ring-0"
                            autoComplete="current-password"
                            placeholder="Ingresá tu contraseña"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>

                    <InputError
                        message={errors.password}
                        className="mt-2 !text-xs !text-red-400"
                    />
                </div>

                {/* Recordarme */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    e.target.checked as false,
                                )
                            }
                            className="border-[#444] bg-[#090909] text-lime-400 focus:ring-lime-400"
                        />

                        <span className="text-xs font-medium text-gray-400">
                            Recordar mi sesión
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs font-bold text-gray-500 transition hover:text-lime-400"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                {/* Botón */}
                <div className="pt-3">
                    <PrimaryButton
                        className="!flex !h-12 !w-full !items-center !justify-center !border-0 !bg-lime-400 !px-5 !text-xs !font-black !tracking-[0.2em] !text-black !transition hover:!bg-lime-300 focus:!ring-lime-400 disabled:!cursor-not-allowed disabled:!opacity-50"
                        disabled={processing}
                    >
                        {processing ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
                    </PrimaryButton>
                </div>

            </form>
        </GuestLayout>
    );
}
