import DropZone from "@/components/ui/DropZone";
import { FileText, Clock, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 w-full">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-black/10 dark:border-white/10 sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 font-bold">
              U
            </div>
            <div>
              <p className="font-bold">User Account</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-lg font-medium">
              <FileText size={18} />
              Files
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
              <Settings size={18} />
              Settings
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-8">
              <LogOut size={18} />
              Logout
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Upload Zone */}
        <div className="mb-12">
          <DropZone />
        </div>

        {/* Recent Files placeholder */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-muted-foreground" />
            Recent Files
          </h2>
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
            <div className="p-8 text-center text-muted-foreground">
              <div className="flex justify-center mb-4">
                <FileText size={48} className="opacity-20" />
              </div>
              <p>No recent files. Upload a PDF above to get started.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
