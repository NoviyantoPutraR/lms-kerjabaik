import { Add, Calendar2, NoteText, TickCircle } from 'iconsax-react'
import { Card } from '@/komponen/ui/card'

export function Catatan() {
    return (
        <Card className='border border-gray-300 text-gray-500 w-full p-3 rounded-xl shadow-sm'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <NoteText size={18} className="text-primary" />
                    <p className='text-gray-800 font-medium'>Catatan</p>
                </div>
                <button className='border flex items-center gap-1 px-2 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors'>
                    <Add size={14} />
                    Baru
                </button>
            </div>

            <hr className='border-t border-gray-200 my-4' />

            {/* content */}
            <div className='space-y-3'>
                {/* note 1 */}
                <div className='flex items-start gap-3 w-full'>
                    <button className='w-4 shrink-0 mt-1 h-4 border-2 border-gray-300 rounded-full hover:border-primary hover:bg-primary/10 transition-colors' />
                    <div className='w-full space-y-1'>
                        <p className='text-sm text-gray-800 font-medium'>Landing page</p>
                        <p className='text-xs'>Cari inspirasi untuk membuat landing page startup AI.</p>
                        <div className='flex justify-between items-end'>
                            <div className='space-x-2 font-medium'>
                                <span className='text-xxs px-2 py-0.5 rounded-full bg-red-100 text-red-500'>Hari Ini</span>
                                <span className='text-xxs px-2 py-0.5 rounded-full bg-orange-100 text-orange-500'>To-do</span>
                            </div>
                            <p className='flex items-center gap-1 text-xxs'>
                                <Calendar2 size={12} />
                                26 Okt
                            </p>
                        </div>
                    </div>
                </div>

                <hr className='border-t border-gray-200' />

                {/* note 2 */}
                <div className='flex items-start gap-3 w-full opacity-70'>
                    <TickCircle size={22} variant='Bold' className='text-green-500' />
                    <div className='w-full space-y-1'>
                        <p className='text-sm text-gray-800 font-medium line-through'>Meeting dengan CTO</p>
                        <p className='text-xs line-through'>Diskusi tentang arsitektur aplikasi dan pendekatan.</p>
                        <div className='flex justify-between items-end'>
                            <div className='space-x-2 font-medium'>
                                <span className='text-xxs px-2 py-0.5 rounded-full bg-red-100 text-red-500'>Hari Ini</span>
                                <span className='text-xxs px-2 py-0.5 rounded-full bg-orange-100 text-orange-500'>Meeting</span>
                            </div>
                            <p className='flex items-center gap-1 text-xxs'>
                                <Calendar2 size={12} />
                                26 Okt
                            </p>
                        </div>
                    </div>
                </div>

                <hr className='border-t border-gray-200' />

                {/* note 3 */}
                <div className='flex items-start gap-3 w-full opacity-70'>
                    <TickCircle size={22} variant='Bold' className='text-green-500' />
                    <div className='w-full space-y-1'>
                        <p className='text-sm text-gray-800 font-medium line-through'>Team meeting</p>
                        <p className='text-xs line-through'>Diskusi kebutuhan klien dan deadline.</p>
                        <div className='flex justify-between items-end'>
                            <div className='space-x-2 font-medium'>
                                <span className='text-xxs px-2 py-0.5 rounded-full bg-violet-100 text-violet-500'>Team</span>
                                <span className='text-xxs px-2 py-0.5 rounded-full bg-orange-100 text-orange-500'>Meeting</span>
                            </div>
                            <p className='flex items-center gap-1 text-xxs'>
                                <Calendar2 size={12} />
                                25 Okt
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
