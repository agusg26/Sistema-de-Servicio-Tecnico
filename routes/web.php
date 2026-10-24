<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Equiposcontroller;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\Reparacionescontroller;
// Redirigir la raíz directamente al listado de equipos
Route::get('/', function () {
    return redirect()->route('equipos.index');
});


Route::resource('equipos', Equiposcontroller::class);

Route::resource('clientes', Clientescontroller::class);

Route::resource('reparaciones', Reparacionescontroller::class)->parameters([
    'reparaciones' => 'reparacion',
]);

require __DIR__ . '/auth.php';

require __DIR__ . '/settings.php';
