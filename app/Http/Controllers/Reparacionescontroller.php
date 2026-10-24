<?php

namespace App\Http\Controllers;

use App\Models\Reparacion;
use App\Models\Equipo;
use App\Models\Repuesto;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

        $validated['costo'] = (int) round((float) $validated['costo']);

        if (!isset($validated['presupuesto_aprobado'])) {
            $validated['presupuesto_aprobado'] = true;
        }

        DB::transaction(function () use ($validated) {
            Reparacion::create($validated);
            $equipo = Equipo::findOrFail($validated['equipo_id']);
            if ($equipo->estado_id !== 4) {
                $equipo->update(['estado_id' => 4]);
            }
        });

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
    public function edit(Reparacion $reparacion)
    {
        return Inertia::render('Equipos/{equipo}/EditEquipos/{reparacion}', [
            'reparacion' => $reparacion,
            'repuestos' => Repuesto::all()
        ]);
    }


    public function update(Request $request, Reparacion $reparacion)
    {
        Log::info('--- UPDATE REPARACION ---');
        Log::info('ID recibido en ruta:', ['id' => $reparacion->id]);
        Log::info('Payload recibido:', $request->all());
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'costo' => 'required|numeric|min:0',
            'repuesto_id' => 'nullable|exists:repuestos,id',
            'presupuesto_aprobado' => 'nullable|boolean',
        ]);
        Log::info('Validacion OK:', $validated);

        $reparacion->update($validated);
        Log::info('Reparacion actualizada:', $reparacion->fresh()->toArray());

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
