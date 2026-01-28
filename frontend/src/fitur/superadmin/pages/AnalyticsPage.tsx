import { useTenantAnalytics } from "../hooks/useAnalytics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/komponen/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/komponen/ui/table";
import {
  Building,
  Profile2User,
  Book,
  Chart,
  Crown1,
  BookSaved
} from "iconsax-react";
import { Badge } from "@/komponen/ui/badge";
import { StatCard } from "@/fitur/superadmin/komponen/dashboard/StatCard";
import { AnalyticsCharts } from "@/fitur/superadmin/komponen/dashboard/AnalyticsCharts";

export function AnalyticsPage() {
  const { data: analytics, isLoading } = useTenantAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Memuat data analitik...
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totals = analytics?.reduce(
    (acc, tenant) => ({
      tenants: acc.tenants + 1,
      users: acc.users + tenant.user_count,
      courses: acc.courses + tenant.course_count,
      enrollments: acc.enrollments + tenant.enrollment_count,
    }),
    { tenants: 0, users: 0, courses: 0, enrollments: 0 },
  ) || { tenants: 0, users: 0, courses: 0, enrollments: 0 };


  return (
    <div className="space-y-6 font-sans text-gray-900 antialiased pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-gray-800">Analitik & Wawasan</h1>
          <p className="text-gray-500 text-xs">
            Pantau performa platform, pertumbuhan tenant, dan aktivitas pengguna secara real-time.
          </p>
        </div>
      </div>

      {/* Platform Overview */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tenant"
          value={totals.tenants}
          subtext="Entitas terdaftar"
          icon={Building}
          color="bg-blue-500"
          trend="+5%"
        />
        <StatCard
          title="Total Pengguna"
          value={totals.users}
          subtext="Akun platform"
          icon={Profile2User}
          color="bg-emerald-500"
          trend="+12%"
        />
        <StatCard
          title="Total Kursus"
          value={totals.courses}
          subtext="Modul pembelajaran"
          icon={Book}
          color="bg-violet-500"
          trend="+8%"
        />
        <StatCard
          title="Pendaftaran"
          value={totals.enrollments}
          subtext="Total partisipasi"
          icon={Chart}
          color="bg-amber-500"
          trend="+24%"
        />
      </section>

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Full Table */}
      <Card className="shadow-sm border-gray-100 rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100 py-5 px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">Detail Statistik Per Tenant</CardTitle>
              <CardDescription className="text-xs text-gray-400 mt-1">
                Tabel data lengkap performa seluruh tenant.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-b border-gray-100 hover:bg-gray-50/50">
                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 py-3 px-6">Nama Tenant</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 py-3 text-center">Pengguna</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 py-3 text-center">Kursus</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 py-3 text-center">Pendaftaran</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 py-3 text-center">Aktif (30hr)</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 py-3 text-center">Efektivitas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics?.map((tenant) => (
                <TableRow key={tenant.id_lembaga} className="group hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                        <Building size={16} variant="Bold" />
                      </div>
                      <span className="font-bold text-xs text-gray-700 group-hover:text-violet-600 transition-colors">
                        {tenant.tenant_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3 font-semibold text-xs text-gray-600">{tenant.user_count}</TableCell>
                  <TableCell className="text-center py-3 font-semibold text-xs text-gray-600">{tenant.course_count}</TableCell>
                  <TableCell className="text-center py-3 font-semibold text-xs text-gray-600">{tenant.enrollment_count}</TableCell>
                  <TableCell className="text-center py-3 font-semibold text-xs text-emerald-600">{tenant.active_users_30d}</TableCell>
                  <TableCell className="text-center py-3">
                    <Badge variant="outline" className="font-bold text-[10px] bg-gray-50 border-gray-200 text-gray-600">
                      {tenant.course_count > 0 ? (tenant.enrollment_count / tenant.course_count).toFixed(1) : "0"} Daftar/Modul
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
