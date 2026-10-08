<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Repuesto extends Model
{
    //
    protected $fillable = [
        'nombre',
        'marca',
        'stock',
        'precio_unitario',
        'categoria_repuesto_id',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria_repuesto::class);
    }
    public function reparaciones(): HasMany
    {
        return $this->hasMany(Reparacion::class);
    }
}
