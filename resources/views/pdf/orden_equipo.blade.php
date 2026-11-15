<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Orden de Servicio #{{ $equipo->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #1a1a1a;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }

        .header-table {
            width: 100%;
            border-bottom: 2px solid #a3e635;
            padding-bottom: 12px;
            margin-bottom: 18px;
        }

        .logo-title {
            font-size: 20px;
            font-weight: bold;
            color: #0d0d0d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .subtitle {
            font-size: 11px;
            color: #666;
            margin-top: 3px;
        }

        .order-badge {
            text-align: right;
            font-size: 14px;
            font-weight: bold;
            color: #15803d;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #f3f4f6;
            padding: 6px 8px;
            margin-top: 15px;
            margin-bottom: 8px;
            border-left: 3px solid #0d0d0d;
        }

        .data-table {
            width: 100%;
            margin-bottom: 10px;
        }

        .data-table td {
            padding: 4px 6px;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
            color: #4b5563;
            width: 25%;
        }

        .tasks-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        .tasks-table th,
        .tasks-table td {
            border: 1px solid #e5e7eb;
            padding: 7px 9px;
            text-align: left;
        }

        .tasks-table th {
            background-color: #f9fafb;
            font-size: 11px;
            text-transform: uppercase;
            color: #374151;
        }

        .total-box {
            margin-top: 15px;
            text-align: right;
        }

        .total-amount {
            font-size: 16px;
            font-weight: bold;
            color: #15803d;
        }

        .terms {
            margin-top: 25px;
            font-size: 9px;
            color: #6b7280;
            line-height: 1.4;
            border-top: 1px dashed #d1d5db;
            padding-top: 8px;
        }
    </style>
</head>

<body>

    <!-- Cabecera -->
    <table class="header-table">
        <tr>
            <td>
                <div class="logo-title">Taller de Servicio Técnico</div>
                <div class="subtitle">Comprobante de Ingreso y Ficha Técnica</div>
            </td>
            <td class="order-badge">
                ORDEN #{{ str_pad($equipo->id, 5, '0', STR_PAD_LEFT) }}<br>
                <span style="font-size: 10px; font-weight: normal; color: #666;">
                    Fecha: {{ $equipo->created_at ? $equipo->created_at->format('d/m/Y H:i') : now()->format('d/m/Y') }}
                </span>
            </td>
        </tr>
    </table>

    <!-- Cliente y Equipo -->
    <div class="section-title">Información General</div>
    <table class="data-table">
        <tr>
            <td class="label">Cliente:</td>
            <td>{{ $equipo->cliente?->nombre }} {{ $equipo->cliente?->apellido }}</td>
            <td class="label">DNI / CUIT:</td>
            <td>{{ $equipo->cliente?->dni ?? 'Sin registrar' }}</td>
        </tr>
        <tr>
            <td class="label">Teléfono:</td>
            <td>{{ $equipo->cliente?->telefono ?? 'Sin registrar' }}</td>
            <td class="label">Email:</td>
            <td>{{ $equipo->cliente?->email ?? 'Sin registrar' }}</td>
        </tr>
        <tr>
            <td class="label">Equipo / Modelo:</td>
            <td><strong>{{ $equipo->nombre }}</strong></td>
            <td class="label">Estado Actual:</td>
            <td>{{ $equipo->estado?->nombre ?? 'En Diagnóstico' }}</td>
        </tr>
        <tr>
            <td class="label">Técnico Asignado:</td>
            <td>{{ $equipo->tecnico?->name ?? 'A designar' }}</td>
            <td class="label">Observaciones:</td>
            <td>{{ $equipo->observaciones ?? 'Sin observaciones iniciales.' }}</td>
        </tr>
    </table>

    <!-- Trabajos / Reparaciones -->
    <div class="section-title">Detalle de Diagnóstico y Reparaciones</div>
    <table class="tasks-table">
        <thead>
            <tr>
                <th>Tarea / Concepto</th>
                <th>Repuesto Asignado</th>
                <th style="text-align: right; width: 120px;">Costo</th>
            </tr>
        </thead>
        <tbody>
            @php
            $tareasActivas = $equipo->reparaciones->where('presupuesto_aprobado', '!=', false);
            @endphp
            @forelse($tareasActivas as $rep)
            <tr>
                <td>
                    <strong>{{ $rep->titulo }}</strong>
                    @if($rep->descripcion)
                    <br><span style="font-size: 10px; color: #666;">{{ $rep->descripcion }}</span>
                    @endif
                </td>
                <td>{{ $rep->repuesto?->nombre ?? 'Mano de obra / Servicio' }}</td>
                <td style="text-align: right;">${{ number_format($rep->costo, 2, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="3" style="text-align: center; color: #888; padding: 12px;">
                    No hay tareas presupuestadas registradas al momento.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="total-box">
        <span>TOTAL PRESUPUESTADO: </span>
        <span class="total-amount">${{ number_format($equipo->presupuesto?->monto ?? 0, 2, ',', '.') }}</span>
    </div>

    <div class="terms">
        <strong>Términos del Servicio:</strong> Los presupuestos tienen validez por 15 días corridos. Pasados los 60 días de notificada la finalización del servicio técnico, el equipo podrá devengar costos por depósito y custodia.
    </div>

</body>

</html>