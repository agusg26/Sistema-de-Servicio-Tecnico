
import { Link, usePage } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/Components/ui/chart';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    XAxis,
    YAxis,
} from 'recharts';
import {
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    PackageOpen,
    PackageX,
} from 'lucide-react';

interface EstadoItem {
    id: number;
    nombre: string;
    color?: string;
    cantidad: number;
    porcentaje: number;
    monto: number;
}

interface MesItem {
    mes: string;
    retirados: number;
    cancelados: number;
    total: number;
}

interface RepuestoCritico {
    id: number;
    nombre: string;
    stock: number;
    costo: number;
    activo: boolean;
}

interface Props {
    kpis?: {
        sinAsignar: number;
        reparacionCompleta: number;
        enTaller: number;
        stockCriticoCount: number;
        totalHistorico: number;
    };
    distribucionEstados?: EstadoItem[];
    curvaMensual?: MesItem[];
    repuestosCriticos?: RepuestoCritico[];
}

const chartConfig = {
    retirados: {
        label: 'Retirados',
        color: '#a3e635',
    },
    cancelados: {
        label: 'Cancelados',
        color: '#52525b',
    },
} satisfies ChartConfig;

export default function DashboardIndex(props: Props) {
    const pageProps = usePage().props as unknown as Props;

    const kpis = props.kpis ?? pageProps.kpis ?? {
        sinAsignar: 0,
        reparacionCompleta: 0,
        enTaller: 0,
        stockCriticoCount: 0,
        totalHistorico: 0,
    };

    const rawDistribucionEstados =
        props.distribucionEstados ?? pageProps.distribucionEstados ?? [];

    const estadosSinCerrados = rawDistribucionEstados.filter(
        (item) => Number(item.id) !== 6 && Number(item.id) !== 7
    );

    const totalEquiposGrafico = estadosSinCerrados.reduce(
        (acc, item) => acc + item.cantidad,
        0
    );

    const distribucionEstados = estadosSinCerrados.map((item) => ({
        ...item,
        porcentaje:
            totalEquiposGrafico > 0
                ? Number(((item.cantidad / totalEquiposGrafico) * 100).toFixed(1))
                : 0,
    }));

    const curvaMensual =
        props.curvaMensual ?? pageProps.curvaMensual ?? [];

    const repuestosCriticos =
        props.repuestosCriticos ?? pageProps.repuestosCriticos ?? [];

    return (
        <div className="min-h-screen bg-[#070707] text-white">
            <div className="mx-auto max-w-[1600px] space-y-10">

                {/* ENCABEZADO */}
                <section className="border-b border-[#292929] pb-6">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div>
                            {/* <p className="text-[11px] font-black uppercase tracking-[0.25em] text-lime-400">
                                PANEL DE CONTROL
                            </p>*/}

                            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-white">
                                Resumen operativo
                            </h1>
                        </div>
                    </div>
                </section>

                {/* INDICADORES PRINCIPALES */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                            Indicadores generales
                        </h2>

                        <span className="text-xs font-medium text-gray-600">
                            {kpis.totalHistorico} equipos registrados
                        </span>
                    </div>

                    <div className="grid grid-cols-1 border border-[#292929] bg-[#0b0b0b] sm:grid-cols-2 xl:grid-cols-4">

                        {/* SIN ASIGNAR */}
                        <div className="group border-b border-[#292929] p-5 transition hover:bg-[#101010] sm:border-r xl:border-b-0">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    Sin asignar
                                </span>
                                <Clock className="h-4 w-4 text-gray-500 transition group-hover:text-lime-400" />
                            </div>

                            <div className="mt-3 text-4xl font-black tracking-tight text-white">
                                {kpis.sinAsignar}
                            </div>

                            <p className="mt-2 text-xs text-gray-600">
                                Pendientes de asignación
                            </p>
                        </div>

                        {/* LISTOS PARA RETIRO */}
                        <div className="group border-b border-[#292929] p-5 transition hover:bg-[#101010] xl:border-b-0 xl:border-r">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    Listos para retiro
                                </span>
                                <CheckCircle2 className="h-4 w-4 text-lime-400" />
                            </div>

                            <div className="mt-3 text-4xl font-black tracking-tight text-lime-400">
                                {kpis.reparacionCompleta}
                            </div>

                            <p className="mt-2 text-xs text-gray-600">
                                Reparaciones completas
                            </p>
                        </div>

                        {/* EN TALLER */}
                        <div className="group border-b border-[#292929] p-5 transition hover:bg-[#101010] sm:border-r sm:border-b-0 xl:border-r">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    En taller
                                </span>
                                <PackageOpen className="h-4 w-4 text-gray-500 transition group-hover:text-lime-400" />
                            </div>

                            <div className="mt-3 text-4xl font-black tracking-tight text-white">
                                {kpis.enTaller}
                            </div>

                            <p className="mt-2 text-xs text-gray-600">
                                Órdenes en curso
                            </p>
                        </div>

                        {/* STOCK CRÍTICO */}
                        <div className="group p-5 transition hover:bg-[#101010]">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    Stock crítico
                                </span>
                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                            </div>

                            <div className="mt-3 text-4xl font-black tracking-tight text-amber-400">
                                {kpis.stockCriticoCount}
                            </div>

                            <p className="mt-2 text-xs text-gray-600">
                                Repuestos con menos de 3 unidades
                            </p>
                        </div>
                    </div>
                </section>

                {/* DISTRIBUCIÓN DE ESTADOS (GRÁFICO DE TORTA) */}
                <section className="space-y-4">
                    <div>
                        <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
                            Distribucion por Estados
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Proporción de equipos en cada etapa sobre el total registrado.
                        </p>
                    </div>

                    <Card className="overflow-hidden rounded-none border-[#292929] bg-[#0b0b0b] text-white shadow-none">
                        <CardContent className="p-6">
                            {distribucionEstados.length === 0 ? (
                                <div className="py-12 text-center text-sm text-gray-500">
                                    No hay información disponible para mostrar.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                                    {/* GRÁFICO DE TORTA */}
                                    <div className="lg:col-span-5">
                                        <ChartContainer
                                            config={Object.fromEntries(
                                                distribucionEstados.map((item) => [
                                                    `estado_${item.id}`,
                                                    {
                                                        label: item.nombre,
                                                        color: item.color || '#a3e635',
                                                    },
                                                ])
                                            )}
                                            className="mx-auto aspect-square max-h-[320px] w-full"
                                        >
                                            <PieChart>
                                                <ChartTooltip
                                                    content={
                                                        <ChartTooltipContent
                                                            nameKey="nombre"
                                                            className="border-[#292929] bg-[#121212] text-white"
                                                        />
                                                    }
                                                />
                                                <Pie
                                                    data={distribucionEstados}
                                                    dataKey="cantidad"
                                                    nameKey="nombre"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={65}
                                                    outerRadius={120}
                                                    paddingAngle={2}
                                                    stroke="#0b0b0b"
                                                    strokeWidth={2}
                                                >
                                                    {distribucionEstados.map((item) => (
                                                        <Cell
                                                            key={item.id}
                                                            fill={item.color || '#a3e635'}
                                                        />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ChartContainer>
                                    </div>

                                    {/* DETALLE Y LEYENDA CON COLORES DE CADA ESTADO */}
                                    <div className="divide-y divide-[#202020] border border-[#202020] bg-[#090909] lg:col-span-7">
                                        {distribucionEstados.map((item) => {
                                            const itemColor = item.color || '#a3e635';

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-[#111111]"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className="h-3.5 w-3.5 shrink-0 rounded-full"
                                                            style={{
                                                                backgroundColor: itemColor,
                                                            }}
                                                        />
                                                        <span
                                                            className="text-xs font-black uppercase tracking-wider"
                                                            style={{ color: itemColor }}
                                                        >
                                                            {item.nombre}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-8">
                                                        <div className="text-right">
                                                            <span className="text-base font-black text-white">
                                                                {item.cantidad}
                                                            </span>
                                                            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                                equipos
                                                            </span>
                                                        </div>

                                                        <div className="w-14 text-right">
                                                            <span
                                                                className="text-sm font-black"
                                                                style={{ color: itemColor }}
                                                            >
                                                                {item.porcentaje}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* TOTAL */}
                                        <div className="flex items-center justify-between gap-4 bg-[#101010] px-5 py-4">
                                            <span className="text-xs font-black uppercase tracking-wider text-lime-400">
                                                Total en taller
                                            </span>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <span className="text-lg font-black text-white">
                                                        {totalEquiposGrafico}
                                                    </span>
                                                    <span className="ml-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                        equipos
                                                    </span>
                                                </div>

                                                <div className="w-14 text-right">
                                                    <span className="text-sm font-black text-lime-400">
                                                        100%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* GRÁFICO MENSUAL + STOCK CRÍTICO */}
                <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">

                    {/* GRÁFICO MENSUAL */}
                    <div className="space-y-4 xl:col-span-7">
                        <div>

                            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
                                BALANCE POR MES
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Equipos retirados y cancelados en los últimos 6 meses.
                            </p>
                        </div>

                        <Card className="rounded-none border-[#292929] bg-[#0b0b0b] text-white shadow-none">
                            <CardHeader className="border-b border-[#202020] pb-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <CardTitle className="text-sm font-bold text-gray-200">
                                        Retirados + Cancelados por mes
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                {curvaMensual.length === 0 ? (
                                    <div className="flex h-[290px] items-center justify-center text-sm text-gray-500">
                                        No hay datos mensuales disponibles.
                                    </div>
                                ) : (
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-[290px] w-full"
                                    >
                                        <BarChart
                                            data={curvaMensual}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                vertical={false}
                                                stroke="#202020"
                                            />

                                            <XAxis
                                                dataKey="mes"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{
                                                    fill: '#71717a',
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                }}
                                            />

                                            <YAxis
                                                allowDecimals={false}
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{
                                                    fill: '#71717a',
                                                    fontSize: 11,
                                                }}
                                            />

                                            <ChartTooltip
                                                cursor={{
                                                    fill: 'rgba(255,255,255,0.03)',
                                                }}
                                                content={
                                                    <ChartTooltipContent className="border-[#292929] bg-[#121212] text-white" />
                                                }
                                            />

                                            <Bar
                                                dataKey="retirados"
                                                stackId="a"
                                                fill="var(--color-retirados)"
                                                radius={[0, 0, 0, 0]}
                                            />

                                            <Bar
                                                dataKey="cancelados"
                                                stackId="a"
                                                fill="var(--color-cancelados)"
                                                radius={[3, 3, 0, 0]}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                )}

                                {/* LEYENDA */}
                                <div className="mt-4 flex items-center gap-6 border-t border-[#202020] pt-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-lime-400" />
                                        <span>Retirados</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-zinc-600" />
                                        <span>Cancelados</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* STOCK CRÍTICO */}
                    <div className="space-y-4 xl:col-span-5">
                        <div>

                            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
                                INVENTARIO
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Repuestos con menos de 3 unidades disponibles.
                            </p>
                        </div>

                        <Card className="rounded-none border-[#292929] bg-[#0b0b0b] text-white shadow-none">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-[#202020] pb-4">
                                <CardTitle className="text-sm font-bold text-gray-200">
                                    Repuestos a revisar
                                </CardTitle>

                                <Link
                                    href="/repuestos"
                                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-lime-400 transition hover:text-lime-300"
                                >
                                    Ver inventario
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </CardHeader>

                            <CardContent className="p-0">
                                {repuestosCriticos.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <CheckCircle2 className="h-9 w-9 text-lime-400/70" />

                                        <p className="mt-3 text-xs font-black uppercase tracking-wider text-gray-300">
                                            Inventario óptimo
                                        </p>

                                        <p className="mt-1 text-xs text-gray-600">
                                            No hay repuestos con menos de 3 unidades.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#202020]">
                                        {repuestosCriticos.map((rep) => {
                                            const agotado = rep.stock === 0;

                                            return (
                                                <div
                                                    key={rep.id}
                                                    className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[#111111]"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div
                                                            className={`flex h-10 w-10 shrink-0 items-center justify-center border ${agotado
                                                                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                                                : 'border-amber-400/30 bg-amber-400/10 text-amber-400'
                                                                }`}
                                                        >
                                                            <PackageX className="h-4 w-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-black uppercase tracking-wide text-gray-200">
                                                                {rep.nombre}
                                                            </p>

                                                            <p className="mt-1 text-[11px] text-gray-600">
                                                                Costo unitario: ${Number(rep.costo).toLocaleString('es-AR')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0 text-right">
                                                        <span
                                                            className={`inline-block border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${agotado
                                                                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                                                : 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                                                                }`}
                                                        >
                                                            {rep.stock} {rep.stock === 1 ? 'UNIDAD' : 'UNIDADES'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

            </div>
        </div>
    );
}
