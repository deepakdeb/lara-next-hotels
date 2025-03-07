<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Hotel;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class HotelController extends Controller
{
    private $imageDirectory = 'hotels';

    /**
     * Display a paginated list of hotels.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $hotels = Hotel::paginate(8);

            $hotels->getCollection()->transform(function ($hotel) {
                $hotel->image_url = $hotel->image ? asset('storage/' . $hotel->image) : null;
                return $hotel;
            });

            return response()->json($hotels);
        } catch (Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified hotel.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $hotel = Hotel::findOrFail($id);

            $hotel->image_url = $hotel->image ? asset('storage/' . $hotel->image) : null;

            return response()->json($hotel);
        } catch (Exception $e) {
            return response()->json(['message' => 'Hotel not found.', 'error' => $e->getMessage()], 404);
        }
    }

    /**
     * Store a newly created hotel in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'cost_per_night' => 'required|numeric|min:0',
                'available_rooms' => 'required|integer|min:0',
                'average_rating' => 'nullable|numeric|min:0|max:5',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $imagePath = $this->handleImageUpload($request->file('image'));

            $hotel = Hotel::create([
                'name' => $request->name,
                'address' => $request->address,
                'cost_per_night' => $request->cost_per_night,
                'available_rooms' => $request->available_rooms,
                'average_rating' => $request->average_rating ?? 0,
                'image' => $imagePath,
            ]);

            return response()->json($hotel, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified hotel in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $hotel = Hotel::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'cost_per_night' => 'required|numeric|min:0',
                'available_rooms' => 'required|integer|min:0',
                'average_rating' => 'nullable|numeric|min:0|max:5',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            if ($request->hasFile('image')) {
                $this->deleteImage($hotel->image);
                $hotel->image = $this->handleImageUpload($request->file('image'));
            }

            $hotel->update([
                'name' => $request->name,
                'address' => $request->address,
                'cost_per_night' => $request->cost_per_night,
                'available_rooms' => $request->available_rooms,
                'average_rating' => $request->average_rating ?? $hotel->average_rating,
            ]);

            return response()->json($hotel);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified hotel from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $hotel = Hotel::findOrFail($id);

            $this->deleteImage($hotel->image);

            $hotel->delete();

            return response()->json(['message' => 'Hotel deleted successfully.']);
        } catch (Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle image upload.
     *
     * @param \Illuminate\Http\UploadedFile|null $image
     * @return string|null
     */
    private function handleImageUpload($image)
    {
        if (!$image) {
            return null;
        }

        $fileName = Str::random(40) . '.' . $image->getClientOriginalExtension();
        return $image->storeAs($this->imageDirectory, $fileName, 'public');
    }

    /**
     * Delete an image from storage.
     *
     * @param string|null $imagePath
     * @return void
     */
    private function deleteImage($imagePath)
    {
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
    }
}