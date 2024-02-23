<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KupacController;
use App\Http\Controllers\ProizvodController;
use App\Http\Controllers\ZaposleniController;
use App\Http\Controllers\FakturaController;
use App\Http\Controllers\StavkeFaktureController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::resource('kupac', KupacController::class);
Route::resource('proizvod', ProizvodController::class);
Route::resource('zaposleni', ZaposleniController::class);
Route::resource('faktura', FakturaController::class);


//rute za kupce
Route::get('/kupac', [KupacController::class, 'index']);
Route::get('/kupac/{id}', [KupacController::class, 'index']);
Route::post('/kupac', [KupacController::class, 'store']);
Route::delete('/kupac/{id}', [KupacController::class, 'destroy']);
Route::put('/kupac/{id}', [KupacController::class, 'update']);

//
Route::get('/proizvod', [ProizvodController::class, 'index']);
Route::get('/proizvod/{proizvodid}', [ProizvodController::class, 'show']);

//
Route::get('/zaposleni', [ZaposleniController::class, 'index']);
Route::get('/zaposleni/{id}', [ZaposleniController::class, 'index']);
Route::post('/zaposleni', [ZaposleniController::class, 'store']);
Route::delete('/zaposleni/{id}', [ZaposleniController::class, 'destroy']);
Route::put('/zaposleni/{id}', [ZaposleniController::class, 'update']);
//
Route::get('/stavkefakture', [StavkeFaktureController::class, 'index']);
Route::get('/faktura/{fakturaid}/stavkefakture', [StavkeFaktureController::class, 'getStavkeFaktureByFakturaId']);
Route::get('/stavkefakture/last-id', [StavkeFaktureController::class, 'getLastStavkeFaktureId']);
Route::get('/stavkefakture/lastUsedStavkeId', [StavkeFaktureController::class, 'getLastStavkeFaktureId']);

Route::post('/stavkefakture', [StavkeFaktureController::class, 'store']);
Route::delete('/stavkefakture/{id}', [StavkeFaktureController::class, 'destroy']);
Route::put('/stavkefakture/{id}', [StavkeFaktureController::class, 'update']);

//

Route::get('/faktura', [FakturaController::class, 'index']);
Route::get('/faktura/{fakturaid}/stavke', [FakturaController::class, 'stavkeFakture']);
Route::post('/faktura', [FakturaController::class, 'store']);
Route::put('/faktura/{fakturaid}', [FakturaController::class, 'update']);
Route::delete('/faktura/{id}', [FakturaController::class, 'destroy']);






Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
