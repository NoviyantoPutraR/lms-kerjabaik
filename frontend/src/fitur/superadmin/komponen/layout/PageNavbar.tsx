import React from 'react'
import { SidebarLeft } from 'iconsax-react'
import { cn } from '@/pustaka/utils'

const PageNavbarLeftContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
>((props, ref) =>
    <div
        ref={ref}
        className='flex items-center justify-between gap-2 h-10'
        {...props} />
);

PageNavbarLeftContent.displayName = 'PageNavbarLeftContent'


const PageNavbarRightContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
>((props, ref) =>
    <div
        ref={ref}
        className='text-gray-500 hidden md:flex gap-2'
        {...props} />
);

PageNavbarRightContent.displayName = 'PageNavbarRightContent'


const PageNavbarIconButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<'button'>>
    (({ className, ...props }, ref) =>
        <button
            ref={ref}
            className={cn('flex items-center justify-center h-8 w-8 duration-200 hover:bg-gray-100 rounded-lg', className)}
            {...props} />
    )

PageNavbarIconButton.displayName = 'PageNavbarIconButton'

const PageNavbarPrimaryButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<'button'>>
    (({ className, ...props }, ref) =>
        <button
            ref={ref}
            className={cn('h-8 gap-1 bg-primary hidden py-1 px-2 duration-200 text-white rounded-lg text-xs md:flex items-center justify-center hover:bg-primary/90', className)}
            {...props}
        />
    )
PageNavbarPrimaryButton.displayName = 'PageNavbarPrimaryButton'


function PageNavbar({ children, className }: { children: React.ReactNode, className?: string }) {
    // Note: Sidebar toggle logic is handled by the main layout usually. 
    // If needed, we can accept a prop for it.

    return (
        <div className={className}>

            <div className='h-[var(--h-nav)] flex py-4 md:py-6 text-gray-500 justify-between items-center'>

                {children}

                <button className='flex items-center justify-center text-gray-500 h-8 w-8 md:hidden'>
                    <SidebarLeft size={16} />
                </button>

            </div>

            <hr className='bg-gray-400 mx-2' />

        </div>
    )
}

export default PageNavbar
export { PageNavbarLeftContent, PageNavbarRightContent, PageNavbarIconButton, PageNavbarPrimaryButton }
