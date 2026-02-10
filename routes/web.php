<?php

use App\Http\Controllers\AdminPendaftaranKosController;
use App\Http\Controllers\AdminRoleController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\PublicPendaftaranKosController;
use App\Models\Kos;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $kos = Kos::with('rooms')->get();

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'kos' => $kos,
    ]);
})->name('home');

Route::get('pendaftaran-kos', [PublicPendaftaranKosController::class, 'create'])->name('public.pendaftaran-kos.create');
Route::post('pendaftaran-kos', [PublicPendaftaranKosController::class, 'store'])->name('public.pendaftaran-kos.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('admin')->group(function () {
        Route::resource('roles', AdminRoleController::class);
        Route::resource('users', AdminUserController::class);
        Route::resource('pendaftaran-kos', AdminPendaftaranKosController::class);
        Route::resource('penghuni', AdminPenghuniController::class);
        Route::resource('pemilik', AdminPemilikController::class);
        Route::resource('kos', AdminKosController::class);
        Route::resource('room', AdminKamarController::class);
    });
});


require __DIR__.'/settings.php';
