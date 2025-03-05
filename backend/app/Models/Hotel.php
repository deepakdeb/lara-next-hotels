<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    //
    protected $fillable = [
        'id',
        'name',
        'address',
        'cost_per_night',
        'available_rooms',
        'image',
        'average_rating',
        'created_at'
    ]; 
}
