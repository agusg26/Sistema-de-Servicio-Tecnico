import React from 'react';
import { useForm } from '@inertiajs/react';
import ShowComputers from '@/Components/showComputers';
import { Filter } from 'lucide-react';
import ProductFilters from '@/Components/filter';
import { MainLayout } from '@/Layouts/MainLayout';

// Tipamos las props que llegan desde Laravel
interface EquiposProps {
    resultado?: number | null;
}

export default function Equipos({ resultado }: EquiposProps) {
    // useForm maneja los inputs y la petición HTTP a Laravel
    const { data, setData, post, processing, errors } = useForm({
        num1: '',
        num2: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Enviamos los datos por POST a la ruta que definimos en Laravel
        post('/sumar');
    };

    return (
        <MainLayout>
            <div style={{ padding: '20px' }}>

                <ShowComputers />

            </div>
        </MainLayout>
    );
}