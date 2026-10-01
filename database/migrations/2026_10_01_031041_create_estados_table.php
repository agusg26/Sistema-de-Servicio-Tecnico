<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('estados', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('color', 30)->nullable();
            $table->timestamps();
        });

        $datos = [
            ['nombre' => 'Pendiente de asignación', 'color' => '#ef4444'],
            ['nombre' => 'Asignado', 'color' => '#cd7216ff'],
            ['nombre' => 'Diagnosticado', 'color' => '#135eb9ff'],
            ['nombre' => 'En Reparación', 'color' => '#e5e815ff'],
            ['nombre' => 'Reparacion Completa', 'color' => '#1cad3ed7'],
            ['nombre' => 'Cancelado', 'color' => '#ef4444'],
            ['nombre' => 'Retirado', 'color' => '#f5f3f1'],

        ];

        DB::table('estados')->insert($datos);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estados');
    }
};
