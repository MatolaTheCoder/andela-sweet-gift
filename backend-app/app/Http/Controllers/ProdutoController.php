<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Produto::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'nome' => 'required|string',
            'descricao' => 'required|string',
            'preco' => 'required|numeric',
            'data_criacao' => 'required|date',
        ]);
        $fields['id_usuario'] = auth()->id();
        $produto = Produto::create($fields);
        return response()->json(['produto'=>$produto,'success' => true], 20);
    }

    /**
     * Display the specified resource.
     */
    public function show(Produto $produto)
    {
        $produto->usuario;
        return $produto;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProdutoRequest $request, Produto $produto)
    {
        $produto->update($request->all());
        return response()->json(['produto'=>$produto, 'success' => true], 200, );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produto $produto)
    {
        $produto->delete();
        return response()->json(['success'=>true], 204);
    }
}
