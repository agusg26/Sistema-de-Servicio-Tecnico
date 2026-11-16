<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Equipo;
use App\Models\Repuesto;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class EquiposSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Obtener técnicos por email
        $luciano = User::where('email', 'lucianoTecnico@gmail.com')->first();
        $mariano = User::where('email', 'MarianoTecnico@gmail.com')->first();
        $leonel  = User::where('email', 'LeonelTecnico@gmail.com')->first();

        $tecnicos  = array_values(array_filter([$luciano?->id, $mariano?->id, $leonel?->id]));
        $idLuciano = $luciano?->id ?? ($tecnicos[0] ?? null);
        $idMariano = $mariano?->id ?? ($tecnicos[1] ?? $idLuciano);
        $idLeonel  = $leonel?->id  ?? ($tecnicos[2] ?? $idLuciano);

        // 2. Crear los 5 clientes
        $clientesData = [
            [
                'dni'      => '41520890',
                'nombre'   => 'Mariano Nahuel',
                'apellido' => 'Martinez',
                'telefono' => '3875123456',
                'email'    => 'agusg2600@gmail.com',
            ],
            [
                'dni'      => '42890123',
                'nombre'   => 'Sergio Agustin',
                'apellido' => 'Castillo',
                'telefono' => '3875654321',
                'email'    => 'agustinclans@gmail.com',
            ],
            [
                'dni'      => '35678901',
                'nombre'   => 'Sofia',
                'apellido' => 'Gomez',
                'telefono' => '3874112233',
                'email'    => 'sofiagomez@gmail.com',
            ],
            [
                'dni'      => '38901234',
                'nombre'   => 'Lucas',
                'apellido' => 'Peralta',
                'telefono' => '3874445566',
                'email'    => 'lucasperalta@gmail.com',
            ],
            [
                'dni'      => '29345678',
                'nombre'   => 'Valeria',
                'apellido' => 'Sosa',
                'telefono' => '3876778899',
                'email'    => 'valeriasosa@gmail.com',
            ],
        ];

        $clientes = [];
        foreach ($clientesData as $c) {
            $clientes[] = Cliente::firstOrCreate(
                ['dni' => $c['dni']],
                $c
            );
        }

        // 3. Obtener repuestos para vincular mediante repuesto_id
        $ram8       = Repuesto::where('nombre', 'Memoria 8GB 3200mhz')->first();
        $ram16      = Repuesto::where('nombre', 'Memoria 16GB 3200mhz')->first();
        $ssd240     = Repuesto::where('nombre', 'SSD 240GB')->first();
        $ssd480     = Repuesto::where('nombre', 'SSD 480GB')->first();
        $fuenteCors = Repuesto::where('nombre', 'Fuente de poder 600w')->where('marca', 'Corsair')->first();
        $fuenteGen  = Repuesto::where('nombre', 'Fuente de poder 600w')->where('marca', 'Generica')->first();
        $cooler     = Repuesto::where('nombre', 'Ventilador 120mm')->first();

        /*
         * Estados:
         * 1: Pendiente de asignación
         * 2: Asignado
         * 3: Diagnosticado
         * 4: En Reparación
         * 5: Reparacion Completa
         * 6: Cancelado
         * 7: Retirado
         */

        // 4. Configuración de los 14 Equipos
        $equiposConfig = [
            // ================= 6 RETIRADOS (Estado 7) - Septiembre y Octubre 2026 =================
            [
                'cliente_id'    => $clientes[0]->id, // Mariano Nahuel Martinez
                'nombre'        => 'Notebook Lenovo IdeaPad 3',
                'observaciones' => 'Lenta al iniciar Windows, pide upgrade de almacenamiento.',
                'estado_id'     => 7,
                'user_id'       => $idLuciano,
                'created_at'    => Carbon::create(2026, 9, 4, 10, 15, 0),
                'updated_at'    => Carbon::create(2026, 9, 10, 17, 30, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Upgrade a unidad SSD',
                        'descripcion' => 'Instalación de SSD 240GB y clonación de sistema operativo.',
                        'costo'       => 25000,
                        'repuesto_id' => $ssd240?->id,
                    ],
                ],
            ],
            [
                'cliente_id'    => $clientes[1]->id, // Agustin Clans
                'nombre'        => 'PC Gamer Ryzen 5',
                'observaciones' => 'Se apaga sola al abrir juegos pesados.',
                'estado_id'     => 7,
                'user_id'       => $idMariano,
                'created_at'    => Carbon::create(2026, 9, 12, 11, 0, 0),
                'updated_at'    => Carbon::create(2026, 9, 18, 16, 45, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Reemplazo de fuente de alimentación',
                        'descripcion' => 'Cambio de fuente agotada por Corsair 600W certificada.',
                        'costo'       => 20000,
                        'repuesto_id' => $fuenteCors?->id,
                    ],
                ],
            ],
            [
                'cliente_id'    => $clientes[2]->id,
                'nombre'        => 'Notebook HP Pavilion 15',
                'observaciones' => 'Falta de memoria para trabajo de diseño.',
                'estado_id'     => 7,
                'user_id'       => $idLeonel,
                'created_at'    => Carbon::create(2026, 9, 21, 9, 30, 0),
                'updated_at'    => Carbon::create(2026, 9, 26, 18, 10, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Ampliación de RAM y mantenimiento',
                        'descripcion' => 'Instalación de módulo 16GB 3200MHz y limpieza de cooler.',
                        'costo'       => 18000,
                        'repuesto_id' => $ram16?->id,
                    ],
                ],
            ],
            [
                'cliente_id'    => $clientes[3]->id,
                'nombre'        => 'PC Oficina Intel i3',
                'observaciones' => 'No enciende, olor a quemado en la fuente.',
                'estado_id'     => 7,
                'user_id'       => $idLuciano,
                'created_at'    => Carbon::create(2026, 10, 3, 14, 20, 0),
                'updated_at'    => Carbon::create(2026, 10, 8, 12, 0, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Cambio de fuente ATX',
                        'descripcion' => 'Sustitución de fuente quemada por fuente genérica 600W.',
                        'costo'       => 15000,
                        'repuesto_id' => $fuenteGen?->id,
                    ],
                ],
            ],
            [
                'cliente_id'    => $clientes[4]->id,
                'nombre'        => 'Notebook Asus VivoBook',
                'observaciones' => 'Disco rígido mecánico con sectores dañados.',
                'estado_id'     => 7,
                'user_id'       => $idMariano,
                'created_at'    => Carbon::create(2026, 10, 11, 10, 0, 0),
                'updated_at'    => Carbon::create(2026, 10, 17, 19, 15, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Reemplazo de disco dañado',
                        'descripcion' => 'Colocación de SSD 480GB Kingston e instalación limpia de Windows.',
                        'costo'       => 28000,
                        'repuesto_id' => $ssd480?->id,
                    ],
                ],
            ],
            [
                'cliente_id'    => $clientes[0]->id, // Mariano Nahuel Martinez
                'nombre'        => 'PC Escritorio Contable',
                'observaciones' => 'Ruido fuerte en cooler trasero y poca RAM.',
                'estado_id'     => 7,
                'user_id'       => $idLeonel,
                'created_at'    => Carbon::create(2026, 10, 20, 15, 30, 0),
                'updated_at'    => Carbon::create(2026, 10, 27, 11, 40, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Cambio de cooler de gabinete',
                        'descripcion' => 'Instalación de ventilador Cooler Master 120mm.',
                        'costo'       => 12000,
                        'repuesto_id' => $cooler?->id,
                    ],
                    [
                        'titulo'      => 'Ampliación de memoria RAM',
                        'descripcion' => 'Agregado de módulo 8GB DDR4 3200MHz.',
                        'costo'       => 10000,
                        'repuesto_id' => $ram8?->id,
                    ],
                ],
            ],

            // ================= 2 CANCELADOS (Estado 6) - Septiembre y Octubre 2026 =================
            [
                'cliente_id'    => $clientes[1]->id, // Agustin Clans
                'nombre'        => 'Notebook Dell Inspiron 14',
                'observaciones' => 'Cortocircuito en mother y disco sin reconocer.',
                'estado_id'     => 6,
                'user_id'       => $idLuciano,
                'created_at'    => Carbon::create(2026, 9, 15, 13, 0, 0),
                'updated_at'    => Carbon::create(2026, 9, 22, 10, 30, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Reparación de placa y cambio de SSD',
                        'descripcion' => 'Reconstrucción de línea 19V y reemplazo por SSD 480GB.',
                        'costo'       => 45000,
                        'repuesto_id' => $ssd480?->id,
                    ],
                ],
            ],
            [
                'cliente_id'    => $clientes[2]->id,
                'nombre'        => 'PC Workstation Edición',
                'observaciones' => 'Cliente consulta presupuesto por fuente certificada.',
                'estado_id'     => 6,
                'user_id'       => $idMariano,
                'created_at'    => Carbon::create(2026, 10, 14, 16, 0, 0),
                'updated_at'    => Carbon::create(2026, 10, 21, 14, 20, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Reemplazo por Fuente Corsair 600W',
                        'descripcion' => 'Provisión y montaje de fuente Corsair 600W.',
                        'costo'       => 20000,
                        'repuesto_id' => $fuenteCors?->id,
                    ],
                ],
            ],

            // ================= 6 EN OTROS ESTADOS (Noviembre 2026) =================
            // 2 en Reparación Completa (Estado 5 -> aprobado = true)
            [
                'cliente_id'    => $clientes[0]->id, // Mariano Nahuel Martinez
                'nombre'        => 'Notebook Acer Aspire 5',
                'observaciones' => 'Mantenimiento general y ampliación de memoria.',
                'estado_id'     => 5,
                'user_id'       => $idLuciano,
                'created_at'    => Carbon::create(2026, 11, 2, 9, 45, 0),
                'updated_at'    => Carbon::create(2026, 11, 10, 17, 0, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Upgrade de RAM y limpieza térmica',
                        'descripcion' => 'Agregado de 8GB DDR4 3200MHz y cambio de pasta térmica.',
                        'costo'       => 22000,
                        'repuesto_id' => $ram8?->id,
                    ],
                ],
            ],
            [
                'cliente_id'    => $clientes[1]->id, // Agustin Clans
                'nombre'        => 'PC Diseño Gráfico',
                'observaciones' => 'Cambio de almacenamiento principal.',
                'estado_id'     => 5,
                'user_id'       => $idLeonel,
                'created_at'    => Carbon::create(2026, 11, 5, 11, 20, 0),
                'updated_at'    => Carbon::create(2026, 11, 12, 18, 30, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Instalación de SSD primario',
                        'descripcion' => 'Montaje de SSD 240GB Kingston e instalación de sistema.',
                        'costo'       => 20000,
                        'repuesto_id' => $ssd240?->id,
                    ],
                ],
            ],

            // 1 En Reparación (Estado 4 -> presupuesto aprobado = null)
            [
                'cliente_id'    => $clientes[3]->id,
                'nombre'        => 'All in One HP 22',
                'observaciones' => 'Sobrecalentamiento y lentitud extrema.',
                'estado_id'     => 4,
                'user_id'       => $idMariano,
                'created_at'    => Carbon::create(2026, 11, 8, 10, 0, 0),
                'updated_at'    => Carbon::create(2026, 11, 13, 15, 0, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Instalación SSD y limpieza de disipador',
                        'descripcion' => 'Reemplazo de HDD por SSD 240GB y destape de turbina.',
                        'costo'       => 25000,
                        'repuesto_id' => $ssd240?->id,
                    ],
                ],
            ],

            // 1 Diagnosticado (Estado 3 -> presupuesto aprobado = null)
            [
                'cliente_id'    => $clientes[4]->id,
                'nombre'        => 'Notebook Banghó Max L5',
                'observaciones' => 'Pantallazos azules frecuentes al abrir navegador.',
                'estado_id'     => 4,
                'user_id'       => $idLuciano,
                'created_at'    => Carbon::create(2026, 11, 11, 12, 30, 0),
                'updated_at'    => Carbon::create(2026, 11, 14, 11, 15, 0),
                'reparaciones'  => [
                    [
                        'titulo'      => 'Cambio de memoria RAM defectuosa',
                        'descripcion' => 'Sustitución de módulo con errores en MemTest por 8GB Kingston.',
                        'costo'       => 15000,
                        'repuesto_id' => $ram8?->id,
                    ],
                ],
            ],

            // 1 Asignado (Estado 2 -> presupuesto aprobado = null)
            [
                'cliente_id'    => $clientes[0]->id, // Mariano Nahuel Martinez
                'nombre'        => 'MacBook Air A1466',
                'observaciones' => 'Revisión de bisagras y chequeo general.',
                'estado_id'     => 2,
                'user_id'       => $idLeonel,
                'created_at'    => Carbon::create(2026, 11, 13, 16, 10, 0),
                'updated_at'    => Carbon::create(2026, 11, 14, 9, 20, 0),
                'reparaciones'  => [],
            ],

            // 1 Pendiente de asignación (Estado 1 -> user_id = null, presupuesto aprobado = null)
            [
                'cliente_id'    => $clientes[1]->id, // Agustin Clans
                'nombre'        => 'PC Streaming Ryzen 7',
                'observaciones' => 'Recién ingresada, sin dar video por HDMI.',
                'estado_id'     => 1,
                'user_id'       => null,
                'created_at'    => Carbon::create(2026, 11, 15, 10, 0, 0),
                'updated_at'    => Carbon::create(2026, 11, 15, 10, 0, 0),
                'reparaciones'  => [],
            ],
        ];

        // 5. Creación de Equipos, Reparaciones y Ajuste de Presupuestos/Fechas
        foreach ($equiposConfig as $item) {
            $estadoFinal = $item['estado_id'];
            $esCancelado = ($estadoFinal === 6);

            // Si el destino final es Cancelado (6), lo creamos inicialmente en Diagnosticado (3)
            // para cargar sus reparaciones y luego disparar la cancelación real vía Observer.
            $equipo = Equipo::create([
                'cliente_id'    => $item['cliente_id'],
                'nombre'        => $item['nombre'],
                'observaciones' => $item['observaciones'],
                'estado_id'     => $esCancelado ? 3 : $estadoFinal,
                'user_id'       => $item['user_id'],
            ]);

            // Crear cada reparación con la estructura exacta de tu modelo Reparacion
            foreach ($item['reparaciones'] as $repData) {
                $equipo->reparaciones()->create([
                    'titulo'               => $repData['titulo'],
                    'descripcion'          => $repData['descripcion'],
                    'costo'                => $repData['costo'],
                    'repuesto_id'          => $repData['repuesto_id'],
                    'presupuesto_aprobado' => true, // Activa en el presupuesto inicial
                ]);
            }

            if ($esCancelado) {
                // Al pasar a estado 6, EquipoObserver pone presupuesto->aprobado = false
                // y cambia cada reparación a presupuesto_aprobado = false devolviendo el stock.
                $equipo->update(['estado_id' => 6]);
            } else {
                // Regla para el resto de estados:
                // 5 (Reparación Completa) y 7 (Retirado) => aprobado = true
                // 1, 2, 3, 4 => aprobado = null
                $aprobado = in_array($estadoFinal, [5, 7], true) ? true : null;

                $equipo->presupuesto?->update([
                    'aprobado' => $aprobado,
                ]);
            }

            // Forzar fechas históricas de ingreso y cierre (Septiembre / Octubre / Noviembre)
            DB::table('equipos')
                ->where('id', $equipo->id)
                ->update([
                    'created_at' => $item['created_at'],
                    'updated_at' => $item['updated_at'],
                ]);

            DB::table('historial_estados')
                ->where('equipo_id', $equipo->id)
                ->update([
                    'created_at' => $item['created_at'],
                    'updated_at' => $item['updated_at'],
                ]);
        }
    }
}
