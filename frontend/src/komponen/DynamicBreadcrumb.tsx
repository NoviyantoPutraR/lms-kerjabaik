import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/komponen/ui/breadcrumb';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface DynamicBreadcrumbProps {
    items?: BreadcrumbItem[];
}

export function DynamicBreadcrumb({ items }: DynamicBreadcrumbProps) {
    const location = useLocation();

    // Auto-generate breadcrumbs from path if not provided
    const getBreadcrumbsFromPath = (): BreadcrumbItem[] => {
        const paths = location.pathname.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Dashboard', href: '/dashboard' }
        ];

        // Map common routes
        const routeMap: Record<string, string> = {
            'pembelajar': 'Pembelajar',
            'courses': 'Kursus',
            'assignments': 'Tugas',
            'assessments': 'Ujian',
            'learn': 'Ruang Belajar',
            'take': 'Mengerjakan',
            'results': 'Hasil'
        };

        let currentPath = '';
        paths.forEach((segment, _index) => {
            currentPath += `/${segment}`;

            // Skip UUID-like segments (detail pages)
            if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                return;
            }

            const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            if (_index === paths.length - 1) {
                breadcrumbs.push({ label });
            } else {
                breadcrumbs.push({ label, href: currentPath });
            }
        });

        return breadcrumbs;
    };

    const breadcrumbItems = items || getBreadcrumbsFromPath();

    // Don't show breadcrumb on root pages
    if (breadcrumbItems.length <= 1) {
        return null;
    }

    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/dashboard" className="flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            <span className="sr-only md:not-sr-only">Dashboard</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbItems.slice(1).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link to={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
