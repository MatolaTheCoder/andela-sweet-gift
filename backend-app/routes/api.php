<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EncomendaController;
use App\Http\Controllers\ProdutoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::apiResource('products', ProdutoController::class)->middleware('auth:sanctum');
Route::apiResource('encomenda', EncomendaController::class)->middleware('auth:sanctum');
