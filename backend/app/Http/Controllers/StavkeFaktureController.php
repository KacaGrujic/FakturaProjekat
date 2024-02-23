<?php

namespace App\Http\Controllers;

use App\Models\StavkeFakture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StavkeFaktureController extends Controller
{

    public function updateEditedStavke($faktura, $editedStavkeData)
    {
        try {
            DB::beginTransaction();

            foreach ($editedStavkeData as $stavka) {
                $stavkeFakture = StavkeFakture::findOrFail($stavka['stavkefaktureid']);
                $stavkeFakture->update([
                    'kolicina' => $stavka['kolicina'],
                    'iznos' => $stavka['iznos'],
                    'proizvodid' => $stavka['proizvodid'],
                ]);
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function addStavke($faktura, $addedStavkeData)
    {
        try {
            DB::beginTransaction();

            foreach ($addedStavkeData as $stavka) {
                StavkeFakture::create([
                    'fakturaid' => $faktura->id,
                    'kolicina' => $stavka['kolicina'],
                    'iznos' => $stavka['iznos'],
                    'proizvodid' => $stavka['proizvodid'],
                ]);
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function deleteStavke($deletedStavkeData)
    {
        try {
            DB::beginTransaction();

            foreach ($deletedStavkeData as $stavka) {
                StavkeFakture::findOrFail($stavka['stavkefaktureid'])->delete();
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stavka = StavkeFakture::with(['proizvod', 'faktura'])->get();
        
        return response()->json($stavka);
    }

    public function show(StavkeFakture $s)
    {
        $s->load(['proizvod', 'faktura']);
        
        return response()->json($s);
    }

    public function getById($sfid)
    {
        $stavka = StavkeFakture::findOrFail($sfid);

        return new StavkeFaktureResource($stavka);

    }


    public function getLastStavkeFaktureId()
    {
        try {
            // Query the database to find the maximum stavkefaktureid
            $lastId = StavkeFakture::max('stavkefaktureid');

            // Return the last used stavkefaktureid as JSON
            return response()->json(['last_stavkefaktureid' => $lastId]);
        } catch (\Exception $e) {
            \Log::error('Error fetching last stavkefaktureid: ' . $e->getMessage());

            // Return an error response
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


    public function getStavkeFaktureByFakturaId($fakturaid)
    {
        try {
            
            $stavke = StavkeFakture::with('proizvod')->where('fakturaid', $fakturaid)->get();
    
            return response()->json($stavke);
        } catch (\Exception $e) {
            \Log::error('Error fetching stavkefakture data: ' . $e->getMessage());
    
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                // 'stavkefaktureid' => 'required|integer|unique:stavkefaktures,stavkefaktureid',
                'kolicina' => 'required|integer',
                'iznos' => 'required|numeric',
                'proizvodid' => 'required|integer|exists:proizvods,id', 
                'fakturaid' => 'required|integer|exists:fakturas,id', 
            ]);
    
            $stavkeFakture = StavkeFakture::create($validatedData);
    
            return response()->json(['message' => 'StavkeFakture created successfully', 'data' => $stavkeFakture], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create StavkeFakture'], 500);
        }
    }
    

    /**
     * Display the specified resource.
     */


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StavkeFakture $stavkeFakture)
    {
        //
    }

    public function update(Request $request, $id)
{
    try {
        $stavkeFakture = StavkeFakture::findOrFail($id);

        $validatedData = $request->validate([
            'stavkefaktureid' => 'required|integer|exists:stavkefaktures,stavkefaktureid',
            'kolicina' => 'required|integer',
            'iznos' => 'required|numeric',
            'proizvodid' => 'required|integer|exists:proizvods,id', 
            'fakturaid' => 'required|integer|exists:fakturas,id', 
        ]);

        
        $stavkeFakture->kolicina = $validatedData['kolicina'];
        $stavkeFakture->iznos = $validatedData['iznos'];
        $stavkeFakture->proizvodid = $validatedData['proizvodid'];

        
        $stavkeFakture->save();

        return response()->json(['message' => 'StavkeFakture updated successfully', 'data' => $stavkeFakture], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to update StavkeFakture'], 500);
    }
}

    
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $stavkeFakture = StavkeFakture::findOrFail($id);
            $stavkeFakture->delete();
    
            return response()->json(['message' => 'StavkeFakture deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete StavkeFakture'], 500);
        }
    }
    
}
