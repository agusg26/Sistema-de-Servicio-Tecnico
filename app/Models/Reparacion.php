<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Observers\ReparacionObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([ReparacionObserver::class])]
class Reparacion extends Model
{
    protected $table = 'reparaciones';
    protected $fillable = [
        'titulo',
        'descripcion',
        'costo',
        'presupuesto_aprobado',
        'equipo_id',
        'repuesto_id',
    ];

    public function repuesto(): BelongsTo
    {
        return $this->belongsTo(Repuesto::class);
    }

    public function repuestos(): BelongsTo
    {
        return $this->belongsTo(Repuesto::class, 'repuesto_id');
    }

    public function equipo(): BelongsTo
    {
        return $this->belongsTo(Equipo::class);
    }
}
