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

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="py-4 pl-6 pr-4 w-[350px]"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></th>
                <th className="px-4 py-4 w-[120px]"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></th>
                <th className="px-4 py-4 w-[140px]"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></th>
                <th className="px-4 py-4 w-[200px]"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></th>
                <th className="px-6 py-4 w-[120px]"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 pl-6 pr-4"><div className="flex gap-3"><div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse" /><div className="space-y-2"><div className="h-4 w-40 bg-gray-100 rounded animate-pulse" /><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></div></div></td>
                  <td className="px-4 py-4"><div className="h-6 w-20 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-4 py-4"><div className="h-6 w-24 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-4 py-4"><div className="flex gap-4"><div className="h-8 w-12 bg-gray-100 rounded animate-pulse" /><div className="h-8 w-12 bg-gray-100 rounded animate-pulse" /></div></td>
                  <td className="px-6 py-4"><div className="flex gap-2 justify-center"><div className="h-8 w-8 bg-gray-100 rounded animate-pulse" /><div className="h-8 w-8 bg-gray-100 rounded animate-pulse" /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
          <Building size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">
          Belum ada tenant yang terdaftar dalam sistem
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border boundary-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 pl-6 pr-4 text-left text-xs font-semibold text-gray-500 w-[350px]">Organisasi</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 w-[120px]">Tipe</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 w-[140px]">Status</th>
              <th className="px-2 py-4 text-center text-xs font-semibold text-gray-500 w-[80px]">Pengguna</th>
              <th className="px-2 py-4 text-center text-xs font-semibold text-gray-500 w-[80px]">Kursus</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 w-[140px]">Terdaftar</th>
              <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500 w-[120px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                <td className="py-4 pl-6 pr-4">
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
                </td>
                <td className="px-4 py-4">
                  <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", getTypeColor(tenant.tipe))}>
                    {tenant.tipe}
                  </span>
                </td>
                <td className="px-4 py-4">
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
                </td>
                <td className="px-2 py-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{tenant.user_count || 0}</span>
                    <span className="text-[10px] text-gray-400">Users</span>
                  </div>
                </td>
                <td className="px-2 py-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{tenant.course_count || 0}</span>
                    <span className="text-[10px] text-gray-400">Kursus</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={14} className="text-gray-400" />
                    {formatTanggal(tenant.created_at, "short")}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
