import {
    Wrench,
    Package,
    Boxes,
    BarChart3,
    Bell,
    UserCircle,
} from "lucide-react";

const menuItems = [
    {
        name: "EQUIPOS",
        icon: Package,
        active: true,
    },
    {
        name: "CLIENTES",
        icon: Boxes,
    },
    {
        name: "REPUESTOS",
        icon: Package,
    },
    {
        name: "REPORTES",
        icon: BarChart3,
    },
];

export default function Navbar() {
    return (
        <header className="border border-[#292929] bg-[#0c0c0c]">
            <div className="flex h-16 items-center">


                <div className="flex h-full w-[380px] items-center gap-4 border-r border-[#292929] px-6">
                    <Wrench
                        size={30}
                        strokeWidth={2.5}
                        className="text-lime-400"
                    />

                    <h1 className="text-2xl font-black tracking-tight text-white">
                        SERVICIO
                        <span className="text-lime-400"> TÉCNICO</span>
                    </h1>
                </div>

                <nav className="flex h-full flex-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.name}
                                className={`
                  flex h-full items-center gap-3 border-r border-[#292929]
                  px-7 text-sm font-black tracking-wider transition
                  ${item.active
                                        ? "border-b-2 border-lime-400 text-lime-400"
                                        : "text-gray-400 hover:bg-[#151515] hover:text-white"
                                    }
                `}
                            >
                                <Icon size={20} />
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                <div className="flex h-full items-center gap-5 px-5">
                    <Bell
                        size={20}
                        className="text-gray-400 hover:text-white"
                    />

                    <UserCircle
                        size={27}
                        className="text-gray-300"
                    />

                    <span className="text-gray-400">⌄</span>
                </div>
            </div>
        </header>
    );
}