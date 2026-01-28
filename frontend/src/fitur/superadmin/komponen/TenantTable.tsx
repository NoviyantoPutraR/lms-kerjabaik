
import type { TenantWithStats } from "../tipe/tenant.types";
import { formatTanggal, cn } from "@/pustaka/utils";
import {
  Building,
  TickCircle,
  CloseCircle,
  Calendar,
  Eye,
  Edit,
  Trash,
} from "iconsax-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/komponen/ui/table";

interface TenantTableProps {
  tenants: TenantWithStats[];
  isLoading?: boolean;
  onEdit: (tenant: TenantWithStats) => void;
  onDelete: (tenant: TenantWithStats) => void;
  onViewDetail: (tenant: TenantWithStats) => void;
}

export function TenantTable({
  tenants,
  isLoading,
  onEdit,
  onDelete,
  onViewDetail,
}: TenantTableProps) {

  const getTypeColor = (t: string) => {
    switch (t.toLowerCase()) {
      case 'provinsi': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'kampus': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'korporasi': return 'bg-violet-50 text-violet-600 border-violet-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
            <TableHead className="py-4 pl-6 pr-4 text-left text-xs font-semibold text-gray-500 w-[350px]">Organisasi</TableHead>
            <TableHead className="px-4 py-4 text-left text-xs font-semibold text-gray-500 w-[120px]">Tipe</TableHead>
            <TableHead className="px-4 py-4 text-left text-xs font-semibold text-gray-500 w-[140px]">Status</TableHead>
            <TableHead className="px-2 py-4 text-center text-xs font-semibold text-gray-500 w-[80px]">Pengguna</TableHead>
            <TableHead className="px-2 py-4 text-center text-xs font-semibold text-gray-500 w-[80px]">Kursus</TableHead>
            <TableHead className="px-4 py-4 text-left text-xs font-semibold text-gray-500 w-[140px]">Terdaftar</TableHead>
            <TableHead className="py-4 px-4 text-center text-xs font-semibold text-gray-500 w-[120px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-b border-gray-50">
                <TableCell className="py-4 pl-6 pr-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 bg-gray-50 rounded-xl animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-50 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-50 rounded animate-pulse" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4"><div className="h-6 w-20 bg-gray-50 rounded animate-pulse" /></TableCell>
                <TableCell className="px-4 py-4"><div className="h-6 w-24 bg-gray-50 rounded animate-pulse" /></TableCell>
                <TableCell className="px-4 py-4"><div className="flex gap-4"><div className="h-8 w-12 bg-gray-50 rounded animate-pulse" /></div></TableCell>
                <TableCell className="px-4 py-4"><div className="flex gap-4"><div className="h-8 w-12 bg-gray-50 rounded animate-pulse" /></div></TableCell>
                <TableCell className="px-4 py-4"><div className="h-6 w-24 bg-gray-50 rounded animate-pulse" /></TableCell>
                <TableCell className="px-6 py-4"><div className="flex gap-2 justify-center"><div className="h-8 w-8 bg-gray-50 rounded animate-pulse" /></div></TableCell>
              </TableRow>
            ))
          ) : tenants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <Building size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Belum ada tenant yang terdaftar dalam sistem
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tenants.map((tenant) => (
              <TableRow key={tenant.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                <TableCell className="py-4 pl-6 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all duration-200 border border-gray-100 group-hover:border-violet-100">
                      <Building size={20} variant="Bold" className="group-hover:text-template-primary transition-colors" />
                    </div>
                    <div className="overflow-hidden">
                      <p
                        className="text-sm font-bold text-gray-800 group-hover:text-template-primary transition-colors cursor-pointer truncate"
                        onClick={() => onViewDetail(tenant)}
                      >
                        {tenant.nama}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium font-mono truncate">
                        {tenant.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", getTypeColor(tenant.tipe))}>
                    {tenant.tipe}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-1.5 border rounded-full p-1 pl-1.5 w-fit bg-white border-gray-100">
                    {tenant.status === 'aktif' ? (
                      <TickCircle size={16} variant='Bold' className='text-emerald-500' />
                    ) : tenant.status === 'suspended' ? (
                      <CloseCircle size={16} variant='Bold' className='text-red-500' />
                    ) : (
                      <CloseCircle size={16} variant='Bold' className='text-gray-400' />
                    )}
                    <span className={cn(
                      "text-xs font-medium pr-2 capitalize",
                      tenant.status === 'aktif' ? "text-emerald-700" :
                        tenant.status === 'suspended' ? "text-red-700" : "text-gray-700"
                    )}>
                      {tenant.status === 'suspended' ? 'Suspended' : tenant.status === 'nonaktif' ? 'Non-Aktif' : 'Aktif'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-2 py-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{tenant.user_count || 0}</span>
                    <span className="text-[10px] text-gray-400">Users</span>
                  </div>
                </TableCell>
                <TableCell className="px-2 py-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{tenant.course_count || 0}</span>
                    <span className="text-[10px] text-gray-400">Kursus</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={14} className="text-gray-400" />
                    {formatTanggal(tenant.created_at, "short")}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => onViewDetail(tenant)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(tenant)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(tenant)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
