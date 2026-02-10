import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Eye, Edit, Trash } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penghuni',
        href: '/admin/penghuni',
    },
];

interface Penghuni {
    id: number;
    user_id: number;
    name: string;
    no_wa: string | null;
    address: string | null;
    religion: string | null;
    file_path_kk: string | null;
    file_path_ktp: string | null;
    user: {
        email: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    penghuni: Penghuni[];
    users: User[];
}

export default function Index({ penghuni, users }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPenghuni, setEditingPenghuni] = useState<Penghuni | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        name: '',
        no_wa: '',
        address: '',
        religion: '',
        file_path_kk: null as File | null,
        file_path_ktp: null as File | null,
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        user_id: '',
        name: '',
        no_wa: '',
        address: '',
        religion: '',
        file_path_kk: null as File | null,
        file_path_ktp: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/penghuni', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                window.location.reload();
            },
        });
    };

    const handleEdit = (item: Penghuni) => {
        setEditingPenghuni(item);
        setEditData({
            user_id: item.user_id.toString(),
            name: item.name,
            no_wa: item.no_wa || '',
            address: item.address || '',
            religion: item.religion || '',
            file_path_kk: null,
            file_path_ktp: null,
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/penghuni/${editingPenghuni?.user_id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                resetEdit();
                setEditingPenghuni(null);
                window.location.reload();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus penghuni ini?')) {
            router.delete(`/admin/penghuni/${id}`, {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penghuni" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Daftar Penghuni</h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#664229] hover:bg-[#4a2f1d] text-white font-bold py-2 px-4 rounded"
                            >
                                Tambah Penghuni
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead className="bg-[#664229]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">No. WA</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Alamat</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Agama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider border-b border-gray-300">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {penghuni.map((item) => (
                                        <tr key={item.user_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.user_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no_wa || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.address || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.religion || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-2"><Eye className="w-4 h-4" /></button>
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></button>
                                                <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(item.user_id)}><Trash className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Penghuni</h3>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">User</label>
                                        <select
                                            value={data.user_id}
                                            onChange={e => setData('user_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Pilih User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">No. WA</label>
                                        <input
                                            type="text"
                                            value={data.no_wa}
                                            onChange={e => setData('no_wa', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.no_wa && <p className="text-red-500 text-sm">{errors.no_wa}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                        <textarea
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Agama</label>
                                        <input
                                            type="text"
                                            value={data.religion}
                                            onChange={e => setData('religion', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.religion && <p className="text-red-500 text-sm">{errors.religion}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">File KK</label>
                                        <input
                                            type="file"
                                            onChange={e => setData('file_path_kk', e.target.files ? e.target.files[0] : null)}
                                            className="mt-1 block w-full"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        {errors.file_path_kk && <p className="text-red-500 text-sm">{errors.file_path_kk}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">File KTP</label>
                                        <input
                                            type="file"
                                            onChange={e => setData('file_path_ktp', e.target.files ? e.target.files[0] : null)}
                                            className="mt-1 block w-full"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        {errors.file_path_ktp && <p className="text-red-500 text-sm">{errors.file_path_ktp}</p>}
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-[#664229] text-white rounded-md hover:bg-[#4a2f1d] disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {isEditModalOpen && editingPenghuni && (
                    <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Penghuni</h3>
                                <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">User</label>
                                        <select
                                            value={editData.user_id}
                                            onChange={e => setEditData('user_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Pilih User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                        {editErrors.user_id && <p className="text-red-500 text-sm">{editErrors.user_id}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={e => setEditData('name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        />
                                        {editErrors.name && <p className="text-red-500 text-sm">{editErrors.name}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">No. WA</label>
                                        <input
                                            type="text"
                                            value={editData.no_wa}
                                            onChange={e => setEditData('no_wa', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {editErrors.no_wa && <p className="text-red-500 text-sm">{editErrors.no_wa}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                        <textarea
                                            value={editData.address}
                                            onChange={e => setEditData('address', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {editErrors.address && <p className="text-red-500 text-sm">{editErrors.address}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Agama</label>
                                        <input
                                            type="text"
                                            value={editData.religion}
                                            onChange={e => setEditData('religion', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {editErrors.religion && <p className="text-red-500 text-sm">{editErrors.religion}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">File KK</label>
                                        <input
                                            type="file"
                                            onChange={e => setEditData('file_path_kk', e.target.files ? e.target.files[0] : null)}
                                            className="mt-1 block w-full"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        {editErrors.file_path_kk && <p className="text-red-500 text-sm">{editErrors.file_path_kk}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">File KTP</label>
                                        <input
                                            type="file"
                                            onChange={e => setEditData('file_path_ktp', e.target.files ? e.target.files[0] : null)}
                                            className="mt-1 block w-full"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        {editErrors.file_path_ktp && <p className="text-red-500 text-sm">{editErrors.file_path_ktp}</p>}
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={editProcessing}
                                            className="px-4 py-2 bg-[#664229] text-white rounded-md hover:bg-[#4a2f1d] disabled:opacity-50"
                                        >
                                            {editProcessing ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
