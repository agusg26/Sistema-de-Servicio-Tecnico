<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class Sumacontroller extends Controller
{
    //
    public function index(){
        return Inertia::render('sumador',['resultado' => null,]);

    }

    public function calcular (Request $request){
        $request->validate([
            'num1' => 'required|numeric',
            'num2' => 'required|numeric',
        ]);
        $suma = (float) $request->input('num1') + (float) $request->input('num2');
        return Inertia::render('sumador',['resultado' => $suma,]);
    }
}
