
import {
    Wrench,
    Monitor,
    Boxes,
    BarChart3,
    Bell,
    UserCircle,
    UserGroup,
    Menu,
    X,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import UserAccountMenu from "@/Layouts/UserAccountMenu";

interface MenuItem {
    name: string;
    icon: React.ElementType;
    link: string;
    rolesPermitidos?: string[];
}

const menuItems: MenuItem[] = [
    {
        name: "EQUIPOS",
        icon: Monitor,
        link: "/equipos",
    },
    {
        name: "CLIENTES",
        icon: UserGroup,
        link: "/clientes",
    },
    {
        name: "REPUESTOS",
        icon: Boxes,
        link: "/repuestos",
    },
    {
        name: "REPORTES",
        icon: BarChart3,
        link: "/reportes",
        rolesPermitidos: ["admin", "super admin"],
    },
    {
        name: "EMPLEADOS",
        icon: UserCircle,
        link: "/empleados",
        rolesPermitidos: ["admin", "super admin"],
    },
];

export default function Navbar() {
    const { url, props } = usePage<any>();
    const currentUser = props.auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const hasRole = (...rolesPermitidos: string[]) => {
        if (!currentUser) return false;

        if (Array.isArray(currentUser.roles)) {
            const rolesLower = currentUser.roles.map((r: any) =>
                (typeof r === "string" ? r : r.name || "").toLowerCase()
            );

            return rolesPermitidos.some((rol) =>
                rolesLower.includes(rol.toLowerCase())
            );
        }

        if (typeof currentUser.role === "string") {
            return rolesPermitidos.some(
                (rol) => rol.toLowerCase() === currentUser.role?.toLowerCase()
            );
        }

        return false;
    };

    const visibleMenuItems = menuItems.filter((item) => {
        if (!item.rolesPermitidos) return true;
        return hasRole(...item.rolesPermitidos);
    });

    return (
        <header className="border-b border-[#292929] bg-[#0c0c0c]">
            <div className="flex min-h-16 items-center justify-between">

                {/* LOGO */}
                <div className="flex min-w-0 flex-1 items-center gap-3 px-4 sm:px-6 xl:h-16 xl:w-[290px] xl:flex-none xl:border-r xl:border-[#292929]">
                    <Wrench
                        size={26}
                        strokeWidth={2.5}
                        className="shrink-0 text-lime-400"
                    />

                    <h1 className="whitespace-nowrap text-lg font-black tracking-tight text-white sm:text-xl">
                        SERVICIO
                        <span className="text-lime-400"> TÉCNICO</span>
                    </h1>
                </div>

                {/* NAVEGACIÓN ESCRITORIO */}
                <nav className="hidden h-16 min-w-0 flex-1 items-center justify-center xl:flex">
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url.startsWith(item.link);

                        return (
                            <Link
                                key={item.name}
                                href={item.link}
                                className={`
                                    flex h-full shrink items-center justify-center gap-2
                                    whitespace-nowrap border-r border-[#292929]
                                    px-3 text-[11px] font-black tracking-wider
                                    transition cursor-pointer
                                    ${isActive
                                        ? "border-b-2 border-b-lime-400 bg-[#151515]/50 text-lime-400"
                                        : "text-gray-400 hover:bg-[#151515] hover:text-white"
                                    }
                                `}
                            >
                                <Icon size={17} className="shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* ACCIONES DERECHA */}
                <div className="flex h-16 shrink-0 items-center gap-3 px-3 sm:gap-5 sm:px-5">
                    <Bell
                        size={20}
                        className="cursor-pointer text-gray-400 transition hover:text-white"
                    />

                    <UserAccountMenu />

                    {/* BOTÓN MENÚ MÓVIL Y TABLET */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center border border-[#292929] bg-[#111111] text-gray-300 transition hover:border-lime-400 hover:text-lime-400 xl:hidden"
                        aria-label="Abrir menú de navegación"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* MENÚ DESPLEGABLE MÓVIL / TABLET */}
            {mobileMenuOpen && (
                <nav className="border-t border-[#292929] bg-[#0a0a0a] xl:hidden">
                    <div className="flex flex-col divide-y divide-[#1c1c1c]">
                        {visibleMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = url.startsWith(item.link);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.link}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-6 py-4
                                        text-xs font-black tracking-widest transition
                                        ${isActive
                                            ? "border-l-4 border-l-lime-400 bg-[#151515]/70 text-lime-400"
                                            : "text-gray-400 hover:bg-[#141414] hover:text-white"
                                        }
                                    `}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </header>
    );
}
