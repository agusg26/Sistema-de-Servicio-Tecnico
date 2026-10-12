<?php

namespace App\Http\Controllers;

use App\Models\Reparacion;
use App\Models\Equipo;
use App\Models\Repuesto;
use Inertia\Inertia;
use Illuminate\Http\Request;

class Reparacionescontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Reparacion::with(['equipo', 'repuesto'])->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('equipos/{equipo}/EditEquipos/reparaciones', [
            'equipos' => Equipo::all(),
            'repuestos' => Repuesto::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipo_id' => 'required|exists:equipos,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'costo' => 'required|numeric|min:0',
            'repuesto_id' => 'nullable|exists:repuestos,id',
            'presupuesto_aprobado' => 'nullable|boolean',
        ]);

        if (!isset($validated['presupuesto_aprobado'])) {
            $validated['presupuesto_aprobado'] = true;
        }

        Reparacion::create($validated);

        return redirect()->back()->with('success', 'Reparación agregada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reparacion $reparacion) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reparacion $reparacion)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'costo' => 'required|numeric|min:0',
            'repuesto_id' => 'nullable|exists:repuestos,id',
            'presupuesto_aprobado' => 'nullable|boolean',
        ]);

        $reparacion->update($validated);

        return redirect()->back()->with('success', 'Reparación actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reparacion $reparacion)
    {
        $reparacion->delete();

        return redirect()->back()->with('success', 'Reparación eliminada exitosamente.');
    }
}
