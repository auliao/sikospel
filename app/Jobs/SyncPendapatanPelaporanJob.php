<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncPendapatanPelaporanJob implements ShouldQueue
{
    use Queueable;

    protected $idKos;
    protected $idPemilik;
    protected $namaKos;
    protected $namaPenghuni;
    protected $nomorKamar;
    protected $tipeKamar;
    protected $periodeTagihan;
    protected $metodePembayaran;
    protected $nominal;
    protected $tanggalPembayaran;

    /**
     * Create a new job instance.
     */
    public function __construct(
        $idKos,
        $idPemilik,
        $namaKos,
        $namaPenghuni,
        $nomorKamar,
        $tipeKamar,
        $periodeTagihan,
        $metodePembayaran,
        $nominal,
        $tanggalPembayaran
    ) {
        $this->idKos = $idKos;
        $this->idPemilik = $idPemilik;
        $this->namaKos = $namaKos;
        $this->namaPenghuni = $namaPenghuni;
        $this->nomorKamar = $nomorKamar;
        $this->tipeKamar = $tipeKamar;
        $this->periodeTagihan = $periodeTagihan;
        $this->metodePembayaran = $metodePembayaran;
        $this->nominal = $nominal;
        $this->tanggalPembayaran = $tanggalPembayaran;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $response = Http::timeout(10)->withToken(env('API_PELAPORAN_TOKEN'))
                ->post(env('API_PELAPORAN_URL') . '/sync-pendapatan', [
                    'id_kos'             => $this->idKos,
                    'id_pemilik'         => $this->idPemilik,
                    'nama_kos'           => $this->namaKos,
                    'nama_penghuni'      => $this->namaPenghuni,
                    'nomor_kamar'        => $this->nomorKamar,
                    'tipe_kamar'         => $this->tipeKamar,
                    'periode_tagihan'    => $this->periodeTagihan,
                    'metode_pembayaran'  => $this->metodePembayaran,
                    'nominal'            => $this->nominal,
                    'tanggal_pembayaran' => $this->tanggalPembayaran,
                ]);

            if ($response->successful() && $response->json('success') === true) {
                Log::info('Berhasil sync pendapatan ke pelaporan untuk ' . $this->namaPenghuni);
            } else {
                Log::error('Gagal sync pendapatan ke pelaporan: ' . $response->json('message'));
            }
        } catch (\Exception $e) {
            Log::error('Job API Sync Pendapatan gagal: ' . $e->getMessage());
        }
    }
}
