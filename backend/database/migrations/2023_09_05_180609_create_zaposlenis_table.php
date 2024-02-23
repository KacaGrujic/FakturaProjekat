<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('zaposlenis', function (Blueprint $table) {
            $table->id('zaposleniid');
            $table->string('ime');
            $table->string('prezime');
            $table->string('email');
            $table->string('adresa');
            $table->string('brojtelefona');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zaposlenis');
    }
};
