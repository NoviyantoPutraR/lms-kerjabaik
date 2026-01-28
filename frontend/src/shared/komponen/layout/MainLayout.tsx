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
        {/* Page Content - Wrapped Paper Effect */}
        <main className="flex-1 bg-white rounded-tl-2xl border-l border-t border-gray-200/50 shadow-[-4px_-4px_10px_rgba(0,0,0,0.01)] overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 relative ml-0 h-full w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
