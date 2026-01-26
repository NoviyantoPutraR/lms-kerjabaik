import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/pustaka/utils";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  LogOut,
} from "lucide-react";
import { Button } from "@/komponen/ui/button";
import { useAuthStore } from "@/fitur/autentikasi/stores/authStore";

const navigation = [
  {
    name: "Dashboard",
    href: "/instruktur/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kursus Saya",
    href: "/instruktur/courses",
    icon: BookOpen,
  },
  {
    name: "Penilaian",
    href: "/instruktur/assessments",
    icon: ClipboardList,
  },
  {
    name: "Peserta",
    href: "/instruktur/students",
    icon: Users,
  },
];

export default function InstructorLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">LMS Academy</h1>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="mb-3 rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">{user?.nama_lengkap}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <p className="mt-1 text-xs">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
                Instruktur
              </span>
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
