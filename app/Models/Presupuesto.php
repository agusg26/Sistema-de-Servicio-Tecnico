<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presupuesto extends Model
{
    protected $fillable = [
        'monto',
        'equipo_id',
        'aprobado',
    ];
    //
    public function equipos()
    {
        return $this->belongsTo(Equipo::class);
    }
}
