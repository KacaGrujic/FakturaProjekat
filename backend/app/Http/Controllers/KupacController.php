<?php

namespace App\Http\Controllers;

use App\Models\Kupac;
use Illuminate\Http\Request;
use App\Http\Resources\KupacResource;

class KupacController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kupci = Kupac::all();
    
        return response()->json($kupci);
    }

   
    

    /**
     * Display the specified resource.
     */
    
     public function store(Request $request)
     {
         $validatedData = $request->validate([
             'ime' => 'required|string|max:255',
             'prezime' => 'required|string|max:255',
             'adresa' => 'required|string|max:255',
         ]);
     
         $kupac = Kupac::create($validatedData);
     
         return response()->json($kupac, 201);
     }
    /**
     * Show the form for editing the specified resource.
     */


     public function show($kupacid)
     {
         //
         return new KupacResource(Kupac::find($kupacid));
     }

    public function edit(Kupac $kupac)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $kupacid)
    {
        $kupac = Kupac::find($kupacid);
    
        if (!$kupac) {
            return response()->json(['message' => 'Kupac nije nadjen'], 404);
        }
    
        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'adresa' => 'required|string|max:255',
        ]);
    
        $kupac->update($validatedData);
    
        return response()->json(['message' => 'Kupac je izmenjen', 'kupac' => $kupac]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($kupacid)
{
    $kupac = Kupac::findOrFail($kupacid);
    $kupac->delete();
    return response()->json(['message' => 'Kupac je obrisan']);
}



}
