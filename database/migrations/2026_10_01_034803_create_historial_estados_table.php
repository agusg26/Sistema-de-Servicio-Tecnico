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
        Schema::create('historial_estados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipo_id')->constrained('equipos')->cascadeOnDelete();
            $table->foreignId('estado_id')->constrained('estados')->restrictOnDelete();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });

        // Opcional pero recomendado: crear el primer registro histórico de los equipos existentes
        $equiposExistentes = DB::table('equipos')->select('id', 'estado_id', 'created_at')->get();
        foreach ($equiposExistentes as $eq) {
            DB::table('historial_estados')->insert([
                'equipo_id' => $eq->id,
                'estado_id' => $eq->estado_id,
                'observaciones' => 'Estado inicial registrado por migración',
                'created_at' => $eq->created_at ?? now(),
                'updated_at' => $eq->created_at ?? now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_estados');
    }
};
