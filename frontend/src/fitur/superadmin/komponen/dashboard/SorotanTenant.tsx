import { useState } from 'react';
import { Edit2, Heart, MagicStar, Send2 } from 'iconsax-react';
import { motion } from 'framer-motion';
import { Card } from '@/komponen/ui/card';
import { cn } from '@/pustaka/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/komponen/ui/avatar';

interface Comment {
    id: number;
    user: string;
    role: string;
    text: string;
    avatarUrl?: string;
    initials: string;
}

export function SorotanTenant() {
    const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'rewards'>('comments');
    const [likedComments, setLikedComments] = useState<number[]>([1]); // IDs of liked comments

    const toggleLike = (id: number) => {
        if (likedComments.includes(id)) {
            setLikedComments(likedComments.filter(commentId => commentId !== id));
        } else {
            setLikedComments([...likedComments, id]);
        }
    };

    const comments: Comment[] = [
        { id: 1, user: "Budi Santoso", role: "Instruktur Senior", text: "Modul baru sangat membantu! 🔥", initials: "BS" },
        { id: 2, user: "Siti Aminah", role: "Admin Tenant", text: "Fitur analitik sudah live! 🎉", initials: "SA" }
    ];

    return (
        <Card className='border text-gray-500 w-full p-3 rounded-2xl space-y-4 shadow-sm'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center text-sm gap-2'>
                    <MagicStar size={18} className="text-primary" />
                    <p className='text-gray-800 font-medium'>Sorotan Tenant</p>
                </div>
                <button className='border flex items-center gap-1 px-2 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors'>
                    <Send2 size={14} />
                    Bagikan
                </button>
            </div>

            {/* tabs */}
            <div className='flex text-xs font-medium relative bg-gray-100 p-1 rounded-lg'>
                {(['overview', 'comments', 'rewards'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "z-10 w-full px-2 py-1.5 rounded-lg capitalize transition-colors duration-200",
                            activeTab === tab ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {tab}
                    </button>
                ))}

                <motion.div
                    animate={{
                        x: activeTab === 'overview' ? '0%' : activeTab === 'comments' ? '100%' : '200%'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className='absolute top-1 left-1 w-[calc(33.33%-0.33rem)] bg-white shadow-sm h-[calc(100%-0.5rem)] rounded-md pointer-events-none'
                />
            </div>

            {/* content */}
            <div className='space-y-3'>
                {activeTab === 'comments' && (
                    <>
                        {comments.map((comment, index) => (
                            <div key={comment.id} className="space-y-3">
                                <div
                                    onDoubleClick={() => toggleLike(comment.id)}
                                    className='flex items-center justify-between w-full select-none cursor-pointer group'
                                >
                                    <div className='flex items-center gap-2'>
                                        <Avatar className="h-9 w-9 border border-gray-200">
                                            <AvatarImage src={comment.avatarUrl} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{comment.initials}</AvatarFallback>
                                        </Avatar>
                                        <div className='font-medium'>
                                            <p className='text-xxs text-gray-500'>{comment.user}</p>
                                            <p className='text-sm text-gray-700 font-medium'>{comment.text}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleLike(comment.id)}
                                        className={cn(
                                            "duration-200 active:scale-50",
                                            likedComments.includes(comment.id) ? 'text-red-500' : 'text-gray-300 group-hover:text-gray-400'
                                        )}
                                    >
                                        <Heart size={20} variant={likedComments.includes(comment.id) ? 'Bold' : 'Linear'} />
                                    </button>
                                </div>
                                {index < comments.length - 1 && <hr className='bg-gray-100' />}
                            </div>
                        ))}

                        {/* comment button */}
                        <button className='border border-dashed flex items-center justify-center w-full gap-2 p-2 text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all font-medium rounded-lg text-xs mt-2'>
                            <Edit2 size={14} />
                            Tulis Pesan
                        </button>
                    </>
                )}
                {activeTab !== 'comments' && (
                    <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                        Belum ada data untuk {activeTab}
                    </div>
                )}
            </div>
        </Card>
    )
}
