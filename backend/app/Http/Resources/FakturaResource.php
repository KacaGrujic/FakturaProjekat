<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FakturaResource extends JsonResource
{
    public static $wrap = 'faktura';
    public function toArray($request)
    {

        return [
            'id' => $this->resource->id,
            'datum' => $this->resource->datum,
            'napomena' => $this->resource->napomena,
            'total' => $this->resource->total,
            'kupac' => new KupacResource($this->resource->kupac),
            'zaposleni' => new ZaposleniResource($this->resource->zaposleni)
        ];
    }
}
