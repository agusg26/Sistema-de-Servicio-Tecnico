<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Estado;
use App\Models\Cliente;
use App\Models\Equipo;
use Illuminate\Support\Facades\DB;

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
        $clienteExistente = $dni ? Cliente::where('dni', $dni)->first() : null;
        return Inertia::render('createEquipos', [
            'estados' => Estado::all(),
            'clienteExistente' => $clienteExistente
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
            ]);
        });

        return redirect()->route('equipos.index')->with('success', 'Cliente y equipo registrados exitosamente.');
    }
}