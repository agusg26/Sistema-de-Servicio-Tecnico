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

class Equiposcontroller extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Equipos', [
            'equipos' => Equipo::with(['cliente', 'estado'])->get()
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
            'estado_id'            => 'required|exists:estados,id',
            'user_id'              => 'nullable|exists:users,id',
            'presupuesto_aprobado' => 'nullable|boolean',
        ]);

        //Verificacion de rol de administrador o tecnico asignado para cambiar estado   
        if (! $esAdmin && ! $esTecnicoAsignado) {
            $validated['estado_id'] = $equipo->estado_id;
            $validated['user_id']   = $equipo->user_id;
        } else {
            //si es admin y asigna un tecnico a un equipo en espera
            if (
                $esAdmin &&
                $validated['user_id'] !== null &&
                $validated['user_id'] != (int) $equipo->user_id &&
                $equipo->estado_id != 2
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
            'estado_id' => $validated['estado_id'],
            'user_id'   => $validated['user_id'],
        ]);

        // Procesar aprobación del presupuesto 
        if ($request->has('presupuesto_aprobado')) {
            $aprobado = (bool) $request->input('presupuesto_aprobado');

            if ($equipo->presupuesto) {
                $equipo->presupuesto->update([
                    'aprobado' => $aprobado,
                ]);
            } else {
                $equipo->presupuesto()->create([
                    'monto'    => 0,
                    'aprobado' => $aprobado,
                ]);
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
}
