<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Log;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller {
    public function register(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        return response()->json(['success' => true], 201);
    }
    // Login User and Return Access & Refresh Token
    public function login(Request $request) {
        $credentials = $request->only('email', 'password');

        

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        

        return response()->json([
            'access_token' => $token,
            'refresh_token' => JWTAuth::claims(['refresh' => true])->fromUser($user),
            'token_type' => 'Bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => $user
        ]);
    }

    // Google Auth Handling
    public function googleAuth(Request $request) {
        $googleToken = $request->token;
        $googleResponse = Http::get('https://www.googleapis.com/oauth2/v1/userinfo', [
            'access_token' => $googleToken,
        ]);

        if (!$googleResponse->successful()) {
            return response()->json(['error' => 'Invalid Google Token'], 401);
        }

        $googleUser = $googleResponse->json();
        $user = User::updateOrCreate(
            ['email' => $googleUser['email']],
            [
                'name' => $googleUser['name'],
                'google_id' => $googleUser['id'],
                'password' => bcrypt('123456'),
            ]
        );

        return response()->json([
            'access_token' => JWTAuth::fromUser($user),
            'refresh_token' => JWTAuth::claims(['refresh' => true])->fromUser($user),
            'token_type' => 'Bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => $user
        ]);
    }

    // Refresh Token Endpoint
    public function refreshToken(Request $request) {
        try {
            $newToken = JWTAuth::refresh();
            return response()->json([
                'access_token' => $newToken,
                'token_type' => 'Bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Token refresh failed'], 401);
        }
    }

    // Logout User
    public function logout(Request $request) {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out']);
    }
}
