import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { UserRound, Mail, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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

    return (
        <GuestLayout>
            <Head title="Crear cuenta" />

            <div className="mb-7">
                <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-400">
                        Nuevo usuario
                    </span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Crear cuenta
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Completá tus datos para registrarte en el sistema.
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
                            placeholder="Tu nombre"
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
                        {processing ? 'Creando cuenta...' : 'Crear cuenta'}
                    </PrimaryButton>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-gray-500">
                            ¿Ya tenés una cuenta?
                        </span>

                        <Link
                            href={route('login')}
                            className="font-medium text-lime-400 transition hover:text-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}