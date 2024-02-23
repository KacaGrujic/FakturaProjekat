<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StavkeFakture extends Model
{
   
    protected $fillable = ['stavkefaktureid','kolicina', 'iznos', 'proizvodid', 'fakturaid'];
    protected $table = 'stavke_faktures';



    public function proizvod()
    {
        return $this->belongsTo(Proizvod::class, 'proizvodid');
    }
    
    
    
    public function faktura()
    {
        return $this->belongsTo(Faktura::class, 'fakturaid');
    }
    

    public function calculateIznos()
    {
        $proizvod = Proizvod::find($this->proizvodid);

        if ($proizvod) {
            $this->iznos = $proizvod->cena * $this->kolicina;
        } else {
            $this->iznos = 0;
        }

        $this->save();
    }

    public function save(array $options = [])
    {
        $this->calculateIznos();
        parent::save($options);
    }






    // public function __construct(array $attributes = [])
    // {
    //     parent::__construct($attributes);

    //     $this->attributes['stavkefaktureid'] = $attributes['stavkefaktureid'] ?? null;
    //     $this->attributes['kolicina'] = $attributes['kolicina'] ?? null;
    //     $this->attributes['iznos'] = $attributes['iznos'] ?? null;
        
    //     $this->attributes['proizvodid'] = $attributes['proizvodid'] ?? null;
    //     $this->attributes['fakturaid'] = $attributes['fakturaid'] ?? null;

    //     $this->attributes['iznos'] = $this->izracunajIznosStavke();
        
    // }


    // public function izracunajIznosStavke()
    // {
    //     $proizvod = Proizvod::find($this->proizvodid);

    //         if ($proizvod) {
    //             return $proizvod->cena * $this->kolicina;
    //         }

    //         return 0;
    //     }

}