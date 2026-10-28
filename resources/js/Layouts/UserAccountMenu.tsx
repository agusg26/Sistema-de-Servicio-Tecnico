import { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    User,
    Settings,
    LogOut,
    UserPlus,
    Check,
    ChevronDown,
    ShieldCheck
} from 'lucide-react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles?: string[];
    avatar_url?: string;
}

interface SharedProps {
    auth: {
        user: AuthUser;
    };
    [key: string]: any;
}

export default function UserAccountMenu() {
    const { auth } = usePage<SharedProps>().props;
    const currentUser = auth.user;

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cuentas vinculadas o guardadas (puedes inyectarlas por props o localStorage)
    const otherAccounts: AuthUser[] = [
        // Ejemplo de otra cuenta secundaria registrada en el equipo
        // { id: 2, name: 'Admin Taller', email: 'admin@sistemaigstc.local', roles: ['admin'] }
    ];

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSwitchAccount = (accountId: number) => {
        // Petición al backend para alternar cuenta/impersonate
        router.post(route('impersonate.switch', accountId), {}, {
            onFinish: () => setIsOpen(false),
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!currentUser) return null;

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* BOTÓN TRIGGER: AVATAR + NOMBRE */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded border border-[#262626] bg-[#0d0d0d] p-1.5 pr-3 text-left transition hover:border-[#3d3d3d] hover:bg-[#141414] focus:outline-none"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-lime-400 font-bold text-black text-xs">
                    {getInitials(currentUser.name)}
                </div>
                <div className="hidden text-left sm:block">
                    <p className="text-xs font-bold text-gray-200 leading-tight">
                        {currentUser.name}
                    </p>
                    <p className="text-[10px] text-gray-500 leading-tight">
                        {currentUser.roles?.[0] || 'Usuario'}
                    </p>
                </div>
                <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* POPUP DROPDOWN (ACCOUNT SWITCHER) */}
            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 border border-[#262626] bg-[#0c0c0c] shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-100">
                    {/* CABECERA: CUENTA ACTUAL ACTIVA */}
                    <div className="border-b border-[#1f1f1f] bg-[#111111] p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-400 font-black text-black text-sm shadow-md">
                                {getInitials(currentUser.name)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="truncate text-sm font-black text-white">
                                    {currentUser.name}
                                </p>
                                <p className="truncate text-xs text-gray-400 font-mono">
                                    {currentUser.email}
                                </p>
                                {currentUser.roles && (
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-lime-400 font-semibold uppercase tracking-wider">
                                        <ShieldCheck size={12} />
                                        <span>{currentUser.roles.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SELECCIÓN DE OTRAS CUENTAS VINCULADAS */}
                    {otherAccounts.length > 0 && (
                        <div className="border-b border-[#1f1f1f] py-2">
                            <p className="px-4 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500">
                                Cambiar de cuenta
                            </p>

                            {/* Cuenta activa actual con tilde */}
                            <div className="flex items-center justify-between px-4 py-2 bg-lime-400/5 text-xs text-lime-400 font-bold">
                                <div className="truncate">
                                    <p className="text-white">{currentUser.name}</p>
                                    <p className="text-[10px] text-gray-400 font-normal">{currentUser.email}</p>
                                </div>
                                <Check size={14} className="text-lime-400 shrink-0" />
                            </div>

                            {/* Otras cuentas */}
                            {otherAccounts.map((account) => (
                                <button
                                    key={account.id}
                                    type="button"
                                    onClick={() => handleSwitchAccount(account.id)}
                                    className="flex w-full items-center justify-between px-4 py-2 text-left text-xs text-gray-300 transition hover:bg-[#161616]"
                                >
                                    <div className="truncate">
                                        <p className="font-semibold text-gray-200">{account.name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">{account.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ACCIONES Y ENLACES */}
                    <div className="p-2 space-y-0.5">
                        <Link
                            href={route('profile.edit')}
                            onClick={() => setIsOpen(false)}
                            className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-[#1a1a1a] hover:text-white"
                        >
                            <Settings size={15} className="text-gray-400" />
                            <span>Configuración de cuenta</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                router.visit(route('login'));
                            }}
                            className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-[#1a1a1a] hover:text-white"
                        >
                            <UserPlus size={15} className="text-gray-400" />
                            <span>Acceder con otra cuenta</span>
                        </button>
                    </div>

                    {/* CIERRE DE SESIÓN */}
                    <div className="border-t border-[#1f1f1f] p-2 bg-[#090909]">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            onClick={() => setIsOpen(false)}
                            className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                            <LogOut size={15} />
                            <span>Cerrar sesión</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}