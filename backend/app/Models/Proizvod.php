<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proizvod extends Model
{
    use HasFactory;
    protected $table = 'proizvods';
    protected $fillable = [ 'naziv_proizvoda', 'cena'];
    protected $primaryKey = 'proizvodid';

}
