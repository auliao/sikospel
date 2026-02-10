<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kos extends Model
{
    
    protected $table = 'kos';

    protected $fillable = [
        'owner_id',
        'name',
        'address',
    ];

    public function owner()
    {
        return $this->belongsTo(Pemilik::class, 'owner_id', 'user_id');
    }
}
