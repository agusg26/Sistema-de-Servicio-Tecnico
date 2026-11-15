import { useState, type FormEvent } from 'react';
import { Head } from '@inertiajs/react';
import { MainLayout } from '@/Layouts/MainLayout';
import { FileSpreadsheet, FileText, Calendar, Filter } from 'lucide-react';

export default function ReportesIndex() {
    const hoy = new Date().toISOString().split('T')[0];
    const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0];

    const [fechaDesde, setFechaDesde] = useState(primerDiaMes);
    const [fechaHasta, setFechaHasta] = useState(hoy);
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'retirados' | 'cancelados'>('todos');
    const [errorFecha, setErrorFecha] = useState('');

    const aplicarRangoRapido = (diasAtras: number | 'mes') => {
        setErrorFecha('');
        const fin = new Date();
        let inicio = new Date();

        if (diasAtras === 'mes') {
            inicio = new Date(fin.getFullYear(), fin.getMonth(), 1);
        } else {
            inicio.setDate(fin.getDate() - diasAtras);
        }

        setFechaDesde(inicio.toISOString().split('T')[0]);
        setFechaHasta(fin.toISOString().split('T')[0]);
    };

    const exportarReporte = (formato: 'pdf' | 'excel') => {
        if (!fechaDesde || !fechaHasta) {
            setErrorFecha('Debes seleccionar ambas fechas.');
            return;
        }

        if (fechaHasta < fechaDesde) {
            setErrorFecha('La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
            return;
        }

        setErrorFecha('');

        const params = new URLSearchParams({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            filtro_estado: filtroEstado,
        });

        const endpoint = formato === 'pdf' ? '/reportes/equipos-pdf' : '/reportes/equipos-excel';
        window.open(`${endpoint}?${params.toString()}`, '_blank');
    };

    return (
        <MainLayout>
            <Head title="Reportes" />

            <div className="min-h-screen bg-[#070707] px-6 py-8 text-white">
                <div className="mx-auto max-w-4xl">
                    {/* ENCABEZADO */}
                    <div className="mb-7">
                        <h1 className="text-3xl font-black tracking-tight text-white">
                            REPORTE DE EQUIPOS
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Generá informes en PDF de los equipos retirados y cancelados dentro de un rango de fechas.
                        </p>
                    </div>

                    {/* TARJETA DE CONFIGURACIÓN DEL REPORTE */}
                    <form
                        className="overflow-hidden border border-[#292929] bg-[#0d0d0d]"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] px-7 py-5">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h2 className="text-sm font-black tracking-[0.18em] text-gray-200">
                                        FILTRO
                                    </h2>
                                    <p className="mt-0.5 text-xs text-gray-600">
                                        Filtrado por fecha de retiro o cancelación
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-6 p-7 md:grid-cols-3">
                            {/* Fecha Desde */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-xs font-black tracking-wider text-gray-500">
                                    <Calendar className="h-3.5 w-3.5 text-lime-400" />
                                    FECHA DESDE
                                </label>
                                <input
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                    className="h-12 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-lime-400 [color-scheme:dark]"
                                />
                            </div>

                            {/* Fecha Hasta */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-xs font-black tracking-wider text-gray-500">
                                    <Calendar className="h-3.5 w-3.5 text-lime-400" />
                                    FECHA HASTA
                                </label>
                                <input
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                    className="h-12 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-lime-400 [color-scheme:dark]"
                                />
                            </div>

                            {/* Tipo de cierre */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-xs font-black tracking-wider text-gray-500">
                                    <Filter className="h-3.5 w-3.5 text-lime-400" />
                                    ESTADO DE CIERRE
                                </label>
                                <select
                                    value={filtroEstado}
                                    onChange={(e) =>
                                        setFiltroEstado(e.target.value as 'todos' | 'retirados' | 'cancelados')
                                    }
                                    className="h-12 w-full border border-[#292929] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-lime-400"
                                >
                                    <option value="todos">RETIRADOS Y CANCELADOS</option>
                                    <option value="retirados">SOLO RETIRADOS</option>
                                    <option value="cancelados">SOLO CANCELADOS</option>
                                </select>
                            </div>
                        </div>

                        {errorFecha && (
                            <div className="px-7 pb-4">
                                <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                    {errorFecha}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#292929] bg-[#0a0a0a] px-7 py-5">
                            <button
                                type="button"
                                onClick={() => exportarReporte('excel')}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-lime-400 bg-[#0d0d0d] px-6 text-xs font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black cursor-pointer"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                EXPORTAR EXCEL (.XLSX)
                            </button>

                            <button
                                type="button"
                                onClick={() => exportarReporte('pdf')}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-lime-400 bg-[#0d0d0d] px-6 text-xs font-black tracking-wider text-lime-400 transition hover:bg-lime-400 hover:text-black cursor-pointer"
                            >
                                <FileText className="h-4 w-4" />
                                GENERAR REPORTE PDF
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}