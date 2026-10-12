<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Equiposcontroller;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\Reparacionescontroller;
// Redirigir la raíz directamente al listado de equipos
Route::get('/', function () {
    return redirect()->route('equipos.index');
});

// El resource maneja automático index, create y store sin duplicar rutas
Route::resource('equipos', Equiposcontroller::class);

Route::resource('clientes', Clientescontroller::class);

Route::resource('reparaciones', Reparacionescontroller::class);

require __DIR__ . '/settings.php';
