<?php

use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HotelController;


Route::post('/auth/google', [AuthController::class, 'googleAuth']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:api')->group(function () {
    Route::get('/hotels', [HotelController::class, 'index']);
    Route::post('/hotels', [HotelController::class, 'store']);
    Route::post('/hotels/{id}', [HotelController::class, 'update']);
    Route::get('/hotels/{id}', [HotelController::class, 'get']);
    Route::delete('/hotels/{id}', [HotelController::class, 'destroy']);
});
