<?php

namespace App\Http\Controllers;

use App\Models\Categoria_repuesto;
use App\Models\Repuesto;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class RepuestosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Repuesto::with('categoria');

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('marca', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        if ($request->filled('categoria_repuesto_id')) {
            $query->where('categoria_repuesto_id', $request->input('categoria_repuesto_id'));
        }

        if ($request->filled('marca')) {
            $query->where('marca', 'like', '%' . trim($request->input('marca')) . '%');
        }

        $repuestos = $query->orderBy('id', 'desc')->get();
        $categorias = Categoria_repuesto::orderBy('nombre')->get();

        return Inertia::render('repuestos/index', [
            'repuestos' => $repuestos,
            'categorias' => $categorias,
            'filters' => $request->only(['search', 'categoria_repuesto_id', 'marca']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categorias = Categoria_repuesto::orderBy('nombre')->get();

        return Inertia::render('repuestos/create', [
            'categorias' => $categorias,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'marca' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'precio_unitario' => 'required|numeric|min:0',
            'categoria_repuesto_id' => 'required|exists:categoria_repuestos,id',
        ]);

        Repuesto::create($validated);

        return redirect()->route('repuestos.index')
            ->with('success', 'Repuesto registrado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Repuesto $repuesto)
    {
        $repuesto->load('categoria');

        return response()->json($repuesto);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Repuesto $repuesto, Request $request)
    {
        // @var User $user //
        $user = $request->user();
        if ($user->hasRole('tecnico') && !$user->hasRole(['admin', 'super admin'])) {
            abort(403, 'No tienes permiso para editar este repuesto');
        }
        return redirect()->route('repuestos.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Repuesto $repuesto)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'marca' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'precio_unitario' => 'required|numeric|min:0',
            'categoria_repuesto_id' => 'required|exists:categoria_repuestos,id',
        ]);

        $repuesto->update($validated);

        return redirect()->route('repuestos.index')
            ->with('success', 'Repuesto actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Repuesto $repuesto, Request $request)
    {
        // @var User $user //
        $user = $request->user();
        if ($user->hasRole('tecnico') && !$user->hasRole(['admin', 'super admin'])) {
            abort(403, 'No tienes permiso para eliminar este repuesto');
        }
        $repuesto->delete();

        return redirect()->route('repuestos.index')
            ->with('success', 'Repuesto eliminado correctamente.');
    }
}
