<?php

namespace Database\Seeders;

use App\Models\CategoriaRepuesto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaRepuestoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            ['nombre' => 'Memorias RAM'],
            ['nombre' => 'Discos SSD'],
            ['nombre' => 'Discos Duros'],
            ['nombre' => 'Tarjetas Madre'],
            ['nombre' => 'Fuentes de Poder'],
            ['nombre' => 'Gabinetes'],
            ['nombre' => 'Ventiladores'],
            ['nombre' => 'Monitores'],
            ['nombre' => 'Otros'],
        ];

        DB::table('categoria_repuestos')->insert($categorias);
    }
}
