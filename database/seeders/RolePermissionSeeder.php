<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        //Creacion de roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $tecnicoRole = Role::firstOrCreate(['name' => 'tecnico']);

        $permisos = [
            'usuarios.crear',
            'usuarios.editar',
            'usuarios.borrar',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }

        $superAdminRole->syncPermissions(Permission::all());

        $adminRole->syncPermissions([
            'usuarios.crear',
            'usuarios.editar',
            'usuarios.borrar',
        ]);
    }
}
