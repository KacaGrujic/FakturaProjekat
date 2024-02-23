<?php

namespace App\Http\Controllers;

use App\Models\Proizvod;
use App\Http\Resources\ProizvodResource;

use Illuminate\Http\Request;

class ProizvodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $proizvods = Proizvod::all();
    
        return response()->json($proizvods);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        return new ProizvodResource(Proizvod::find($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proizvod $proizvod)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Proizvod $proizvod)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proizvod $proizvod)
    {
        //
    }
}
