

interface HeaderProps {
    user: any;
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 h-[72px] bg-card border-b border-border shadow-sm transition-all">
            <div className="flex items-center justify-between h-full px-6">


                <div className="flex-1" />

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                        {user?.email}
                    </span>
                </div>
            </div>
        </header>
    );
}
