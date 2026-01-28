import { Calendar, Clock, DocumentText, Flash, InfoCircle } from 'iconsax-react'
import { Card } from '@/komponen/ui/card'
import { Avatar, AvatarFallback } from '@/komponen/ui/avatar'

export function PendaftaranTerbaru() {
    return (
        <Card className='border text-gray-500 w-full p-3 rounded-2xl shadow-sm'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <Flash size={18} className="text-primary" />
                    <p className='text-gray-800 font-medium'>Proyek Saat Ini</p>
                </div>
                <button className='border flex items-center gap-1 px-2 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors'>
                    <InfoCircle size={14} />
                    Detail
                </button>
            </div>

            <hr className='bg-gray-100 my-4' />

            {/* content */}
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <p className='text-xs text-gray-400'>Nama Proyek</p>

                    {/* header */}
                    <div className='flex items-center gap-2'>
                        <div className="h-5 w-5 bg-blue-600 rounded-sm flex items-center justify-center text-white text-[10px] font-bold">A</div>
                        <p className='text-sm text-gray-800 font-medium'>Dokumentasi Atlassian</p>
                        <div className='flex text-xxs font-medium items-center gap-1 pr-1.5 bg-green-100 px-1 py-0.5 rounded-full text-green-600'>
                            <Clock size={14} variant='Bold' />
                            <span>Berjalan</span>
                        </div>
                    </div>
                </div>

                {/* project leads */}
                <div className='flex gap-12'>
                    <div className='space-y-1'>
                        <p className='text-xs text-gray-400'>Manajer Proyek</p>
                        <div className='flex items-center gap-2'>
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600">SJ</AvatarFallback>
                            </Avatar>
                            <p className='text-sm text-gray-800 font-medium'>Steve J.</p>
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <p className='text-xs text-gray-400'>Tech Lead</p>
                        <div className='flex items-center gap-2'>
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px] bg-pink-100 text-pink-600">AM</AvatarFallback>
                            </Avatar>
                            <p className='text-sm text-gray-800 font-medium'>Andrew M.</p>
                        </div>
                    </div>
                </div>

                {/* team */}
                <div className='space-y-1'>
                    <p className='text-xs text-gray-400'>Tim</p>
                    <div className='flex items-center gap-1'>
                        <div className='flex -space-x-1.5'>
                            {[1, 2, 3].map((i) => (
                                <Avatar key={i} className="h-5 w-5 border border-white ring-1 ring-white">
                                    <AvatarFallback className="text-[8px] bg-gray-200">U{i}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <p className='text-xxs text-gray-500 ml-1'>+6 orang</p>
                    </div>
                </div>

                {/* timeline */}
                <div className='space-y-1 font-medium'>
                    <p className='text-xs text-gray-400'>Linimasa</p>
                    <div className='text-sm flex items-center gap-2'>
                        <Calendar size={18} className="text-primary" />
                        <p className='text-gray-800'>10 Des 2023 - 02 Des 2024</p>
                    </div>
                </div>

                {/* description */}
                <div className='space-y-1 font-medium'>
                    <p className='text-xs text-gray-400'>Deskripsi</p>
                    <div className='text-sm flex items-center gap-2'>
                        <DocumentText size={18} className="text-primary" />
                        <p className='text-gray-800'>Frontend website untuk aplikasi AI</p>
                    </div>
                </div>

            </div>
        </Card>
    )
}
