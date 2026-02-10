<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPenghuniController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Penghuni/Index');
    }

    public function store(Request $request)
    {
        // Logic to store a new penghuni
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'room_id' => 'required|exists:rooms,id',
            'move_in_date' => 'required|date',
        ]);
        // Penghuni::create($request->all());
        return redirect()->back()->with('success', 'Penghuni created successfully.');
    }

    public function update(Request $request, $id)
    {
        // Logic to update an existing penghuni
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'room_id' => 'required|exists:rooms,id',
            'move_in_date' => 'required|date',
        ]);
        // $penghuni = Penghuni::findOrFail($id);
        // $penghuni->update($request->all());
        return redirect()->back()->with('success', 'Penghuni updated successfully.');
    }

    public function destroy($id)
    {
        // Logic to delete a penghuni
        // $penghuni = Penghuni::findOrFail($id);
        // $penghuni->delete();
        return redirect()->back()->with('success', 'Penghuni deleted successfully.');
    }
}
