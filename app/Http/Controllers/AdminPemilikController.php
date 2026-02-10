<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPemilikController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pemilik/Index');
    }

    public function store(Request $request)
    {
        // Logic to store a new pemilik
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'contact_info' => 'required|string|max:500',
        ]);
        // Pemilik::create($request->all());
        return redirect()->back()->with('success', 'Pemilik created successfully.');
    }

    public function update(Request $request, $id)
    {
        // Logic to update an existing pemilik
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'contact_info' => 'required|string|max:500',
        ]);
        // $pemilik = Pemilik::findOrFail($id);
        // $pemilik->update($request->all());
        return redirect()->back()->with('success', 'Pemilik updated successfully.');
    }

    public function destroy($id)
    {
        // Logic to delete a pemilik
        // $pemilik = Pemilik::findOrFail($id);
        // $pemilik->delete();
        return redirect()->back()->with('success', 'Pemilik deleted successfully.');
    }
}
