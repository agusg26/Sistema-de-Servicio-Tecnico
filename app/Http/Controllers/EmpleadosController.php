<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class EmpleadosController extends Controller
{
    /**
     * Display a listing of employees (users).
     */
    public function index()
    {
        $empleados = User::with('roles')
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn(User $user) => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->roles->first()?->name ?? 'tecnico',
                'roles'      => $user->getRoleNames()->values()->all(),
                'created_at' => $user->created_at?->toISOString(),
            ]);

        $roles = Role::orderBy('id')->pluck('name')->values()->all();

        return Inertia::render('Empleados/Index', [
            'empleados' => $empleados,
            'roles'     => ! empty($roles) ? $roles : ['tecnico', 'admin', 'super admin'],
        ]);
    }

    /**
     * Update the role of the specified employee.
     */
    public function update(Request $request, User $empleado)
    {
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $empleado->syncRoles([$validated['role']]);

        return redirect()->route('empleados.index')
            ->with('success', 'Rol del empleado actualizado correctamente.');
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Request $request, User $empleado)
    {
        if ((int) $request->user()?->id === (int) $empleado->id) {
            return redirect()->back()->withErrors([
                'empleado' => 'No puedes eliminar tu propia cuenta de usuario.',
            ]);
        }

        Equipo::where('user_id', $empleado->id)->update(['user_id' => null]);

        $empleado->delete();

        return redirect()->route('empleados.index')
            ->with('success', 'Empleado eliminado correctamente.');
    }
}
