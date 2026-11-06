<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Equiposcontroller;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\Reparacionescontroller;
use App\Http\Controllers\RepuestosController;
use App\Models\Equipo;
// Redirigir la raíz directamente al listado de equipos
Route::get('/', function () {
    return redirect()->route('equipos.index');
});

Route::middleware(['auth', 'role:tecnico|admin|super admin'])->group(function () {
    Route::resource('equipos', Equiposcontroller::class);

    Route::resource('clientes', Clientescontroller::class);

    Route::resource('reparaciones', Reparacionescontroller::class)->parameters([
        'reparaciones' => 'reparacion',
    ]);
    Route::get('/api/computers', function () {
        return response()->json(
            Equipo::with(['cliente', 'estado', 'tecnico'])->get()
        );
    });
    Route::post('/equipos/{equipo}/notificar-presupuesto', [Equiposcontroller::class, 'notificarPresupuesto'])
        ->name('equipos.notificarPresupuesto');


    Route::resource('repuestos', RepuestosController::class)->names('repuestos')->middleware(['auth', 'role:tecnico|admin|super admin']);
});



require __DIR__ . '/auth.php';

require __DIR__ . '/settings.php';
