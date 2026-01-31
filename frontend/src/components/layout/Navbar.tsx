import { useSidebarStore } from '../../store/useSidebarStore';
import {
    SidebarLeft,
    SearchNormal1,
    DirectNotification,
    CalendarEdit,
    Add,
    Profile2User
} from 'iconsax-react';
import { ModeToggle } from '../ui/ModeToggle';

function Navbar() {
    const { toggleSidebar } = useSidebarStore();

    return (
        <div className="bg-background sticky top-0 z-10 w-full border-b border-border">
            <div className='flex h-[var(--h-nav)] px-4 md:px-6 justify-between items-center'>

                {/* Mobile Sidebar Toggle & Left Section */}
                <div className='flex items-center gap-4'>
                    <button
                        onClick={toggleSidebar}
                        className='flex md:hidden items-center justify-center p-2 text-muted-foreground hover:bg-accent rounded-lg'
                    >
                        <SidebarLeft size={20} />
                    </button>

                    <div className='flex items-center gap-3'>
                        {/* Mobile Profile visible only on small screens if needed, 
                             or strictly following template which shows profile in Navbar on mobile? 
                             Template shows profile in Navbar on ALL screens? 
                             Wait, template Sidebar.tsx has profile at bottom. 
                             Template Navbar.tsx has profile at left.
                             This is redundant. 
                             Template code: 
                               Navbar.tsx lines 12-24: Shows profile image + "Welcome back"
                               Sidebar.tsx lines 99-117: Shows profile image + Name
                             
                             I should probably keep Navbar profile as the main distinct welcome message.
                         */}
                        <div className="h-10 w-10 rounded-full bg-secondary hidden md:flex items-center justify-center text-muted-foreground">
                            <Profile2User size={24} variant="Bold" />
                        </div>
                        <div className="hidden md:block">
                            <p className='text-sm font-semibold text-foreground'>Administrator</p>
                            <p className='text-xs font-medium text-muted-foreground'>Selamat datang kembali</p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-2 md:gap-3'>
                    <ModeToggle />
                    
                    <button className='flex items-center justify-center h-10 w-10 text-muted-foreground hover:bg-accent rounded-lg duration-200'>
                        <SearchNormal1 size={20} />
                    </button>

                    <button className='flex items-center justify-center h-10 w-10 text-muted-foreground hover:bg-accent rounded-lg duration-200 relative'>
                        <DirectNotification size={20} />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-background"></span>
                    </button>

                    <div className="h-6 w-px bg-border mx-1 hidden md:block"></div>

                    <button className='hidden md:flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent duration-200'>
                        <CalendarEdit size={18} />
                        <span>Jadwal</span>
                    </button>

                    <button className='flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-template-primary rounded-lg hover:opacity-90 duration-200 shadow-sm shadow-indigo-200 dark:shadow-none'>
                        <Add size={18} />
                        <span className='hidden md:inline'>Buat Baru</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
