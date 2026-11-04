<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Equipo listo para retirar</title>
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

        .highlight-box {
            background-color: #f7fee7;
            border: 1px solid #d9f99d;
            border-radius: 6px;
            padding: 18px;
            margin: 20px 0;
            text-align: center;
        }

        .highlight-title {
            font-size: 16px;
            font-weight: 800;
            color: #365314;
            margin-bottom: 6px;
            text-transform: uppercase;
        }

        .total-amount {
            font-size: 26px;
            font-weight: 900;
            color: #15803d;
            font-family: monospace;
        }

        .details-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .details-box p {
            margin: 6px 0;
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
            <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Servicio Técnico Finalizado</h1>
        </div>

        <div class="content">
            <p>Hola <strong>{{ $equipo->cliente->nombre }} {{ $equipo->cliente->apellido }}</strong>,</p>
            <p>Te informamos que las reparaciones técnicas correspondientes a tu equipo han concluido satisfactoriamente y ya podés pasar a retirarlo.</p>

            <div class="details-box">
                <p><strong>N° de Orden / Ficha:</strong> #{{ $equipo->id }}</p>
                <p><strong>Equipo:</strong> {{ $equipo->nombre }}</p>
                <p><strong>Técnico a cargo:</strong> {{ $equipo->tecnico?->name ?? 'Servicio Técnico' }}</p>
            </div>

            <div class="highlight-box">
                <div class="highlight-title">Total Final a Abonar</div>
                <div class="total-amount">${{ number_format($equipo->presupuesto?->monto ?? 0, 2, ',', '.') }}</div>
            </div>

            <p style="font-size: 13px; color: #4b5563; line-height: 1.6;">
                Por favor, recordá presentar tu documento o número de orden al acercarte al local para agilizar la entrega del equipo.
            </p>
        </div>

        <div class="footer">
            Sistema de Gestión de Taller &bull; Mensaje generado automáticamente.
        </div>
    </div>
</body>

</html>