<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StavkeFaktureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'stavkefaktureid' => $this->resource->stavkefaktureid,
            'kolicina' => $this->resource->kolicina,
            'iznos' => $this->resource->iznos,
            'proizvod' => new ProizvodResource($this->resource->proizvod),
            'faktura' => new FakturaResource($this->resource->faktura)
        ];

    }
}
