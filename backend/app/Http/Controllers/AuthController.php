<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Log;

class AuthController extends Controller
{

    public function googleAuth(Request $request) {
        $googleToken = $request->token;

        // ✅ Validate Google Token
        $googleResponse = Http::get('https://www.googleapis.com/oauth2/v1/userinfo', [
            'access_token' => $googleToken,
        ]);

        Log::info($googleResponse);

        if (!$googleResponse->successful()) {
            return response()->json(['error' => 'Invalid Google Token'], 401);
        }

        $googleUser = $googleResponse->json();

        // ✅ Find or Create User
        $user = User::updateOrCreate(
            ['email' => $googleUser['email']],
            [
                'name' => $googleUser['name'],
                'google_id' => $googleUser['id'],
                'password' => bcrypt('123456'), // Dummy password
            ]
        );

        // ✅ Generate API Token
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'user' => $user]);
    }

    public function register(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['token' => $user->createToken('token')->plainTextToken], 201);
    }

    public function login(Request $request) {
        $user = User::where('email', $request->email)->first();

        Log::info($request->password);
        Log::info($request->email);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['token' => $user->createToken('token')->plainTextToken, 'user' => $user]);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
