<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reporte de Equipos Retirados y Cancelados</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
        }

        .header {
            width: 100%;
            border-bottom: 2px solid #a3e635;
            padding-bottom: 10px;
            margin-bottom: 14px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .subtitle {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
        }

        .kpi-table {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }

        .kpi-table td {
            width: 25%;
            padding-right: 8px;
        }

        .kpi-table td:last-child {
            padding-right: 0;
        }

        .kpi-card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 8px 10px;
        }

        .kpi-label {
            font-size: 8.5px;
            color: #6b7280;
            font-weight: bold;
            text-transform: uppercase;
        }

        .kpi-value {
            font-size: 15px;
            font-weight: bold;
            color: #111;
            margin-top: 3px;
        }

        .report-table {
            width: 100%;
            border-collapse: collapse;
        }

        .report-table th,
        .report-table td {
            border: 1px solid #e5e7eb;
            padding: 6px 8px;
            text-align: left;
        }

        .report-table th {
            background-color: #0d0d0d;
            color: #ffffff;
            font-size: 9px;
            text-transform: uppercase;
        }

        .amount {
            text-align: right;
            font-family: monospace;
            font-weight: bold;
        }

        .badge-retirado {
            color: #15803d;
            font-weight: bold;
        }

        .badge-cancelado {
            color: #b91c1c;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <table class="header">
        <tr>
            <td>
                <div class="title">Balance de Equipos Retirados y Cancelados</div>
                <div class="subtitle">Período evaluado: {{ $desde->format('d/m/Y') }} al {{ $hasta->format('d/m/Y') }}</div>
            </td>
            <td style="text-align: right; font-size: 9px; color: #666;">
                Emitido: {{ now()->format('d/m/Y H:i') }}
            </td>
        </tr>
    </table>

    <!-- Resumen de KPIs -->
    <table class="kpi-table">
        <tr>
            <td>
                <div class="kpi-card">
                    <div class="kpi-label">Total Movimientos</div>
                    <div class="kpi-value">{{ $totalEquipos }}</div>
                </div>
            </td>
            <td>
                <div class="kpi-card">
                    <div class="kpi-label">Equipos Retirados</div>
                    <div class="kpi-value" style="color: #15803d;">{{ $cantidadRetirados }}</div>
                </div>
            </td>
            <td>
                <div class="kpi-card">
                    <div class="kpi-label">Equipos Cancelados</div>
                    <div class="kpi-value" style="color: #b91c1c;">{{ $cantidadCancelados }}</div>
                </div>
            </td>
            <td>
                <div class="kpi-card">
                    <div class="kpi-label">Importe Total (Retirados)</div>
                    <div class="kpi-value" style="color: #15803d;">${{ number_format($totalFacturado, 2, ',', '.') }}</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Listado -->
    <table class="report-table">
        <thead>
            <tr>
                <th style="width: 45px;">#Orden</th>
                <th style="width: 75px;">Fecha Cierre</th>
                <th>Equipo / Modelo</th>
                <th>Cliente</th>
                <th style="width: 95px;">Estado Final</th>
                <th style="width: 115px;">Técnico</th>
                <th style="width: 85px; text-align: right;">Monto</th>
            </tr>
        </thead>
        <tbody>
            @forelse($equipos as $item)
            @php
            $esRetirado = (int) $item->estado_id === 7;
            @endphp
            <tr>
                <td>#{{ $item->id }}</td>
                <td>{{ $item->updated_at?->format('d/m/Y') }}</td>
                <td><strong>{{ $item->nombre }}</strong></td>
                <td>{{ $item->cliente?->nombre }} {{ $item->cliente?->apellido }}</td>
                <td class="{{ $esRetirado ? 'badge-retirado' : 'badge-cancelado' }}">
                    {{ strtoupper($item->estado?->nombre) }}
                </td>
                <td>{{ $item->tecnico?->name ?? 'Sin asignar' }}</td>
                <td class="amount">
                    @if($esRetirado)
                    ${{ number_format($item->presupuesto?->monto ?? 0, 2, ',', '.') }}
                    @else
                    <span style="color: #9ca3af;">$0,00</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center; color: #888; padding: 14px;">
                    No se encontraron equipos retirados ni cancelados en el período seleccionado.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>

</html>