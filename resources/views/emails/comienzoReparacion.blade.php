<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Comienzo de Reparación</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f7;
            color: #333333;
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
            line-height: 1.5;
        }

        .details-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            margin: 18px 0;
            font-size: 14px;
        }

        .details-box p {
            margin: 6px 0;
        }

        .tasks-list {
            margin: 12px 0 20px 0;
            padding-left: 20px;
            font-size: 14px;
            color: #374151;
        }

        .tasks-list li {
            margin-bottom: 6px;
        }

        .note {
            background-color: #f7fee7;
            border-left: 4px solid #a3e635;
            padding: 12px;
            font-size: 13px;
            color: #365314;
            border-radius: 4px;
            margin-top: 20px;
        }

        .footer {
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="header">
            <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Inicio del Servicio</h1>
        </div>

        <div class="content">
            <p>Hola <strong>{{ $equipo->cliente?->nombre }} {{$equipo->cliente?->apellido }}</strong>,</p>
            <p>Te informamos que hemos dado inicio a los trabajos de reparación de tu equipo:</p>

            <div class="details-box">
                <p><strong>N° de Orden / Ficha:</strong> #{{ $equipo->id }}</p>
                <p><strong>Equipo:</strong> {{ $equipo->nombre }}</p>
                <p><strong>Técnico a cargo:</strong> {{ $equipo->tecnico?->name ?? 'Servicio Técnico' }}</p>
            </div>

            <p style="font-weight: 700; margin-bottom: 6px;">Trabajos a realizar:</p>

            <ul class="tasks-list">
                @php
                $reparacionesValidas = $equipo->reparaciones->where('presupuesto_aprobado', '!=', false);
                @endphp

                @forelse($reparacionesValidas as $reparacion)
                <li><strong>{{ $reparacion->titulo }}</strong></li>
                @empty
                <li style="color: #6b7280;">Diagnóstico e intervención técnica integral.</li>
                @endforelse
            </ul>

            <div class="note">
                Te estaremos enviando un nuevo correo en cuanto las tareas finalicen para coordinar el retiro del equipo.
            </div>
        </div>

        <div class="footer">
            Sistema de Gestión de Taller &bull; Mensaje generado automáticamente.
        </div>
    </div>
</body>

</html>