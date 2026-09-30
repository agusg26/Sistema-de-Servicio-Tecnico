<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CarouselController;
use App\Http\Controllers\Equiposcontroller;

//Route::inertia('/', 'welcome')->name('home');
Route::get('/', [CarouselController::class, 'index'])->name('home');

Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/equipos',[Equiposcontroller::class, 'index'])->name('equipos.index');

require __DIR__.'/settings.php';
