import { Book } from 'iconsax-react'
import { Card } from '@/komponen/ui/card'
import { RadialProgress } from './RadialProgress'

export function ProgresKursusUtama() {
    return (
        <Card className='border text-gray-500 w-full p-3 rounded-2xl shadow-sm'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <Book size={18} className="text-primary" />
                    <p className='text-gray-800 font-medium'>Progres Kursus</p>
                </div>
                <button className='border px-2 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors'>
                    Lihat semua
                </button>
            </div>

            <hr className='bg-gray-100 my-4' />

            {/* content */}
            <div className='flex justify-between'>
                <div className='flex items-center gap-4'>
                    <RadialProgress />
                    <div className='space-y-1'>
                        <p className='text-sm text-gray-800 font-semibold'>User Experience Training</p>
                        <p className='text-xs'>Didesain untuk frontend developer memahami perilaku pengguna.</p>
                        <button className='text-xs text-primary underline font-semibold underline-offset-2 hover:text-primary/80'>
                            Lanjutkan Kursus
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
