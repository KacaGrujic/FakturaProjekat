<?php

namespace Database\Seeders;
use App\Models\Kupac;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class KupacSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $k1 = new Kupac();
        $k1->ime = "Pera";
        $k1->prezime = "Peric";
        $k1->adresa = "Adresa 1";
        $k1->save();
    }
}
