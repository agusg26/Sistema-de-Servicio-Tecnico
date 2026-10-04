<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Equiposcontroller;
use App\Http\Controllers\ClientesController;

// Redirigir la raíz directamente al listado de equipos
Route::get('/', function () {
    return redirect()->route('equipos.index');
});

// El resource maneja automático index, create y store sin duplicar rutas
Route::resource('equipos', Equiposcontroller::class)->only(['index', 'create', 'store']);

Route::resource('clientes', Clientescontroller::class)->only(['index', 'create', 'store']);

require __DIR__ . '/settings.php';
