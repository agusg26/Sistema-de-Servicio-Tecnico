<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Repuesto;

class Categoria_repuesto extends Model
{
    //
    protected $fillable = [
        'nombre',
    ];

    public function repuestos(): HasMany
    {
        return $this->hasMany(Repuesto::class);
    }
}
