<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zaposleni extends Model
{
    use HasFactory;
    protected $table = 'zaposlenis';
    protected $primaryKey = 'zaposleniid';
    protected $fillable = [
        'ime',
        'prezime',
        'email',
        'adresa',
        'brojtelefona'
    ];

}
