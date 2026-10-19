<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserandRolesAsigned extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        User::firstOrCreate(
            ['email' => 'example@gmail.com'],
            [
                'name' => 'Agustin Ezequiel',
                'password' => bcrypt('12345678'),
            ]
        )->assignRole('super admin');

        User::firstOrCreate(
            ['email' => 'Martinadmin@gmail.com'],
            [
                'name' => 'Martin Carabajal',
                'password' => bcrypt('12345678'),
            ]
        )->assignRole('admin');

        User::firstOrCreate(
            ['email' => 'lucianoTecnico@gmail.com'],
            [
                'name' => 'Luciano Gutierrez',
                'password' => bcrypt('12345678'),
            ]
        )->assignRole('tecnico');
        User::firstOrCreate(
            ['email' => 'MarianoTecnico@gmail.com'],
            [
                'name' => 'Mariano Martinez',
                'password' => bcrypt('12345678'),
            ]
        )->assignRole('tecnico');
        User::firstOrCreate(
            ['email' => 'LeonelTecnico@gmail.com'],
            [
                'name' => 'Leonel Flores',
                'password' => bcrypt('12345678'),
            ]
        )->assignRole('tecnico');
    }
}
