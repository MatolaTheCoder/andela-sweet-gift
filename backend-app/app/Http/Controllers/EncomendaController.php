<?php

namespace App\Http\Controllers;

use App\Models\Encomenda;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEncomendaRequest;
use App\Http\Requests\UpdateEncomendaRequest;
use Illuminate\Http\Request;

class EncomendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Encomenda::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'id_produto' => 'required',
            'solicitante' => 'required',
            'destinatario' => 'required',
            'quantidade' => 'required',
            'valor' => 'required',
            'endereco_destinatario' => 'required',
            'data_criacao' => 'required',
            'data_entrega' => 'required',
        ]);
        $fields['id_usuario'] = auth()->user()->id;

        $encomenda = Encomenda::create($fields);

        return response()->json(['encomenda'=>$encomenda],200, ['success'=>true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Encomenda $encomenda)
    {
        return $encomenda;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Encomenda $encomenda)
    {
        $encomenda->update($request->all());
        return response()->json(['encomenda'=>$encomenda],200, ['success'=>true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Encomenda $encomenda)
    {
        $encomenda->delete();
        return response()->json(['success'=>true], 200);
    }
}
