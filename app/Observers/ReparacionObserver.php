<?php

namespace App\Observers;

use App\Models\Reparacion;

class ReparacionObserver
{
    /**
     * Handle the Reparacion "created" event.
     */
    public function created(Reparacion $reparacion): void
    {
        $reparacion->equipo->presupuesto->increment('monto', $reparacion->costo);
    }

    /**
     * Handle the Reparacion "updated" event.
     */
    public function updated(Reparacion $reparacion): void
    {
        if ($reparacion->wasChanged('presupuesto_aprobado') && $reparacion->presupuesto_aprobado == false) {
            $reparacion->equipo->presupuesto?->decrement('monto', (float) $reparacion->costo);
            return;
        }

        if ($reparacion->presupuesto_aprobado == false) {
            return;
        }

        if ($reparacion->wasChanged('costo')) {
            $costoAnterior = (float) $reparacion->getOriginal('costo');
            $nuevoCosto    = (float) $reparacion->costo;
            $diferencia    = $nuevoCosto - $costoAnterior;

            if ($diferencia > 0) {
                $reparacion->equipo->presupuesto?->increment('monto', $diferencia);
            } elseif ($diferencia < 0) {
                $reparacion->equipo->presupuesto?->decrement('monto', abs($diferencia));
            }
        }
    }

    /**
     * Handle the Reparacion "deleted" event.
     */
    public function deleted(Reparacion $reparacion): void
    {
        //
    }

    /**
     * Handle the Reparacion "restored" event.
     */
    public function restored(Reparacion $reparacion): void
    {
        //
    }

    /**
     * Handle the Reparacion "force deleted" event.
     */
    public function forceDeleted(Reparacion $reparacion): void
    {
        //
    }
}
