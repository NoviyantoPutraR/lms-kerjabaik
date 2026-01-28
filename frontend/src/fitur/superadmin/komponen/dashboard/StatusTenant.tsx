import { Clock, MinusCirlce, Monitor } from 'iconsax-react'
import { Card } from '@/komponen/ui/card'
import { Avatar, AvatarFallback } from '@/komponen/ui/avatar'

export function StatusTenant() {
    return (
        <Card className='border border-gray-300 text-gray-500 w-full p-3 rounded-xl shadow-sm'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <Monitor size={18} className="text-primary" />
                    <p className='text-gray-800 font-medium'>Status Tenant</p>
                </div>
                <button className='border px-2 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors'>
                    Lihat semua
                </button>
            </div>

            <hr className='border-t border-gray-200 my-4' />

            {/* content */}
            <div className='space-y-4'>
                {/* absent */}
                <div className='space-y-2'>
                    <p className='text-xs text-gray-400 font-medium uppercase'>Tidak Hadir</p>
                    <div className='flex items-center justify-between'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <Avatar className="h-9 w-9 border border-gray-200">
                                    <AvatarFallback className="bg-red-100 text-red-600 font-bold">EW</AvatarFallback>
                                </Avatar>
                                <div className='font-medium'>
                                    <p className='text-sm text-gray-800'>Emma Watson</p>
                                    <p className='text-xs text-gray-500'>UI Designer</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex text-xxs font-medium items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full'>
                            <MinusCirlce size={14} variant='Bold' />
                            <span>Alpha</span>
                        </div>
                    </div>
                </div>

                <hr className='border-t border-gray-200' />

                {/* away */}
                <div className='space-y-2'>
                    <p className='text-xs text-gray-400 font-medium uppercase'>Sedang Keluar</p>

                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <Avatar className="h-9 w-9 border border-gray-200">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">WW</AvatarFallback>
                                </Avatar>
                                <div className='font-medium'>
                                    <p className='text-sm text-gray-800'>Walter White</p>
                                    <p className='text-xs text-gray-500'>Backend Developer</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex text-xxs font-medium items-center gap-1 pr-1.5 bg-orange-100 px-1 py-0.5 rounded-full text-orange-400'>
                            <Clock size={14} variant='Bold' />
                            <span>25m</span>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <Avatar className="h-9 w-9 border border-gray-200">
                                    <AvatarFallback className="bg-green-100 text-green-600 font-bold">DJ</AvatarFallback>
                                </Avatar>
                                <div className='font-medium'>
                                    <p className='text-sm text-gray-800'>Dwayne Johnson</p>
                                    <p className='text-xs text-gray-500'>DevOps Engineer</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex text-xxs font-medium items-center gap-1 pr-1.5 bg-orange-100 px-1 py-0.5 rounded-full text-orange-400'>
                            <Clock size={14} variant='Bold' />
                            <span>12m</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
