<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KupacResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'kupacid' => $this->resource->kupacid,
            'ime' => $this->resource->ime,
            'prezime' => $this->resource->prezime,
            'adresa' => $this->resource->adresa,
           
           
        ];
    }
}
