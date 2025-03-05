<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Hotel;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;

class HotelController extends Controller
{
    private $imageDirectory = 'hotels'; // Directory inside storage/app/public

    public function index()
    {
        $hotels = Hotel::paginate(8);

        $hotels->getCollection()->transform(function ($hotel) {
            if ($hotel->image) {
                $hotel->image_url = asset('storage/' . $hotel->image);
            } else {
                $hotel->image_url = null;
            }
            return $hotel;
        });

        return response()->json($hotels);
    }

    public function get($id)
    {
        $hotel = Hotel::find($id);

        if ($hotel && $hotel->image) {
            $hotel->image_url = asset('storage/' . $hotel->image);
        }

        return response()->json($hotel);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'address' => 'required',
                'cost_per_night' => 'required|numeric',
                'available_rooms' => 'required|integer',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'average_rating' => 'numeric',
            ]);

            $imagePath = null;
            if ($request->filled('image')) {
                $file = $request->file('image');
                $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();
                $imagePath = $file->storeAs($this->imageDirectory, $fileName, 'public');
            }

            $hotel = Hotel::create([
                'name' => $request->name,
                'address' => $request->address,
                'cost_per_night' => $request->cost_per_night,
                'available_rooms' => $request->available_rooms,
                'average_rating' => $request->average_rating,
                'image' => $imagePath,
            ]);

            return response()->json($hotel, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $hotel = Hotel::findOrFail($id);

            $request->validate([
                'name' => 'required',
                'address' => 'required',
                'cost_per_night' => 'required|numeric',
                'available_rooms' => 'required|integer',
                'average_rating' => 'numeric',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
            ]);

            if ($request->filled('image')) {
                if ($hotel->image && Storage::disk('public')->exists($hotel->image)) {
                    Storage::disk('public')->delete($hotel->image);
                }
                $file = $request->file('image');
                $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();
                $hotel->image = $file->storeAs($this->imageDirectory, $fileName, 'public');
            }

            $hotel->update(Arr::except($request->all(), ['image']));

            return response()->json($hotel);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $hotel = Hotel::findOrFail($id);
            if ($hotel->image && Storage::disk('public')->exists($hotel->image)) {
                Storage::disk('public')->delete($hotel->image);
            }
            $hotel->delete();
            return response()->json(['message' => 'Hotel deleted']);
        } catch (Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }
}