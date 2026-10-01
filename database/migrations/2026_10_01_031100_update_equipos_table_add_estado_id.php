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
        Schema::table('equipos', function (Blueprint $table) {
            $table->unsignedBigInteger('estado_id')->nullable()->after('falla');
        });

        // Migrar datos existentes
        $estados = DB::table('estados')->pluck('id', 'nombre');
        foreach ($estados as $nombre => $id) {
            DB::table('equipos')->where('estado', $nombre)->update(['estado_id' => $id]);
        }

        // Asignar estado por defecto si alguno quedó nulo
        $defaultId = DB::table('estados')->where('nombre', 'recibido')->value('id');
        if ($defaultId) {
            DB::table('equipos')->whereNull('estado_id')->update(['estado_id' => $defaultId]);
        }

        Schema::table('equipos', function (Blueprint $table) {
            $table->unsignedBigInteger('estado_id')->nullable(false)->change();
            $table->foreign('estado_id')->references('id')->on('estados')->restrictOnDelete();
            $table->dropColumn('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipos', function (Blueprint $table) {
            $table->string('estado')->nullable();
        });

        $estados = DB::table('estados')->pluck('nombre', 'id');
        foreach ($estados as $id => $nombre) {
            DB::table('equipos')->where('estado_id', $id)->update(['estado' => $nombre]);
        }

        Schema::table('equipos', function (Blueprint $table) {
            $table->dropForeign(['estado_id']);
            $table->dropColumn('estado_id');
        });
    }
};
