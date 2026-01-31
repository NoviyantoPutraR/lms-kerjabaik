import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/komponen/ui/card";
import { useGrowthMetrics } from "../../hooks/useAnalytics";
import { Chart as ChartIcon, Activity } from "iconsax-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect, useState } from "react";

export function AnalyticsCharts() {
    const { data: growthData, isLoading } = useGrowthMetrics("month");
    const { theme } = useThemeStore();
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            setResolvedTheme(systemTheme);
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    const isDark = resolvedTheme === "dark";

    const axisColor = isDark ? "#9CA3AF" : "#6B7280";
    const gridColor = isDark ? "#374151" : "#E5E7EB";
    const tooltipBg = isDark ? "#1F2937" : "#FFFFFF";
    const tooltipBorder = isDark ? "#374151" : "#F3F4F6";
    const tooltipText = isDark ? "#F3F4F6" : "#1F2937";

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card/95 backdrop-blur border border-border p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                    <p className="font-bold text-foreground mb-2 text-xs uppercase tracking-wider">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs font-medium mb-1 last:mb-0">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground capitalize">{entry.name}:</span>
                            <span className="font-bold text-foreground">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i} className="border border-border rounded-xl shadow-sm h-[400px] flex items-center justify-center bg-card">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Growth Trend Chart */}
            <Card className="border border-border rounded-xl shadow-sm overflow-hidden bg-card">
                <CardHeader className="bg-card border-b border-border py-5 px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-foreground">Tren Pertumbuhan</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground mt-1">
                                Aktivitas pengguna dan pendaftaran kursus (12 Periode Terakhir).
                            </CardDescription>
                        </div>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                            <ChartIcon size={20} className="text-indigo-500 dark:text-indigo-400" variant="Bold" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={growthData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7B6CF0" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#7B6CF0" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: axisColor, fontSize: 10 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: axisColor, fontSize: 10 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7B6CF0', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: axisColor }} />
                                <Area
                                    type="monotone"
                                    dataKey="new_users"
                                    name="Pengguna Baru"
                                    stroke="#7B6CF0"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="new_enrollments"
                                    name="Pendaftaran Kursus"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorEnrollments)"
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Engagement Chart */}
            <Card className="border border-border rounded-xl shadow-sm overflow-hidden bg-card">
                <CardHeader className="bg-card border-b border-border py-5 px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-foreground">Metrik Aktivitas</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground mt-1">
                                Perbandingan kursus baru dan tenant baru yang bergabung.
                            </CardDescription>
                        </div>
                        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                            <Activity size={20} className="text-rose-500 dark:text-rose-400" variant="Bold" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={growthData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                barSize={12}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: axisColor, fontSize: 10 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: axisColor, fontSize: 10 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#374151' : '#f9fafb' }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: axisColor }} />
                                <Bar
                                    dataKey="new_courses"
                                    name="Kursus Baru"
                                    fill="#F59E0B"
                                    radius={[4, 4, 0, 0]}
                                    stackId="a"
                                />
                                <Bar
                                    dataKey="new_tenants"
                                    name="Tenant Baru"
                                    fill="#3B82F6"
                                    radius={[4, 4, 0, 0]}
                                    stackId="b"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
