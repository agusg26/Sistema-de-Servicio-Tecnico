<?php

namespace Database\Seeders;

use App\Models\Repuesto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RepuestoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $repuestos = [
            [
                'nombre' => 'Memoria 8GB 3200mhz',
                'marca' => 'Kingston',
                'stock' => 20,
                'precio_unitario' => 15000,
                'categoria_repuesto_id' => 1,
            ],
            [
                'nombre' => 'Memoria 16GB 3200mhz',
                'marca' => 'Kingston',
                'stock' => 15,
                'precio_unitario' => 25000,
                'categoria_repuesto_id' => 1,
            ],
            [
                'nombre' => 'SSD 240GB',
                'marca' => 'Kingston',
                'stock' => 10,
                'precio_unitario' => 75000,
                'categoria_repuesto_id' => 2,
            ],
            [
                'nombre' => 'SSD 480GB',
                'marca' => 'Kingston',
                'stock' => 5,
                'precio_unitario' => 380000,
                'categoria_repuesto_id' => 2,
            ],
            [
                'nombre' => 'Fuente de poder 600w',
                'marca' => 'Corsair',
                'stock' => 3,
                'precio_unitario' => 350000,
                'categoria_repuesto_id' => 5,
            ],
            [
                'nombre' => 'Fuente de poder 600w',
                'marca' => 'Generica',
                'stock' => 5,
                'precio_unitario' => 90000,
                'categoria_repuesto_id' => 5,
            ],
            [
                'nombre' => 'Ventilador 120mm',
                'marca' => 'Cooler Master',
                'stock' => 25,
                'precio_unitario' => 85000,
                'categoria_repuesto_id' => 6,
            ],
        ];

        DB::table('repuestos')->insert($repuestos);
    }
}
