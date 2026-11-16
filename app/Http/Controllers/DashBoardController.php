<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Estado;
use App\Models\Repuesto;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public static function getDashboardData(): array
    {
        // 1. KPIs Principales
        $sinAsignar = Equipo::whereNull('user_id')
            ->orWhere('estado_id', 1)
            ->count();

        $reparacionCompleta = Equipo::where('estado_id', 5)->count();

        $enTaller = Equipo::whereNotIn('estado_id', [6, 7])->count();

        // Repuestos con menos de 3 unidades de stock
        $repuestosCriticos = Repuesto::where('stock', '<', 3)
            ->orderBy('stock', 'asc')
            ->get(['id', 'nombre', 'stock', 'precio_unitario'])
            ->map(fn($rep) => [
                'id'     => $rep->id,
                'nombre' => $rep->nombre,
                'stock'  => $rep->stock,
                'costo'  => (float) $rep->precio_unitario,
                'activo' => $rep->stock > 0,
            ]);

        // 2. Gráfico 1: Distribución por Estado (excluyendo Cancelados id 6 y Retirados id 7)
        $totalHistorico = Equipo::count();
        $estados = Estado::whereNotIn('id', [6, 7])->withCount('equipos')->orderBy('id')->get();
        $totalEnCurso = max($estados->sum('equipos_count'), 1);

        $distribucionEstados = $estados->map(function ($estado) use ($totalEnCurso) {
            $montoEstado = Equipo::where('estado_id', $estado->id)
                ->with('presupuesto')
                ->get()
                ->sum(fn($e) => (float) ($e->presupuesto?->monto ?? 0));

            return [
                'id'         => $estado->id,
                'nombre'     => strtoupper($estado->nombre),
                'color'      => $estado->color,
                'cantidad'   => $estado->equipos_count,
                'porcentaje' => round(($estado->equipos_count / $totalEnCurso) * 100, 1),
                'monto'      => $montoEstado,
            ];
        })->values();

        // 3. Gráfico 2: Curva de los últimos 6 meses
        $curvaMensual = collect(range(5, 0))->map(function ($mesesAtras) {
            $fecha = Carbon::now()->subMonths($mesesAtras);
            $inicio = $fecha->copy()->startOfMonth();
            $fin = $fecha->copy()->endOfMonth();

            $retirados = Equipo::where('estado_id', 7)
                ->whereBetween('updated_at', [$inicio, $fin])
                ->count();

            $cancelados = Equipo::where('estado_id', 6)
                ->whereBetween('updated_at', [$inicio, $fin])
                ->count();

            return [
                'mes'        => strtoupper($fecha->translatedFormat('M \'y')),
                'retirados'  => $retirados,
                'cancelados' => $cancelados,
                'total'      => $retirados + $cancelados,
            ];
        })->values();

        return [
            'kpis' => [
                'sinAsignar'         => $sinAsignar,
                'reparacionCompleta' => $reparacionCompleta,
                'enTaller'           => $enTaller,
                'stockCriticoCount'  => $repuestosCriticos->count(),
                'totalHistorico'     => $totalHistorico,
            ],
            'distribucionEstados' => $distribucionEstados,
            'curvaMensual'        => $curvaMensual,
            'repuestosCriticos'   => $repuestosCriticos,
        ];
    }

    public function index()
    {
        return Inertia::render('Dashboard/Index', self::getDashboardData());
    }
}
