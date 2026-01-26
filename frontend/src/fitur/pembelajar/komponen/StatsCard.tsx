import { Card, CardContent } from '@/komponen/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/pustaka/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

/**
 * Komponen card untuk menampilkan statistik
 */
export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
}: StatsCardProps) {
    return (
        <Card className={cn('shadow-sm border-border', className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
                            {trend && (
                                <span
                                    className={cn(
                                        'text-sm font-medium',
                                        trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                                    )}
                                >
                                    {trend.isPositive ? '+' : ''}
                                    {trend.value}%
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="p-3 bg-primary/10 rounded-sm">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
