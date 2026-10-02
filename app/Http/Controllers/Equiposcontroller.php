<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Estado;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Equiposcontroller extends Controller
{
    public function index()
    {
        return Inertia::render('Equipos/Index', [
            'equipos' => Equipo::with(['cliente', 'estado'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Equipos/Create', [
            'estados' => Estado::all(),
            'clientes' => Cliente::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'estado_id' => 'required|exists:estados,id',
            'cliente_id' => 'required|exists:clientes,id',
            'falla' => 'nullable|string',
        ]);

        Equipo::create($validated);

        return redirect()->route('equipos.index')->with('success', 'Equipo creado exitosamente');
    }
}