<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Estado;
use App\Models\Cliente;
use App\Models\Equipo;
use App\Models\Reparacion;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\PresupuestoMail;
use App\Mail\EquipoListoRetiroMail;
use App\Mail\ReparacionesComienzoEmail;
use Barryvdh\DomPDF\Facade\Pdf;

class Equiposcontroller extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Equipos', [
            'equipos' => Equipo::with(['cliente', 'estado'])->get(),
            ...DashBoardController::getDashBoardData(),
        ]);
    }

    public function create()
    {
        $dni = request()->query('dni');
        $dni = is_string($dni) ? trim($dni) : null;
        $clienteExistente = $dni ? Cliente::where('dni', $dni)->first() : null;
        return Inertia::render('createEquipos', [
            'estados' => Estado::all(),
            'clienteExistente' => $clienteExistente,
            'dni' => $dni,
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->input('cliente_id')) {
            $request->merge(['cliente_id' => null]);
        }
        $validated = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'cliente.nombre' => 'required_without:cliente_id|nullable|string|max:60',
            'cliente.apellido' => 'required_without:cliente_id|nullable|string|max:125',
            'cliente.dni' => 'required_without:cliente_id|nullable|string|max:20',
            'cliente.telefono' => 'required_without:cliente_id|nullable|string|max:50',
            'cliente.email' => 'nullable|email|max:75',


            'equipo.nombre' => 'required|string|max:60',
            'equipo.observaciones' => 'nullable|string|max:255',
            'equipo.estado_id' => 'required|exists:estados,id',
        ]);

        DB::transaction(function () use ($validated) {
            $clienteId = $validated['cliente_id'];
            if (!$clienteId) {
                $nuevoCliente = Cliente::create($validated['cliente']);
                $clienteId = $nuevoCliente->id;
            }
            Equipo::create([
                'cliente_id' => $clienteId,
                'nombre' => $validated['equipo']['nombre'],
                'observaciones' => $validated['equipo']['observaciones'],
                'estado_id' => $validated['equipo']['estado_id'],
                'user_id' => null,
            ]);
        });

        return redirect()->route('equipos.index')->with('success', 'Cliente y equipo registrados exitosamente.');
    }

    public function show(Equipo $equipo)
    {
        $equipo->load([
            'cliente',
            'estado',
            'tecnico',
            'presupuesto',
            'reparaciones.repuesto',
            'historial.estado',
        ]);

        return Inertia::render('ShowEquipos', [
            'equipo' => $equipo,
        ]);
    }

    public function edit(Request $request, Equipo $equipo)
    {
        /** @var User $user */
        $user = $request->user();
        if ($user->hasRole('tecnico') && !$user->hasRole(['admin', 'super admin'])) {
            if ((int)$equipo->user_id !== (int)$user->id) {
                abort(403, 'No tienes permiso para editar este equipo');
            }
        }
        $equipo->load(['cliente', 'estado', 'tecnico', 'presupuesto', 'reparaciones.repuesto']);
        return Inertia::render('EditEquipos', [
            'equipo' => $equipo,
            'estados' => Estado::all(),
            'users' => User::all(),
            'reparaciones' => $equipo->reparaciones,
            'repuestos' => \App\Models\Repuesto::select('id', 'nombre', 'precio_unitario')->get(),
        ]);
    }

    public function update(Request $request, Equipo $equipo)
    {
        /** @var User $user */
        $user = $request->user();
        $esAdmin = $user->hasRole(['admin', 'super admin']);
        $esTecnicoAsignado = ((int) $user->id === (int) $equipo->user_id);

        $validated = $request->validate([
            'nombre'               => 'required|string|max:255',
            'observaciones'        => 'nullable|string|max:255',
            'estado_id'            => 'required|exists:estados,id',
            'user_id'              => 'nullable|exists:users,id',
            'presupuesto_aprobado' => 'nullable|boolean',
        ]);

        $estadoActual = (int) $equipo->estado_id;
        $esCanceladoORetirado = in_array($estadoActual, [6, 7], true);

        // Si está Cancelado (6) o Retirado (7), no se puede modificar ningún atributo del equipo
        if ($esCanceladoORetirado) {
            abort(403, 'El equipo se encuentra cancelado o retirado y no admite modificaciones.');
        }

        // Verificación de rol de administrador o técnico asignado para cambiar estado
        if (! $esAdmin && ! $esTecnicoAsignado) {
            $validated['estado_id'] = $equipo->estado_id;
            $validated['user_id']   = $equipo->user_id;
        } else {
            // Si no es admin, restringir transiciones según estado actual
            if (! $esAdmin) {
                $nuevoEstado = (int) $validated['estado_id'];

                // Estado 1 (Pendiente de asignación): solo se puede cancelar (6)
                if ($estadoActual === 1 && $nuevoEstado !== 1 && $nuevoEstado !== 6) {
                    $validated['estado_id'] = $equipo->estado_id;
                }

                // Estado 5 (Reparación Completa): solo se puede pasar a Retirado (7) o Cancelado (6)
                if ($estadoActual === 5 && ! in_array($nuevoEstado, [5, 6, 7], true)) {
                    $validated['estado_id'] = $equipo->estado_id;
                }
            }

            // Si es admin y asigna un técnico a un equipo en espera (estado 1)
            if (
                $esAdmin &&
                $validated['user_id'] !== null &&
                $validated['user_id'] != (int) $equipo->user_id &&
                $estadoActual === 1 &&
                (int) $validated['estado_id'] === 1
            ) {
                $validated['estado_id'] = 2;
            }
        }

        //Notificacion cuando el equipo se marca como terminado
        if ($equipo->estado_id !== 5 && (int) $validated['estado_id'] === 5) {
            $equipo->load(['cliente', 'presupuesto', 'tecnico']);

            if (! empty($equipo->cliente?->email)) {
                Mail::to($equipo->cliente->email)->send(new EquipoListoRetiroMail($equipo));
            }
        }

        $equipo->update([
            'nombre'    => $validated['nombre'],
            'observaciones' => $validated['observaciones'],
            'estado_id' => $validated['estado_id'],
            'user_id'   => $validated['user_id'],
        ]);

        // Procesar aprobación del presupuesto 
        if (
            $request->has('presupuesto_aprobado') && $request->input('presupuesto_aprobado') !== null
            && (int) $equipo->estado_id !== 6
        ) {
            $aprobado = (bool) $request->input('presupuesto_aprobado');
            $estabaPendiente = is_null($equipo->presupuesto?->aprobado);

            if ($equipo->presupuesto) {
                $equipo->presupuesto->update([
                    'aprobado' => $aprobado,
                ]);
            }

            if ($estabaPendiente && $aprobado === true) {
                $equipo->load(['cliente', 'tecnico', 'reparaciones']);

                if (! empty($equipo->cliente?->email)) {
                    try {
                        Mail::to($equipo->cliente->email)->send(new ReparacionesComienzoEmail($equipo));
                    } catch (\Throwable $e) {
                    }
                }
            }
        }


        return redirect()->back()->with('success', 'Equipo y presupuesto actualizados correctamente.');
    }

    public function destroy(Equipo $equipo)
    {
        $equipo->delete();
        return redirect()->route('equipos.index')->with('success', 'Equipo eliminado exitosamente.');
    }
    public function notificarPresupuesto(Equipo $equipo)
    {
        $equipo->load(['cliente', 'reparaciones.repuesto', 'presupuesto']);

        if (! $equipo->cliente || empty($equipo->cliente->email)) {
            return redirect()->back()->withErrors([
                'email' => 'El cliente no tiene un correo electrónico registrado.',
            ]);
        }

        if ($equipo->reparaciones->isEmpty()) {
            return redirect()->back()->withErrors([
                'reparaciones' => 'No se puede enviar un presupuesto sin reparaciones registradas.',
            ]);
        }

        Mail::to($equipo->cliente->email)->send(new PresupuestoMail($equipo));

        return redirect()->back()->with('success', 'Presupuesto enviado exitosamente al cliente.');
    }

    public function descargarReporte(Equipo $equipo)
    {
        $equipo->load(['cliente', 'estado', 'tecnico', 'presupuesto', 'reparaciones.repuesto']);

        $pdf = Pdf::loadView('pdf.orden_equipo', compact('equipo'))
            ->setPaper('a4', 'portrait');

        return $pdf->stream("orden-servicio-{$equipo->id}.pdf");
    }
}
