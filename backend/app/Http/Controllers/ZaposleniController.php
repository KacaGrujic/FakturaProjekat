<?php

namespace App\Http\Controllers;

use App\Models\Zaposleni;
use Illuminate\Http\Request;
use App\Http\Resources\ZaposleniResource;


class ZaposleniController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $zaposleni = Zaposleni::all();
        return Zaposleni::all();
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
        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'adresa' => 'required|string|max:255',
            'brojtelefona' => 'required|string|max:255'
        ]);
    $zaposleni = Zaposleni::create($validatedData);
    
    return response()->json($zaposleni, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        return new ZaposleniResource(Zaposleni::find($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Zaposleni $zaposleni)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $zaposleniid)
    {
        $zaposleni = Zaposleni::find($zaposleniid);

        if(!$zaposleni){
            return response()->json(['message' => 'Zaposleni nije pronadjen'], 404);
        }

        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'adresa' => 'required|string|max:255',
            'brojtelefona' => 'required|string|max:255'
        ]); 

        $zaposleni->update($validatedData);

        return response()->json(['message' => 'Zaposleni je izmenjen']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($zaposleniid)
    {
        $zaposleni = Zaposleni::findOrFail($zaposleniid);
        $zaposleni->delete();
        return response()->json(['message' => 'Zaposleni je obrisan']);
    }
}
