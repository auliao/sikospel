<?php

namespace App\Http\Controllers;

use App\Models\Kos;
use App\Models\Room;
use App\Models\TypeKamar;
use App\Models\RoomImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;

class AdminKamarController extends Controller
{
    public function index()
    {
        $rooms = Room::with(['kos.owner.user', 'typeKamar', 'images'])->get();
        $kos = Kos::with('owner.user')->get();
        $typeKamars = TypeKamar::all();
        
        return Inertia::render('Admin/Room/Index', [
            'rooms' => $rooms,
            'kos' => $kos,
            'typeKamars' => $typeKamars,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kos_id' => 'required|exists:kos,id',
            'room_number' => 'required|string|max:255',
            'type_kamar_id' => 'required|exists:type_kamars,id',
            'status' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $imageStart = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $imageStart->getClientOriginalExtension();
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($imageStart);
            
            if ($image->width() > 800) {
                $image->scale(width: 800);
            }
            
            $path = 'room-images/' . $imageName;
            $encoded = $image->toJpeg(quality: 80); 
            
            Storage::disk('public')->put($path, (string) $encoded);
            
            $data['image'] = $path;
        }

        Room::create($data);

        return redirect()->back()->with('success', 'Kamar berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'kos_id' => 'required|exists:kos,id',
            'room_number' => 'required|string|max:255',
            'type_kamar_id' => 'required|exists:type_kamars,id',
            'status' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $room = Room::findOrFail($id);
        $data = $request->all();

        if ($request->hasFile('image')) {
            if ($room->image) {
                Storage::disk('public')->delete($room->image);
            }

            $imageStart = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $imageStart->getClientOriginalExtension();
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($imageStart);
            
            if ($image->width() > 800) {
                $image->scale(width: 800);
            }
            
            $path = 'room-images/' . $imageName;
            $encoded = $image->toJpeg(quality: 80); 
            
            Storage::disk('public')->put($path, (string) $encoded);
            
            $data['image'] = $path;
        }

        $room->update($data);

        return redirect()->back()->with('success', 'Kamar berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        
        // Delete images from storage
        foreach ($room->images as $image) {
            Storage::disk('public')->delete($image->gambar);
            $image->delete();
        }
        
        $room->delete();

        return redirect()->back()->with('success', 'Kamar berhasil dihapus.');
    }
}