<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Estado;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use App\Exports\EquiposPeriodoExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportesController extends Controller
{
    const ESTADO_CANCELADO = 6;
    const ESTADO_RETIRADO  = 7;

    public function index()
    {
        return Inertia::render('Reportes/Index');
    }

    public function generarPdf(Request $request)
    {
        $request->validate([
            'fecha_desde'   => 'required|date',
            'fecha_hasta'   => 'required|date|after_or_equal:fecha_desde',
            'filtro_estado' => 'nullable|in:todos,retirados,cancelados',
        ]);

        $desde = Carbon::parse($request->fecha_desde)->startOfDay();
        $hasta = Carbon::parse($request->fecha_hasta)->endOfDay();

        $estadosIds = match ($request->input('filtro_estado', 'todos')) {
            'retirados'  => [self::ESTADO_RETIRADO],
            'cancelados' => [self::ESTADO_CANCELADO],
            default      => [self::ESTADO_CANCELADO, self::ESTADO_RETIRADO],
        };

        $equipos = Equipo::with(['cliente', 'estado', 'tecnico', 'presupuesto'])
            ->whereIn('estado_id', $estadosIds)
            ->whereBetween('updated_at', [$desde, $hasta])
            ->orderBy('updated_at', 'desc')
            ->get();

        $equiposRetirados  = $equipos->where('estado_id', self::ESTADO_RETIRADO);
        $equiposCancelados = $equipos->where('estado_id', self::ESTADO_CANCELADO);

        $totalFacturado = $equiposRetirados->sum(fn($e) => (float) ($e->presupuesto?->monto ?? 0));

        $pdf = Pdf::loadView('pdf.reporte_periodo', [
            'equipos'            => $equipos,
            'desde'              => $desde,
            'hasta'              => $hasta,
            'totalEquipos'       => $equipos->count(),
            'cantidadRetirados'  => $equiposRetirados->count(),
            'cantidadCancelados' => $equiposCancelados->count(),
            'totalFacturado'     => $totalFacturado,
        ])->setPaper('a4', 'landscape');

        return $pdf->stream("reporte-taller-{$request->fecha_desde}-al-{$request->fecha_hasta}.pdf");
    }

    public function generarExcel(Request $request)
    {
        $request->validate([
            'fecha_desde'   => 'required|date',
            'fecha_hasta'   => 'required|date|after_or_equal:fecha_desde',
            'filtro_estado' => 'nullable|in:todos,retirados,cancelados',
        ]);

        $nombreArchivo = "reporte-taller-{$request->fecha_desde}-al-{$request->fecha_hasta}.xlsx";

        return Excel::download(
            new EquiposPeriodoExport(
                $request->fecha_desde,
                $request->fecha_hasta,
                $request->input('filtro_estado', 'todos')
            ),
            $nombreArchivo
        );
    }
}
