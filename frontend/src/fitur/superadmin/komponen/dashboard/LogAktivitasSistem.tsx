import { ArrowDown2, Clock, More, Timer1 } from 'iconsax-react'
import { Card } from '@/komponen/ui/card'
import { Timer } from './Timer'

export function LogAktivitasSistem() {
    return (
        <Card className='border text-gray-500 w-full p-3 rounded-2xl shadow-sm'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <Timer1 size={18} className="text-primary" />
                    <p className='text-gray-800 font-medium'>Pelacak Waktu</p>
                </div>
                <button className='border flex items-center gap-1 px-2 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors'>
                    <Clock size={14} />
                    Riwayat
                </button>
            </div>

            <hr className='bg-gray-100 my-4' />

            {/* content */}
            <div>
                {/* timer */}
                <div className='rounded-lg border overflow-hidden'>
                    {/* timer head */}
                    <div className='bg-gray-50 py-1 px-2 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <div className="h-4 w-4 bg-blue-500 rounded-sm flex items-center justify-center text-white text-[10px] font-bold">A</div>
                            <p className='text-sm font-medium text-gray-700'>Desain Aplikasi</p>
                        </div>
                        <ArrowDown2 size={16} />
                    </div>

                    <Timer />
                </div>

                {/* previous tasks */}
                <div className='pt-3 space-y-3'>
                    <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Tugas Sebelumnya</p>
                    {/* tasks */}
                    <div className='space-y-3'>

                        <div className='flex items-center justify-between group cursor-pointer'>
                            <div className='flex gap-2 items-center'>
                                <div className='rounded-full p-1.5 border border-gray-200 shrink-0 bg-gray-50 group-hover:bg-gray-100 transition-colors'>
                                    <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
                                </div>
                                <div className='font-medium'>
                                    <p className='text-sm text-gray-800 group-hover:text-primary transition-colors'>Rekaman Layar</p>
                                    <p className='text-xs text-gray-500'>03:45</p>
                                </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <More size={16} className="text-gray-400 rotate-90" />
                            </button>
                        </div>

                        <div className='flex items-center justify-between group cursor-pointer'>
                            <div className='flex gap-2 items-center'>
                                <div className='rounded-full p-1.5 border border-gray-200 shrink-0 bg-gray-50 group-hover:bg-gray-100 transition-colors'>
                                    <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
                                </div>
                                <div className='font-medium'>
                                    <p className='text-sm text-gray-800 group-hover:text-primary transition-colors'>Wireframe website</p>
                                    <p className='text-xs text-gray-500'>02:45:40</p>
                                </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <More size={16} className="text-gray-400 rotate-90" />
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </Card>
    )
}
