<?php

namespace App\Http\Controllers;

use App\Models\Faktura;
use App\Models\Kupac;
use App\Models\Zaposleni;
use App\Models\StavkeFakture;
use App\Models\Proizvod;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class FakturaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fakture = Faktura::with(['kupac', 'zaposleni'])->get();
        
        return response()->json($fakture);
    }

    public function show(Faktura $faktura)
    {
        $faktura->load(['kupac', 'zaposleni']);
        
        return response()->json($faktura);
    }

    public function stavkeFakture($fakturaId)
    {
        $faktura = Faktura::with(['stavke.proizvod', 'stavke.faktura'])->find($fakturaId);
    
        if (!$faktura) {
            return response()->json(['message' => 'Faktura not found'], 404);
        }
    
        $stavkeFakture = $faktura->stavke;
    
        return response()->json($stavkeFakture);
    }




    public function store(Request $request)
    {
        Log::info('Request data:', $request->all());
        try {
            DB::beginTransaction();

            $validatedData = $request->validate([
                'datum' => 'required|date',
                'napomena' => 'nullable|string',
                'total' => 'required|numeric',
                'kupacid' => 'required|exists:kupacs,kupacid',
                'zaposleniid' => 'required|exists:zaposlenis,zaposleniid',
               
                'stavke.*.stavkefaktureid' => 'required|integer',

                'stavke.*.kolicina' => 'required|integer',
                'stavke.*.iznos' => 'required|numeric',
                'stavke.*.proizvodid' => 'required|integer',
            ]);
    
            
            $faktura = Faktura::create([
                'datum' => $validatedData['datum'],
                'napomena' => $validatedData['napomena'],
                'total' => $validatedData['total'],
                'kupacid' => $validatedData['kupacid'],
                'zaposleniid' => $validatedData['zaposleniid'],
            ]);

            $stavkeData = [];
    
            foreach ($validatedData['stavke'] as $stavka) {
                $stavkeData[] = [
                    'stavkefaktureid' => $stavka['stavkefaktureid'],

                    'fakturaid' => $faktura->id,
                    'kolicina' => $stavka['kolicina'],
                    'iznos' => $stavka['iznos'],
                    'proizvodid' => $stavka['proizvodid'],
                ];
            }
    
            
            StavkeFakture::insert($stavkeData);
    
            DB::commit();

            return response()->json(['message' => 'Faktura sa stavkama je kreirana'], 201);
        } catch (\Exception $e) {
            
            DB::rollBack();

            Log::info($e->getMessage());
            return response()->json(['message' => 'Greska kod kreiranja fakture'], 500);
        }
    }
    





    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            Log::info('Request data:', $request->all());

            $validatedData = $request->validate([
                'faktura.datum' => 'required|date',
                'faktura.napomena' => 'nullable|string',
                'faktura.total' => 'required|numeric',
                'faktura.kupacid' => 'required|integer|exists:kupacs,kupacid',
                'faktura.zaposleniid' => 'required|integer|exists:zaposlenis,zaposleniid',
                
            ]);

            Log::info("Validated : ", $validatedData);
            
            
             $validatedAddedStavke = $request->validate([
                'addedFakture.*.stavkefaktureid' => 'required|integer',

                'addedFakture.*.kolicina' => 'required|integer',
                'addedFakture.*.iznos' => 'required|numeric',
                'addedFakture.*.proizvodid' => 'required|integer',
            ]);

            
            Log::info("Validated added : ", $validatedAddedStavke);

            $validatedEditedStavke = $request->validate([
                'editedStavkeFakture.*.stavkefaktureid' => 'required|integer',
                'editedStavkeFakture.*.kolicina' => 'required|integer',
                'editedStavkeFakture.*.iznos' => 'required|numeric',
                'editedStavkeFakture.*.proizvodid' => 'required|integer',
            ]);
            
            Log::info("Validated edited : ", $validatedEditedStavke);

            $validatedDeletedStavke = $request->validate([
                'deletedStavkeFakture.*.stavkefaktureid' => 'required|integer',
                
            ]);
          
            Log::info("Validated deleted : ", $validatedDeletedStavke);

          
        $faktura = Faktura::findOrFail($id);

        if (!empty($validatedAddedStavke['addedFakture'])) {
            $added = [];
            foreach ($validatedAddedStavke['addedFakture'] as $stavka) {
                $added[] = [
                    'stavkefaktureid' => $stavka['stavkefaktureid'],
                    'fakturaid' => $faktura->id,
                    'kolicina' => $stavka['kolicina'],
                    'iznos' => $stavka['iznos'],
                    'proizvodid' => $stavka['proizvodid'],
                ];
            }
            StavkeFakture::insert($added);
        }

        if (!empty($validatedEditedStavke['editedStavkeFakture'])) {
            $edited = [];
            foreach ($validatedEditedStavke['editedStavkeFakture'] as $stavka) {
                $edited[] = [
                    'stavkefaktureid' => $stavka['stavkefaktureid'],
                    'fakturaid' => $faktura->id,
                    'kolicina' => $stavka['kolicina'],
                    'iznos' => $stavka['iznos'],
                    'proizvodid' => $stavka['proizvodid'],
                ];
            }
            StavkeFakture::upsert($edited, ['stavkefaktureid'], ['kolicina', 'iznos', 'proizvodid']);
        }

        if (!empty($validatedDeletedStavke['deletedStavkeFakture'])) {
            $deleted = [];
            foreach ($validatedDeletedStavke['deletedStavkeFakture'] as $stavka) {
                $deleted[] = $stavka['stavkefaktureid'];
            }
            StavkeFakture::whereIn('stavkefaktureid', $deleted)->delete();
        }

        $faktura->update($request->input('faktura'));
        
        DB::commit();

            return response()->json(['message' => 'Faktura je azurirana'], 200);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json(['message' => 'Faktura nije azurirana'], 500);
        }
    }
    
    
    protected function updateEditedStavke(Faktura $faktura, array $editedStavkeData)
    {
        foreach ($editedStavkeData as $stavka) {
            if (isset($stavka['stavkefaktureid'])) {

                StavkeFakture::where('stavkefaktureid', $stavka['stavkefaktureid'])
                    ->update([
                        'kolicina' => $stavka['kolicina'],
                        'iznos' => $stavka['iznos'],
                        'proizvodid' => $stavka['proizvodid'],
                    ]);
                }    
        }
    }

    protected function addStavke(Faktura $faktura, array $addedStavkeData)
    {
        $stavkeData = [];

        foreach ($addedStavkeData as $stavka) {
            $stavkeData[] = [
                'kolicina' => $stavka['kolicina'],
                'iznos' => $stavka['iznos'],
                'proizvodid' => $stavka['proizvodid'],
                'fakturaid' => $faktura->id,
            ];
        }

        Log::info("Added stavke : ", $addedStavkeData);

        StavkeFakture::insert($stavkeData);
        Log::info('Inserted stavke : ', $stavkeData);
    }

    protected function deleteStavke(array $deletedStavkeData)
    {
        $deletedStavkeFaktureIds = array_column($deletedStavkeData, 'stavkefaktureid');

        
        StavkeFakture::whereIn('stavkefaktureid', $deletedStavkeFaktureIds)->delete();
    }
     
  

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

 

    /**
     * Display the specified resource.
     */

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faktura $faktura)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faktura $faktura)
    {
        try {
            DB::beginTransaction();

            $faktura->stavke()->delete();
    
            $faktura->delete();
            
            DB::commit();
            
            return response()->json(['message' => 'Faktura i stavke su obrisane'], 200);
        } catch (\Exception $e) {
            
            DB::rollBack();

            return response()->json(['message' => 'Nije obrisana'], 500);
        }
    }
}
