<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Presupuesto de Reparación</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f7;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .card {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header {
            background-color: #0d0d0d;
            color: #ffffff;
            padding: 24px;
            text-align: center;
            border-bottom: 3px solid #a3e635;
        }

        .content {
            padding: 24px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            margin-bottom: 20px;
        }

        .table th,
        .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }

        .table th {
            background-color: #f9fafb;
            font-weight: 700;
            color: #4b5563;
        }

        .total-box {
            background-color: #f7fee7;
            border: 1px solid #d9f99d;
            border-radius: 6px;
            padding: 16px;
            text-align: right;
            margin-top: 12px;
        }

        .total-title {
            font-size: 14px;
            font-weight: 600;
            color: #365314;
        }

        .total-amount {
            font-size: 22px;
            font-weight: 800;
            color: #15803d;
            font-family: monospace;
        }

        .footer {
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .note {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 12px;
            font-size: 13px;
            color: #1e40af;
            margin-top: 20px;
            border-radius: 4px;
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="header">
            <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Presupuesto de Servicio Técnico</h1>
        </div>

        <div class="content">
            <p>Hola <strong>{{ $equipo->cliente->nombre }} {{ $equipo->cliente->apellido }}</strong>,</p>
            <p>Hemos finalizado la revisión técnica de tu equipo <strong>#{{ $equipo->id }} - {{ $equipo->nombre }}</strong>. A continuación te detallamos las tareas y repuestos requeridos para completar la reparación:</p>

            <table class="table">
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Repuesto</th>
                        <th style="text-align: right;">Costo</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($equipo->reparaciones->where('presupuesto_aprobado', '!==', false) as $reparacion)
                    <tr>
                        <td>
                            <strong>{{ $reparacion->titulo }}</strong>
                            @if($reparacion->descripcion)
                            <div style="font-size: 12px; color: #6b7280;">{{ $reparacion->descripcion }}</div>
                            @endif
                        </td>
                        <td>{{ $reparacion->repuesto?->nombre ?? 'Mano de obra' }}</td>
                        <td style="text-align: right; font-family: monospace; font-weight: bold;">
                            ${{ number_format($reparacion->costo, 2, ',', '.') }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="total-box">
                <span class="total-title">TOTAL ESTIMADO:</span>
                <span class="total-amount">${{ number_format($equipo->presupuesto?->monto ?? 0, 2, ',', '.') }}</span>
            </div>

            <div class="note">
                <strong>Importante:</strong> Este correo es meramente informativo. Para confirmar o rechazar el inicio de los trabajos, comunícate con nosotros por WhatsApp, llamada o acércate a nuestro mostrador.
            </div>
        </div>

        <div class="footer">
            Sistema de Gestión de Taller &bull; Mensaje generado automáticamente.
        </div>
    </div>
</body>

</html>