<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faktura extends Model
{
    use HasFactory;

    protected $fillable = [
        'datum',
        'napomena',
        'total',
        'kupacid',
        'zaposleniid',
    ];

    public function kupac()
    {
        return $this->belongsTo(Kupac::class, 'kupacid');
    }

    public function zaposleni()
    {
        return $this->belongsTo(Zaposleni::class, 'zaposleniid');
    }

    public function stavke()
    {
        return $this->hasMany(StavkeFakture::class, 'fakturaid', 'stavkefaktureid');
    }
    
    public function calculateTotal()
    {
        $total = $this->stavke()->sum('iznos');
        $this->total = $total;
        $this->save();
    }

    public function dodajStavku($sfid, $proizvod, $kolicina, $iznos, $brojFakture) {
        $stavka = $this->stavke()->create([
            'stavkefaktureid' => $sfid,
            'proizvodid' => $proizvod->proizvodid,
            'kolicina' => $kolicina,
            'iznos' => $iznos,
            'fakturaid' => $brojFakture
        ]);

        $this->calculateTotal();

        return $stavka;
    }


    //Metode


    public function postaviKupca($kupacID)
    {
        $k = Kupac::find($kupacID);
        
        if ($k) {
            $this->kupacid()->associate($k);
            $this->save();
        }
    }


    public function postaviZaposlenog($zaposleniID)
    {
        $z = Zaposleni::find($zaposleniID);
        
        if ($z) {
            $this->zaposleniid()->associate($z);
            $this->save();
        }
    }

    public function postaviDatum($datum)
    {
        $this->datum = $datum;
        $this->save();
    }

    public function postaviNapomenu($napomena)
    {
        $this->napomena = $napomena;
        $this->save();
    }

    public function dajUkupanIznos()
    {
        $ukupanIznos = 0.0;

        foreach ($this->stavke as $stavka) {
            $ukupanIznos += $stavka->iznos;
        }

        return $ukupanIznos;
    }

 


    // public function dodajStavku($proizvod, $kolicina, $iznos, $brojFakture) {
    //     $this->stavke()->create([
    //         'proizvodid' => $proizvod->proizvodid,
    //         'kolicina' => $kolicina,
    //         'iznos' => $iznos,
    //         'fakturaid'=>$brojFakture
    //     ]);
    // }






}
