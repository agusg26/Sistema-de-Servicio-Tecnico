<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Observers\EquipoObserver;

#[ObservedBy([EquipoObserver::class])]
class Equipo extends Model
{
    protected $fillable = [
        'cliente_id',
        'nombre',
        'estado_id',
        'user_id',
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
    public function presupuesto(): HasOne
    {
        return $this->hasOne(Presupuesto::class, 'equipo_id');
    }
    public function tecnico(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
