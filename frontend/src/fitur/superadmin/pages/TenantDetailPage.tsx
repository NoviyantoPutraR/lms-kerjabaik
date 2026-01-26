import { useParams, useNavigate } from "react-router-dom";
import { useTenant, useTenantStats } from "../hooks/useTenants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/komponen/ui/card";
import { Button } from "@/komponen/ui/button";
import { Badge } from "@/komponen/ui/badge";
import {
  ArrowLeft,
  Users,
  BookOpen,
  GraduationCap,
  HardDrive,
  Edit,
} from "lucide-react";
import { formatTanggal } from "@/pustaka/utils";

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: tenant, isLoading: tenantLoading } = useTenant(id!);
  const { data: stats } = useTenantStats(id!);

  if (tenantLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Memuat detail tenant...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Tenant tidak ditemukan
          </p>
          <Button
            onClick={() => navigate("/superadmin/tenants")}
            className="mt-4"
          >
            Kembali ke Daftar Tenant
          </Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    aktif:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900",
    nonaktif:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800",
    suspended: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900",
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/superadmin/tenants")}
            className="h-10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {(tenant as any).nama}
            </h1>
            <p className="text-muted-foreground text-sm">
              Informasi lengkap dan statistik penggunaan tenant platform.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => { /* Handle edit mode if needed */ }} className="h-10">
            <Edit className="w-4 h-4 mr-2" />
            Ubah Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-12">
          {/* Info Card */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Profil Organisasi</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Slug / Subdomain
                  </h3>
                  <p className="text-lg font-mono font-bold text-foreground">
                    {(tenant as any).slug}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Tipe Organisasi
                  </h3>
                  <p className="text-lg capitalize font-bold text-foreground">
                    {(tenant as any).tipe}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Status
                  </h3>
                  <Badge variant="outline" className={cn("font-bold uppercase tracking-wider", (statusColors as any)[(tenant as any).status])}>
                    {(tenant as any).status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Email Kontak
                  </h3>
                  <p className="text-lg font-bold text-foreground">
                    {(tenant as any).email || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Dibuat Pada
                  </h3>
                  <p className="text-lg font-bold text-foreground">
                    {formatTanggal((tenant as any).created_at, "long")}
                  </p>
                </div>
                {(tenant as any).url_logo && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">
                      Logo Institusi
                    </h3>
                    <div className="p-3 border rounded-xl bg-muted/20 w-fit">
                      <img
                        src={(tenant as any).url_logo}
                        alt={`Logo ${(tenant as any).nama}`}
                        className="h-12 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pengguna</CardTitle>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stats?.total_users || 0}</div>
                <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase text-blue-600">{stats?.active_users || 0} akun aktif</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Kursus</CardTitle>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                  <BookOpen className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stats?.total_courses || 0}</div>
                <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase text-green-600">{stats?.published_courses || 0} terbit</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pendaftaran</CardTitle>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stats?.total_enrollments || 0}</div>
                <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase">Siswa berpartisipasi</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Penyimpanan</CardTitle>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                  <HardDrive className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stats?.storage_used_mb || 0} MB</div>
                <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase">Kapasitas terpakai</p>
              </CardContent>
            </Card>
          </div>

          {/* Configuration */}
          {(tenant as any).konfigurasi && Object.keys((tenant as any).konfigurasi).length > 0 && (
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Parameter Konfigurasi</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="bg-muted/10 p-6 overflow-x-auto text-[13px] font-mono leading-relaxed">
                  {JSON.stringify((tenant as any).konfigurasi, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/pustaka/utils";
