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
            'cliente.nombre' => 'required_without:cliente_id|nullable|string|max:125',
            'cliente.apellido' => 'required_without:cliente_id|nullable|string|max:125',
            'cliente.dni' => 'required_without:cliente_id|nullable|string|max:20',
            'cliente.telefono' => 'required_without:cliente_id|nullable|string|max:50',


            'equipo.nombre' => 'required|string|max:255',
            'equipo.estado_id' => 'required|exists:estados,id',
        ]);

        DB::transaction(function () use ($validated) {
            $clienteId = $validated['cliente_id'];
            if (!$clienteId) {
                $nuevoCliente = Cliente::create($validated['cliente']);
                $clienteId = $nuevoCliente->id;
            }

            // Creamos el equipo asignÃ¡ndole el ID del cliente reciÃ©n creado
            Equipo::create([
                'cliente_id' => $clienteId,
                'nombre' => $validated['equipo']['nombre'],
                'estado_id' => $validated['equipo']['estado_id'],
                'user_id' => null,
            ]);
        });

        return redirect()->route('equipos.index')->with('success', 'Cliente y equipo registrados exitosamente.');
    }

    public function show(Equipo $equipo) {}

    public function edit(Equipo $equipo)
    {
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
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'estado_id' => 'required|exists:estados,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if (
            $validated['user_id'] != null &&
            $validated['user_id'] != (int) $equipo->user_id &&
            $equipo->estado_id != 2
        ) {
            $validated['estado_id'] = 2;
        }

        $equipo->update($validated);

        return redirect()->route('equipos.index')->with('success', 'Equipo actualizado exitosamente.');
    }

    public function destroy(Equipo $equipo)
    {
        $equipo->delete();
        return redirect()->route('equipos.index')->with('success', 'Equipo eliminado exitosamente.');
    }
}
