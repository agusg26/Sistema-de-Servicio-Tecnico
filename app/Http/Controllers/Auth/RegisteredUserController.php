<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        /** @var User|null $currentUser */
        $currentUser = $request->user();
        if (! $currentUser || ! $currentUser->hasRole(['admin', 'super admin'])) {
            abort(403, 'No tienes permiso para crear nuevos usuarios.');
        }

        $roles = Role::orderBy('id')->pluck('name')->values()->all();

        return Inertia::render('Auth/Register', [
            'roles' => ! empty($roles) ? $roles : ['tecnico', 'admin', 'super admin'],
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        /** @var User|null $currentUser */
        $currentUser = $request->user();
        if (! $currentUser || ! $currentUser->hasRole(['admin', 'super admin'])) {
            abort(403, 'No tienes permiso para crear nuevos usuarios.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'role' => 'required|string|exists:roles,name',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        event(new Registered($user));

        return redirect(route('equipos.index', absolute: false))
            ->with('success', 'Usuario creado y rol asignado correctamente.');
    }
}
