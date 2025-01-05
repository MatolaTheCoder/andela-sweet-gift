<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Encomenda extends Model
{
    /** @use HasFactory<\Database\Factories\EncomendaFactory> */
    use HasFactory;
    protected $fillable = [
        'id_produto',
        'id_usuario',
        'solicitante',
        'destinatario',
        'quantidade',
        'valor',
        'endereco_destinatario',
        'data_criacao',
        'data_entrega',
    ];
}
