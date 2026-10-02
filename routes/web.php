<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CarouselController;
use App\Http\Controllers\Equiposcontroller;

//Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::resource('equipos',[Equiposcontroller::class]);

require __DIR__.'/settings.php';
