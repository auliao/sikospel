import React from 'react';
import { Head } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Room',
        href: '/admin/room',
    },
];

interface Room {
    id: number;
    room_number: string;
    monthly_rate: number;
    status: string;
    description: string | null;
    kos: {
        name: string;
        owner: {
            name: string;
        };
    };
}

interface Props {
    rooms: Room[];
}

export default function Index({ rooms }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Room" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Daftar Kamar</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead className="bg-[#664229]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Nomor Kamar</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Kos</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Harga Bulanan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rooms.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.room_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kos.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {item.monthly_rate.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex justify-end">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-blue-500 hover:text-blue-500 mr-2"
                                                    >
                                                        <Edit />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-500"
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
