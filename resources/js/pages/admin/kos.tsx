'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

import { Kos, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

declare const route: any;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kos',
        href: '/admin/kos',
    },
];

export const columns = ({
    setSelected,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
}: {
    setSelected: (_: Kos) => void;
    setIsEditModalOpen: (_: boolean) => void;
    setIsDeleteModalOpen: (_: boolean) => void;
}): ColumnDef<Kos>[] => [
    {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => {
            return (
                <div className="line-clamp-1 whitespace-normal" title={row.original.name}>
                    {row.original.name}
                </div>
            );
        },
    },
    {
        accessorKey: 'address',
        header: 'Alamat',
        cell: ({ row }) => row.original.address,
    },
    {
        accessorKey: 'owner.name',
        header: 'Pemilik',
        cell: ({ row }) => `${row.original.owner.name} (${row.original.owner.user.email})`,
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const kos = row.original;

            return (
                <div className="flex justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-500"
                        onClick={() => {
                            setSelected(kos);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <Edit />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-500"
                        onClick={() => {
                            setSelected(kos);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        <Trash2 />
                    </Button>
                </div>
            );
        },
    },
];

function CreateModal({ isOpen, onClose, onSuccess, pemilik }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; pemilik: any[] }) {
    const { data, setData, post, processing, errors, reset } = useForm<Omit<Kos, 'id' | 'owner'>>({
        owner_id: 0,
        name: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.kos.store'), {
            onSuccess: () => {
                reset();
                onSuccess();
                onClose();
            },
            preserveState: 'errors',
        });
    };

    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-3/4 overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Kos</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="owner_id">Pemilik</Label>
                        <Select value={data.owner_id} onValueChange={(value) => setData('owner_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Pemilik" />
                            </SelectTrigger>
                            <SelectContent>
                                {pemilik.map((p) => (
                                    <SelectItem key={p.user_id} value={p.user_id.toString()}>
                                        {p.name} ({p.user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.owner_id && <p className="text-sm text-red-500">{errors.owner_id}</p>}

                        <Label htmlFor="name">Nama Kos</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                        <Label htmlFor="address">Alamat</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            required
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditModal({
    isOpen,
    onClose,
    onSuccess,
    kos,
    pemilik,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    kos: Kos | null;
    pemilik: any[];
}) {
    const { data, setData, put, processing, errors, reset } = useForm<Omit<Kos, 'id' | 'owner'>>({
        owner_id: 0,
        name: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!kos) return;

        put(route('admin.kos.update', kos.id), {
            onSuccess: () => {
                reset();
                onSuccess();
                onClose();
            },
        });
    };

    useEffect(() => {
        if (kos) {
            setData({
                owner_id: kos.owner_id,
                name: kos.name,
                address: kos.address,
            });
        }
    }, [kos, setData]);

    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-3/4 overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Kos</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="owner_id">Pemilik</Label>
                        <Select value={data.owner_id} onValueChange={(value) => setData('owner_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Pemilik" />
                            </SelectTrigger>
                            <SelectContent>
                                {pemilik.map((p) => (
                                    <SelectItem key={p.user_id} value={p.user_id.toString()}>
                                        {p.name} ({p.user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.owner_id && <p className="text-sm text-red-500">{errors.owner_id}</p>}

                        <Label htmlFor="name">Nama Kos</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                        <Label htmlFor="address">Alamat</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            required
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mt-4 text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-center">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminKosPage({
    kos,
    pemilik,
}: {
    kos: Kos[];
    pemilik: any[];
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selected, setSelected] = useState<Kos | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns({ setSelected, setIsEditModalOpen, setIsDeleteModalOpen })}
                    data={kos || []}
                    headerAction={<Button onClick={() => setIsCreateModalOpen(true)}>Tambah</Button>}
                />

                <CreateModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        toast.success('Berhasil menyimpan data');
                        router.reload();
                        setIsCreateModalOpen(false);
                    }}
                    pemilik={pemilik}
                />

                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelected(null);
                    }}
                    onSuccess={() => {
                        toast.success('Berhasil menyimpan data');
                        router.reload();
                        setIsEditModalOpen(false);
                        setSelected(null);
                    }}
                    kos={selected}
                    pemilik={pemilik}
                />

                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelected(null);
                    }}
                    onConfirm={() => {
                        if (!selected) return;

                        setIsDeleting(true);

                        router.delete(route('admin.kos.destroy', selected.id), {
                            preserveScroll: true,
                            onSuccess: () => {
                                toast.success(`Kos "${selected?.name}" berhasil dihapus.`);
                                router.reload();
                                setIsDeleteModalOpen(false);
                                setSelected(null);
                            },
                            onError: () => {
                                toast.error(`Kos "${selected?.name}" gagal dihapus.`);
                            },
                            onFinish: () => {
                                setIsDeleting(false);
                            },
                        });
                    }}
                    title={`Apakah Anda yakin ingin menghapus kos ini?`}
                    description={selected?.name || ''}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
