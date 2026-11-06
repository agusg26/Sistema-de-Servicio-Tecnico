<?php

namespace App\Observers;

use App\Models\Reparacion;
use App\Models\Repuesto;
use Illuminate\Validation\ValidationException;

class ReparacionObserver
{

    public function creating(Reparacion $reparacion): void
    {
        if ($reparacion->repuesto_id !== null) {
            $repuesto = Repuesto::find($reparacion->repuesto_id);

            if (! $repuesto || $repuesto->stock <= 0) {
                throw ValidationException::withMessages([
                    'repuesto_id' => 'El repuesto seleccionado no cuenta con stock disponible.',
                ]);
            }
        }
    }


    public function created(Reparacion $reparacion): void
    {

        if ($reparacion->presupuesto_aprobado !== false) {
            $reparacion->equipo->presupuesto?->increment('monto', (float) $reparacion->costo);

            if ($reparacion->repuesto_id) {
                $this->decrementarStock($reparacion->repuesto_id);
            }
        }
    }


    public function updating(Reparacion $reparacion): void
    {
        if ($reparacion->isDirty('presupuesto_aprobado') && $reparacion->presupuesto_aprobado === false) {
            return;
        }

        if ($reparacion->isDirty('repuesto_id') && $reparacion->repuesto_id !== null) {
            $nuevoRepuesto = Repuesto::find($reparacion->repuesto_id);

            if (! $nuevoRepuesto || $nuevoRepuesto->stock <= 0) {
                throw ValidationException::withMessages([
                    'repuesto_id' => 'El repuesto seleccionado no cuenta con stock disponible.',
                ]);
            }
        }
    }

    /**
     * Gestiona las variaciones de presupuesto, stock y el borrado lógico.
     */
    public function updated(Reparacion $reparacion): void
    {

        if ($reparacion->wasChanged('presupuesto_aprobado') && $reparacion->presupuesto_aprobado === false) {
            $reparacion->equipo->presupuesto?->decrement('monto', (float) $reparacion->costo);

            if ($reparacion->getOriginal('repuesto_id')) {
                $this->incrementarStock($reparacion->getOriginal('repuesto_id'));
            }

            return;
        }

        if ($reparacion->presupuesto_aprobado === false) {
            return;
        }

        if ($reparacion->wasChanged('repuesto_id')) {
            $repuestoAnteriorId = $reparacion->getOriginal('repuesto_id');
            $repuestoNuevoId    = $reparacion->repuesto_id;

            // Reintegrar la unidad al repuesto descartado
            if ($repuestoAnteriorId) {
                $this->incrementarStock($repuestoAnteriorId);
            }

            // Descontar la unidad del repuesto entrante
            if ($repuestoNuevoId) {
                $this->decrementarStock($repuestoNuevoId);
            }
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


    private function incrementarStock(int $repuestoId): void
    {
        $repuesto = Repuesto::find($repuestoId);
        if (! $repuesto) return;

        $repuesto->increment('stock', 1);

        if ($repuesto->stock > 0 && ! $repuesto->activo) {
            $repuesto->update(['activo' => true]);
        }
    }


    private function decrementarStock(int $repuestoId): void
    {
        $repuesto = Repuesto::find($repuestoId);
        if (! $repuesto) return;

        $repuesto->decrement('stock', 1);

        if ($repuesto->stock <= 0) {
            $repuesto->update(['activo' => false]);
        }
    }
}
