<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estado extends Model
{
    protected $fillable = [
        'nombre',
        'color',
    ];

    public function equipos(): HasMany
    {
        return $this->hasMany(Equipo::class, 'estado_id');
    }
}
