<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKamarController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Kamar/Index');
    }

    public function store(Request $request)
    {
        // Logic to store a new room
        $request->validate([
            'kos_id' => 'required|exists:kos,id',
            'room_number' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric',
            'is_available' => 'required|boolean',
        ]);
        // Room::create($request->all());
        return redirect()->back()->with('success', 'Room created successfully.');
    }

    public function update(Request $request, $id)
    {
        // Logic to update an existing room
        $request->validate([
            'kos_id' => 'required|exists:kos,id',
            'room_number' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric',
            'is_available' => 'required|boolean',
        ]);
        // $room = Room::findOrFail($id);
        // $room->update($request->all());
        return redirect()->back()->with('success', 'Room updated successfully.');
    }

    public function destroy($id)
    {
        // Logic to delete a room
        // $room = Room::findOrFail($id);
        // $room->delete();
        return redirect()->back()->with('success', 'Room deleted successfully.');
    }
}
