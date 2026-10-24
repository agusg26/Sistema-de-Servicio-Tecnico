<?php

namespace App\Observers;

use App\Models\Equipo;

class EquipoObserver
{
    /**
     * Handle the Equipo "created" event.
     */
    public function created(Equipo $equipo): void
    {
        $equipo->historial()->create([
            'estado_id' => $equipo->estado_id,
            'observaciones' => 'Ingreso inicial del equipo al taller.',
        ]);
        $equipo->presupuesto()->create([
            'monto' => 0,
        ]);
    }

    /**
     * Handle the Equipo "updated" event.
     */
    public function updated(Equipo $equipo): void
    {
        if ($equipo->wasChanged('estado_id')) {
            $equipo->historial()->create([
                'estado_id' => $equipo->estado_id,
                'observaciones' => 'El estado del equipo ha cambiado.',
            ]);
        }
    }

    /**
     * Handle the Equipo "deleted" event.
     */
    public function deleted(Equipo $equipo): void
    {
        //
    }

    /**
     * Handle the Equipo "restored" event.
     */
    public function restored(Equipo $equipo): void
    {
        //
    }

    /**
     * Handle the Equipo "force deleted" event.
     */
    public function forceDeleted(Equipo $equipo): void
    {
        //
    }
}
