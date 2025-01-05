<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('encomendas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_produto')->references('id')->on('produtos');
            $table->foreignId('id_usuario')->references('id')->on('users');
            $table->string('solicitante');
            $table->string('destinatario');
            $table->decimal('quantidade', 10, 2);
            $table->decimal('valor', 10, 2);
            $table->string('endereco_destinatario');
            $table->dateTime('data_criacao');
            $table->dateTime('data_entrega');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encomendas');
    }
};
