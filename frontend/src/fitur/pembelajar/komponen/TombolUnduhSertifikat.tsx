import { useState } from 'react';
import { Button } from '@/komponen/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/pustaka/supabase';
import { toast } from 'sonner';

interface TombolUnduhSertifikatProps {
    idKursus: string;
    persentaseKemajuan: number;
    judulKursus: string;
}

/**
 * Komponen tombol untuk mengunduh sertifikat.
 * Muncul hanya jika progres mencapai 100%.
 */
export function TombolUnduhSertifikat({ idKursus, persentaseKemajuan, judulKursus }: TombolUnduhSertifikatProps) {
    const [sedangMengunduh, setSedangMengunduh] = useState(false);

    // Pastikan angka dalam bentuk number dan bulatkan untuk antisipasi decimal floating point
    const skorProgress = typeof persentaseKemajuan === 'string' ? parseFloat(persentaseKemajuan) : persentaseKemajuan;
    
    // Sertifikat hanya bisa diunduh jika progres mencapai 100% (dibulatkan)
    if (Math.round(skorProgress) < 100) return null;

    const tanganiUnduh = async () => {
        try {
            setSedangMengunduh(true);
            
            // Panggil Edge Function dengan menyertakan format response blob
            const { data, error } = await supabase.functions.invoke('generate-certificate', {
                body: { id_kursus: idKursus },
                parseAs: 'blob'
            });

            if (error) throw error;

            // Jika data kosong, lempar error
            if (!data) throw new Error('File sertifikat tidak diterima dari server.');

            // Handle Blob Response
            // Karena invoke biasanya mengembalikan data JSON jika tidak diatur, 
            // kita perlu memastikan response adalah blob. 
            // Jika supabase-js mengembalikan blob secara otomatis untuk pdf:
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Sertifikat-${judulKursus.replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Sertifikat berhasil diunduh!');
        } catch (error: any) {
            console.error('Gagal mengunduh sertifikat:', error);
            toast.error(error.message || 'Gagal mengunduh sertifikat. Silakan coba lagi.');
        } finally {
            setSedangMengunduh(false);
        }
    };

    return (
        <Button 
            onClick={tanganiUnduh} 
            disabled={sedangMengunduh}
            variant="outline"
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-bold transition-all active:scale-95 shadow-sm"
        >
            {sedangMengunduh ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Unduh Sertifikat
                </>
            )}
        </Button>
    );
}
