import { Diagram } from 'iconsax-react';
import { motion } from 'framer-motion';
import { Card } from '@/komponen/ui/card';

interface AnalisisPertumbuhanProps {
    totalKursus?: number;
    totalPeserta?: number;
    dataPertumbuhan?: number[]; // Array of heights for the bars
}

export function AnalisisPertumbuhan({
    totalKursus = 12,
    totalPeserta = 26,
    dataPertumbuhan = [14, 16, 12, 16, 14, 20, 12]
}: AnalisisPertumbuhanProps) {
    return (
        <Card className='border border-gray-300 text-gray-500 w-full p-3 rounded-xl shadow-sm'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <Diagram size={18} className="text-primary" />
                    <p className='text-gray-800 font-medium'>Analisis Pertumbuhan</p>
                </div>
                <button className='border px-2 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors'>
                    Detail
                </button>
            </div>

            <hr className='border-t border-gray-200 my-4' />

            {/* content */}
            <div className='flex justify-between items-end'>
                <div className='space-y-4'>
                    <div>
                        <p className='text-sm text-gray-800 font-medium'>{totalKursus} Kursus Baru</p>
                        <p className='text-xs'>Diselesaikan kuartal ini</p>
                    </div>
                    {/* attendes */}
                    <div className='flex items-center gap-1'>
                        <div className='flex -space-x-2 overflow-hidden'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {/* Placeholder replacement for avatar images */}
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <p className='text-xxs ml-2'>{totalPeserta} Peserta Aktif</p>
                    </div>
                </div>

                {/* graph */}
                <div className='flex gap-1.5 items-end h-20'>
                    {dataPertumbuhan.map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h * 4}px` }} // Scaling factor for visual
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`w-3 rounded-sm duration-200 ${i % 2 === 0 ? 'bg-primary/60' : 'bg-primary'}`}
                            style={{ height: `${h * 4}px` }}
                        />
                    ))}
                </div>
            </div>
        </Card>
    )
}
