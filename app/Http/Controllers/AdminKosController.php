<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKosController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Kos/Index');
    }

    public function store(Request $request)
    {
        // Logic to store a new kos
        $request->validate([
            'owner_id' => 'required|exists:pemilik,user_id',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
        ]);
        // Kos::create($request->all());
        return redirect()->back()->with('success', 'Kos created successfully.');
    }

    public function update(Request $request, $id)
    {
        // Logic to update an existing kos
        $request->validate([
            'owner_id' => 'required|exists:pemilik,user_id',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
        ]);
        // $kos = Kos::findOrFail($id);
        // $kos->update($request->all());
        return redirect()->back()->with('success', 'Kos updated successfully.');
    }

    public function destroy($id)
    {
        // Logic to delete a kos
        // $kos = Kos::findOrFail($id);
        // $kos->delete();
        return redirect()->back()->with('success', 'Kos deleted successfully.');
    }
}
