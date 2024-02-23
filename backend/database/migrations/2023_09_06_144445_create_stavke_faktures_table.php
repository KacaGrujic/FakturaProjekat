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
        Schema::create('stavke_faktures', function (Blueprint $table) {
            $table->unsignedInteger('stavkefaktureid')->primary(); 
            $table->integer('kolicina');
            $table->decimal('iznos', 8, 2);
            $table->foreignId('proizvodid')->constrained('proizvods');
            $table->foreignId('fakturaid')->constrained('fakturas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stavke_faktures');
    }
};
