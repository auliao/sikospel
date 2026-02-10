<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemilik extends Model
{
    protected $table = 'pemilik';

    protected $fillable = [
        'user_id',
        'name',
        'contact_info',
    ];

    public function kos()
    {
        return $this->hasMany(Kos::class, 'owner_id', 'user_id');
    }
}
