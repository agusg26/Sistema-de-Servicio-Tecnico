<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Equiposcontroller;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\Reparacionescontroller;
use App\Http\Controllers\RepuestosController;
use App\Http\Controllers\EmpleadosController;
use App\Models\Equipo;
use App\Http\Controllers\ReportesController;
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

    Route::get('/equipos/{equipo}/reporte', [Equiposcontroller::class, 'descargarReporte'])
        ->name('equipos.reporte');


    Route::resource('repuestos', RepuestosController::class)->names('repuestos')->middleware(['auth', 'role:tecnico|admin|super admin']);
});
Route::middleware(['auth', 'role:admin|super admin'])->group(function () {
    Route::get('/reportes', [ReportesController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/equipos-pdf', [ReportesController::class, 'generarPdf'])->name('reportes.equipos.pdf');
    Route::get('/reportes/equipos-excel', [ReportesController::class, 'generarExcel'])->name('reportes.equipos.excel');
    Route::get('/repuestos/create', [RepuestosController::class, 'create'])->name('repuestos.create');
    Route::get('/repuestos/edit/{repuesto}', [RepuestosController::class, 'edit'])->name('repuestos.edit');

    Route::get('/empleados', [EmpleadosController::class, 'index'])->name('empleados.index');
    Route::put('/empleados/{empleado}', [EmpleadosController::class, 'update'])->name('empleados.update');
    Route::delete('/empleados/{empleado}', [EmpleadosController::class, 'destroy'])->name('empleados.destroy');
});



require __DIR__ . '/auth.php';

require __DIR__ . '/settings.php';
