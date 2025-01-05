<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    /** @use HasFactory<\Database\Factories\ProdutoFactory> */
    use HasFactory;
    protected $fillable = ['id_usuario', 'nome', 'descricao', 'preco', 'data_criacao'];
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
