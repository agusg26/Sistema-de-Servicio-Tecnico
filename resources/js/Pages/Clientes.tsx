import React from 'react';
import { MainLayout } from '@/Layouts/MainLayout';
import ShowClients from '@/Components/Clientes/showClients';
import { Cliente } from '@/Components/Clientes/showClients';

interface ClientesProps {
    clientes: Cliente[];
}

export default function Clientes({ clientes }: ClientesProps) {
    return (
        <MainLayout>
            <div style={{ padding: '20px' }}>
                <ShowClients clientes={clientes} />
            </div>
        </MainLayout>
    );
}