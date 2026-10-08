<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reparacion extends Model
{
    protected $fillable = [
        'titulo',
        'descripcion',
        'costo',
        'repuesto_id',
    ];
    //
    public function repuestos(): BelongsTo
    {
        return $this->belongsTo(Repuesto::class);
    }

    public function equipo(): BelongsTo
    {
        return $this->belongsTo(Equipo::class);
    }
}
