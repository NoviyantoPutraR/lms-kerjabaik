import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { cn } from "@/pustaka/utils";

export function MainLayout() {
  return (
    <div className={cn(
      "flex flex-col md:flex-row bg-[#f3f4f6] w-full min-h-screen",
    )}>
      <Sidebar />

      <div className="flex flex-1 flex-col h-screen overflow-hidden relative">
        {/* Page Content - White with Rounded Top-Left */}
        <main className="flex-1 bg-white rounded-tl-2xl overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
