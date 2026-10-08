<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Equipo extends Model
{
    protected $fillable = [
        'cliente_id',
        'nombre',
        'estado_id',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class);
    }

    public function historial()
    {
        return $this->hasMany(HistorialEstado::class)->orderBy('created_at', 'desc');
    }
    public function reparaciones()
    {
        return $this->hasMany(Reparacion::class);
    }
    public function presupuestos()
    {
        return $this->hasMany(Presupuesto::class);
    }

    public function cambiarEstado(int $nuevoEstadoId, ?string $observaciones = null): void
    {
        $this->update(['estado_id' => $nuevoEstadoId]);

        $this->historial()->create([
            'estado_id' => $nuevoEstadoId,
            'observaciones' => $observaciones,
        ]);
    }
}
